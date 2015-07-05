Template.header.helpers({
	'username': function () {
		return Meteor.user().username;
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