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