Meteor.publish('users', function () {
	return Meteor.users.find({}, {fields: {'username': 1, 'profile.avatarId': 1, 'profile.avatarThumbId': 1}});
});

Meteor.publish('userCards', function (userId) {
	return Cards.find({userId: userId});
});

Meteor.publish('cards', function (options) {
	return Cards.find({}, options);
});

Meteor.publish('avatars', function () {
	return Avatars.find();
});

Meteor.publish('avatarThumbs', function () {
	return AvatarThumbs.find();
});