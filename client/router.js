Router.configure({
	layoutTemplate: 'ApplicationLayout'
});

Router.route('/', {
	name: 'home',
	yieldRegions: {
		'feedAddNew': {to: 'feedTop'}
	},
	waitOn : function() {
		return Meteor.subscribe('markers');
	}
});

Router.route('/etaps/new', {
	name: 'new_etap',
	yieldRegions: {
		'cardCreate': {to: 'feedTop'}
	},
	waitOn : function() {
		return Meteor.subscribe('markers');
	}
});