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
	'avatarThumbUrl': function () {
		var cardOwner = Meteor.users.findOne(this.userId), thumbId;
		//get avatarThumb _id from card owner
		if (!!cardOwner) {
			thumbId = cardOwner.profile.avatarThumbId;
		}
		console.log(thumbId);
		//get thumb url or return default
		if (!!thumbId) {
      return AvatarThumbs.findOne(thumbId).url();
    } else {
      return '/default-avatar.png';
    }
	}
});
