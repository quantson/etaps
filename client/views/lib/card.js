Template.cards.onRendered(function () {
	$('.grid').isotope({
	  // options
  	
  	getSortData: {
    	timestamp: '[data-timestamp]',
    },
		sortBy: 'timestamp',
 		sortAscending: false,

	  itemSelector: '.grid-item',
  	percentPosition: true,
	  masonry: {
	  columnWidth: '.grid-sizer',
  	gutter: '.gutter-sizer'
	  },

	});
});

Template.card.onRendered(function () {
	$('.grid').isotope('insert', this.$(".grid-item")).isotope();
});

Template.card.onDestroyed(function () {
	$('.grid').isotope('remove', this.$(".grid-item")).isotope();
});



Template.card.helpers({

	'fromNow': function () {
		return moment(this.submitted).fromNow();
	},

	'timestamp': function () {
		return moment(this.submitted).unix();
	},

	'avatarThumbUrl': function () {
		var cardOwner = Meteor.users.findOne(this.userId), thumbId;
		//get avatarThumb _id from card owner
		if (!!cardOwner) {
			thumbId = cardOwner.profile.avatarThumbId;
		}
		//get thumb url or return default
		if (!!thumbId) {
      return AvatarThumbs.findOne(thumbId).url();
    } else {
      return '/default-avatar.png';
    }
	}

});
