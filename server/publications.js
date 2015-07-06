Meteor.publish('users', function () {
	return Meteor.users.find({}, {fields: {'username': 1, 'profile.avatarId': 1}});
});

Meteor.publish('userCards', function (userId) {
	return Cards.find({userId: userId});
});

Meteor.publish('cards', function () {
	return Cards.find();
});

Meteor.publish('avatars', function () {
	return Avatars.find();
});