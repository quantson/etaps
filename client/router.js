Router.configure({
	layoutTemplate: 'ApplicationLayout',
	loadingTemplate: 'loading'
});

Router.onBeforeAction('loading');

Router.route('/', {
	name: 'home',
	yieldRegions: {
		'feedAddNew': {to: 'feedTop'}
	}
});

Router.route('/etaps/new', {
	name: 'new_etap',
	yieldRegions: {
		'cardCreate': {to: 'feedTop'}
	},
	onBeforeAction: function () {
		var newMarkers = Markers.find({type: 'addNew'}).count();
		if (newMarkers > 1) {
			Meteor.call('removeMarker');
			Router.go('home');
		} else if (newMarkers === 1) {
			this.next();
		}

	},
	waitOn: function () {
		return Meteor.subscribe('newMarkers');
	}
});