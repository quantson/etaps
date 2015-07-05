Cards = new Mongo.Collection('cards');

validateCard = function (card) {
  var errors = {};

  if (!card.title)
    errors.title = "Please fill in a headline";

  if (!card.location)
    errors.location = "Please select a location";
  
  if (card.location === 'custom')
    errors.customLoc = "Please fill in a custom location";

  return errors;
};

Meteor.methods({
	cardInsert: function (cardAttributes) {

		var errors = validateCard(cardAttributes);
    if (!_.isEmpty(errors))
      throw new Meteor.Error('invalid-post', "You must set a title and location for your post");

		//Server side checks
		var user = Meteor.user();
		var card = _.extend(cardAttributes, {
			userId: user._id,
			author: user.username,
			submitted: moment(),
			likers: [],
			likes: 0
		});

		return Cards.insert(card);
	}
});
