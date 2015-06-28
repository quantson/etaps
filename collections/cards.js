Cards = new Mongo.Collection('cards');

Meteor.methods({
	cardInsert: function (cardAttributes) {

		//Server side checks
		var user = Meteor.user();
		var card = _.extend(cardAttributes, {
			userId: user._id,
			author: user.username,
			submitted: new Date(),
			likers: [],
			likes: 0
		});

		var cardId = Cards.insert(card);

		return {
			_id: cardId
		};
	}
});