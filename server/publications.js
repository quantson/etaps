Meteor.publish('users', function () {
	return Meteor.users.find({}, {fields: {'username': 1, 'profile.avatarId': 1, 'profile.avatarThumbId': 1}});
});

Meteor.publish('cards', function (query, options) {
	return Cards.find(query, options);
});

Meteor.publish('avatars', function () {
	return Avatars.find();
});

Meteor.publish('avatarThumbs', function () {
	return AvatarThumbs.find();
});

Meteor.publish('images', function () {
	return Images.find();
});

Meteor.publish('imageThumbs', function () {
	return ImageThumbs.find();
});

// Meteor.publish('markers', function () {
// 	return Markers.find();
// });