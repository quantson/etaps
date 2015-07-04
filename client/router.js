Router.configure({
	layoutTemplate: 'ApplicationLayout',
	loadingTemplate: 'loading'
});

Router.onBeforeAction('loading');

Router.route('/', {
	name: 'home',
	yieldRegions: {
		'feedAddNew': {to: 'feedTop'},
		'cards': {to: 'feedBody'}
	}
});

Router.route('/etaps/new', {
	name: 'new_etap',
	yieldRegions: {
		'cardCreate': {to: 'feedTop'}
	},
	onBeforeAction: function () {
		if (Session.get('newMarker'))
			this.next();
		else
			Router.go('home');
	}
});

Router.route('/quentin', {
	name: 'profile',
	yieldRegions: {
		'profile': {to: 'feedTop'},
		'cards': {to: 'feedBody'}
	}
});