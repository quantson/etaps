Router.configure({
	layoutTemplate: 'ApplicationLayout',
	loadingTemplate: 'loading',
	waitOn: function () {
		return [Meteor.subscribe('users'), Meteor.subscribe('avatars')];
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
		var userId = Meteor.users.findOne() && Meteor.users.findOne()._id;
			if (userId)
				return Meteor.subscribe('userCards', userId);
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
		'cards': {to: 'feedBody'}
	},
	waitOn: function () {
		//wait for users to be loaded
		var userId = Meteor.users.findOne({'username': this.params.username}) && Meteor.users.findOne({'username': this.params.username})._id;
		if (userId)
			return Meteor.subscribe('userCards', userId);
	}
});