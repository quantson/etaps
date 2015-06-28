Template.map.helpers({
	MapOptions: function () {
		if (GoogleMaps.loaded()) {
			return {
				center: {lat: 0, lng: 0},
				zoom: 4,
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
		
		getNewCenter = function () {
			var bounds = map.getBounds(),
				ne = bounds.getNorthEast(),
				sw = bounds.getSouthWest(),
				widthLng = ne.lng() - sw.lng(),
				newLng = sw.lng() + 0.66*widthLng;
				return new google.maps.LatLng(map.getCenter().lat(), newLng);
		};

		//Get the real center for our map at all time
		newCenter = getNewCenter();
		google.maps.event.addListener(map, 'bounds_changed', function() {
			newCenter = getNewCenter();
		});	

		//add pin on click
	  google.maps.event.addListener(map, 'mouseover', function (e) {
    	if (drag) 
	    	placeMarker(e.latLng, map);
		});

	  
	});

	function placeMarker (position, map) {
		var image = {
		  url: '/pin-small.png',
		  size: new google.maps.Size(35, 49),
		  origin: new google.maps.Point(0, 0),
		  anchor: new google.maps.Point(17.5	, 49),
		  // scaledSize: new google.maps.Size(25, 25)
		};

		var marker = new google.maps.Marker({
			position: position,
			map: map,
			animation: google.maps.Animation.DROP,
			icon: 'pin_small.png',
		  draggable: true,
		});
		//get the map to pan tomake the pin in the center
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
	}
});