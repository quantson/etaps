Template.card.onRendered(function () {
	$('.grid').masonry({
	  // options
	  columnWidth: '.grid-sizer',
	  itemSelector: '.grid-item',
  	percentPosition: true,
  	gutter: '.gutter-sizer'
	});	
});

Template.card.helpers({
	'fromNow': function () {
		return moment(this.submitted).fromNow();
	},
	'avatarUrl': function () {
		var cardOwner = Meteor.users.findOne(this.userId), avatarId;
		if (!!cardOwner) {
			avatarId = cardOwner.profile.avatarId;
		}

		if (!!avatarId) {
      return Avatars.findOne(avatarId).url();
    } else {
      return '/default-avatar.png';
    }
	}
});
