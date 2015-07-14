Template.map.helpers({
	MapOptions: function () {
		if (GoogleMaps.loaded()) {
			return {
				center: {lat: 0, lng: 0},
				zoom: 2,
				disableDefaultUI: true,
				zoomControl: true,
         		zoomControlOptions: {
		          style: google.maps.ZoomControlStyle.SMALL,
		          position: google.maps.ControlPosition.RIGHT_TOP
		        },
		        minZoom: 2
			};
		}
	}
});

Template.map.events({
	'dragover .map-container': function (e) {
		if (e.preventDefault) {
    	e.preventDefault(); // Necessary. Allows us to drop.
  	}
  	return false;
	}
});

Template.map.onCreated(function () {

	//When map is ready initialize
	GoogleMaps.ready('map', function (myMap) {
		var map = myMap.instance;
		
		//Get the real center for our map at all time
		newCenter = getNewCenter(map);
		google.maps.event.addListener(map, 'bounds_changed', function() {
			newCenter = getNewCenter(map);
		});

		//initialize global marker list in object
		markers = {};

		//initialize new Etap marker function and repeat when newEtap Session is changed
		Tracker.autorun(function () {
			//only pin if current path is newEtap
			if (Router.current().route.path(this) === '/etaps/new') {
				pinNewEtap(map);
			}
		});

		var myoverlay = new google.maps.OverlayView();
  	myoverlay.draw = function () {
	    //this assigns an id to the markerlayer Pane, so it can be referenced by CSS
	    this.getPanes().markerLayer.id='markerLayer'; 
	  };
	  myoverlay.setMap(map);

		//dburles reactive markers code
		Markers.find().observe({  
		  added: function(document) {

		  	

		    // Create a marker for this document
		    var marker = new google.maps.Marker({
		      draggable: false,
		      animation: google.maps.Animation.DROP,
		      position: new google.maps.LatLng(document.lat, document.lng),
		      map: map,
		      icon: pinImage(document.icon),
		      optimized: false,
		      // We store the document _id on the marker in order 
		      // to update the document within the 'dragend' event below.
		      id: document._id
		    });

		    // This listener lets us drag markers on the map and update their corresponding document.
		    google.maps.event.addListener(marker, 'dragend', function(e) {
		    	reverseGeocode(e.latLng, function (locations) {
			      Markers.update(marker.id, { $set: { lat: e.latLng.lat(), lng: e.latLng.lng(), reverse_geo: locations }});
		    	});
		    });

		    // Store this marker instance within the markers object.
		    markers[document._id] = marker;
				
		  },
		  changed: function(newDocument, oldDocument) {
		    markers[newDocument._id].setPosition({ lat: newDocument.lat, lng: newDocument.lng });
		  },
		  removed: function(oldDocument) {
		    // Remove the marker from the map
		    markers[oldDocument._id].setMap(null);

		    // Clear the event listener
		    google.maps.event.clearInstanceListeners(
		      markers[oldDocument._id]);

		    // Remove the reference to this marker instance
		    delete markers[oldDocument._id];
		  }
		});

		//add pin on click and initiate card creation
	  google.maps.event.addListener(map, 'mouseover', function (e) {
    	if (drag) {
    		var position = e.latLng;

	    	//get location names in an array
		    reverseGeocode(position, function (locations) {

		    	//add pin with location
		    	Session.set('newMarker', {lat: position.lat(), lng: position.lng(), reverse_geo: locations, id: new Mongo.ObjectID()._str});
					
					//get the map to pan so the pin in the new center
					var bounds = map.getBounds(),
							ne = bounds.getNorthEast(),
							sw = bounds.getSouthWest(),
							widthLng = ne.lng() - sw.lng(),
							diffCenter = Math.abs(position.lng() - newCenter.lng()) / widthLng,
							newLng = position.lng() - 0.166*(1-diffCenter)*widthLng,
							newPos = new google.maps.LatLng(position.lat(), newLng);

					setTimeout(function() {
						map.panTo(newPos);
					}, 500);

		    	//route to cardCreate
		    	Router.go('new_etap');
		  	});
		  	
		  }	
		});

	});

});

getNewCenter = function (map) {
	var bounds = map.getBounds(),
		ne = bounds.getNorthEast(),
		sw = bounds.getSouthWest(),
		widthLng = ne.lng() - sw.lng(),
		newLng = sw.lng() + 0.66*widthLng;
		return new google.maps.LatLng(map.getCenter().lat(), newLng);
};

pinImage = function (url) {
	return {
		url: url,
    // This marker is 20 pixels wide by 32 pixels tall.
    size: new google.maps.Size(30, 30),
    // The origin for this image is 0,0.
    origin: new google.maps.Point(0,0),
    // The anchor for this image is the base of the flagpole at 0,32.
    anchor: new google.maps.Point(15, 44),
    scaledSize: new google.maps.Size(30, 30),
  };
};

//return a callback function with argument an array of geo-names of the position
reverseGeocode = function (position, callback) {
	
	var locations = [];

	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'location': position}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results) {
      	_.each(results, function (result) {
      		locations.push(result.formatted_address);
      	});
      } 
    }

    callback(locations);
	});
};

pinNewEtap = function (map) {
	var markerEl = Session.get('newMarker');
	//don't pin when we move marker on the map
  
  if (markerEl && !markerEl.changed) {
	  var marker = new google.maps.Marker({
	    draggable: true,
	    animation: google.maps.Animation.DROP,
	    position: new google.maps.LatLng(markerEl.lat, markerEl.lng),
	    map: map,
	    icon: pinImage(AvatarThumbs.findOne(Meteor.user().profile.avatarThumbId).url())
	  });

	  // This listener lets us drag markers on the map and update their corresponding document.
	  google.maps.event.addListener(marker, 'dragend', function(e) {
	  	reverseGeocode(e.latLng, function (locations) {
	      Session.set('newMarker', { lat: e.latLng.lat(), lng: e.latLng.lng(), reverse_geo: locations, id: markerEl.id, changed: true });
	  	});
	  });

	  markers[markerEl.id] = marker;

	} 
};	

unpin = function (markerId) {
    // Remove the marker from the map
    markers[markerId].setMap(null);

    // Clear the event listener
    google.maps.event.clearInstanceListeners(
      markers[markerId]);

    // Remove the reference to this marker instance
    delete markers[markerId];
};

		