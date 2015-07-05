Meteor.startup(function () {
	GoogleMaps.load();
  
  sAlert.config({
      effect: 'scale',
      position: 'top-right',
      timeout: 5000,
      html: false,
      onRouteClose: true,
      stack: true,
      offset: '5px'
  });

});
