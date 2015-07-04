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

validateCard = function (card) {
  var errors = {};

  if (!card.title)
    errors.title = "Please fill in a headline";

  if (card.location === 'select')
    errors.location = "Please select a location";
  
  if (card.location === 'custom')
    errors.customLoc = "Please fill in a custom location";

  return errors;
};