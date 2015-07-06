Template.header.helpers({
	'username': function () {
		return Meteor.user().username;
	},
	'avatarUrl': function () {
		if (!!Meteor.user() && !!Avatars.findOne(Meteor.user().profile.avatarId)) {
      return Avatars.findOne(Meteor.user().profile.avatarId).url();
    } else {
      return '/default-avatar.png';
    }
	}
});

Template.loggedInButton.events({
	'click #logout': function () {
		Meteor.logout(function (err) {
			//show error to client, check  if err is good syntax
			sAlert.error(err);
		});
	}
});