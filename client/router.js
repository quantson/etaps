Router.configure({
	layoutTemplate: 'ApplicationLayout',
	loadingTemplate: 'loading',
	waitOn: function () {
		return [Meteor.subscribe('avatars'), Meteor.subscribe('avatarThumbs'), Meteor.subscribe('imageThumbs'), Meteor.subscribe('images')];
	}	
});

Router.onBeforeAction('loading');

Router.route('/', {
	name: 'home',
	yieldRegions: {
		'feedAddNew': {to: 'feedTop'},
		'cards': {to: 'feedBody'}
	},
});

Router.route('/etaps/new', {
	name: 'new_etap',
	yieldRegions: {
		'cardCreate': {to: 'feedTop'},
		'imageModal': {to: 'modal'}
	},
	onBeforeAction: function () {
		if (Session.get('newMarker'))
			this.next();
		else
			Router.go('home');
	}
});

//always leave at bottom to avoid conflict with other routes
Router.route('/:username', {
	name: 'profile',
	data: function () {
		return Meteor.users.findOne({username: this.params.username});
	},
	yieldRegions: {
		'profile': {to: 'feedTop'},
		'cards': {to: 'feedBody'},
		'avatarModal': {to: 'modal'}
	}
});