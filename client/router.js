Router.configure({
	layoutTemplate: 'ApplicationLayout',
	loadingTemplate: 'loading',
	waitOn: function () {
		return [Meteor.subscribe('users'), Meteor.subscribe('avatars'), Meteor.subscribe('avatarThumbs')];
	}
});

Router.onBeforeAction('loading');

Router.route('/', {
	name: 'home',
	yieldRegions: {
		'feedAddNew': {to: 'feedTop'},
		'cards': {to: 'feedBody'}
	},
	waitOn: function () {
		return Meteor.subscribe('cards');
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
	},
	waitOn: function () {
		//wait for users to be loaded
		var userId = Meteor.users.findOne({'username': this.params.username}) && Meteor.users.findOne({'username': this.params.username})._id;
		if (userId)
			return Meteor.subscribe('userCards', userId);
	}
});