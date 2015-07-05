Meteor.publish('users', function () {
	return Meteor.users.find({}, {fields: {'username': 1}});
});

Meteor.publish('userCards', function (userId) {
	return Cards.find({userId: userId});
});