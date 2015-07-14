Template.card.onCreated(function () {
	var location = this.data.position;
	Markers.insert({lat: location.A, lng: location.F, icon: cardThumbUrl(this.data)});
});

Template.card.onRendered(function () {
	$('.grid').isotope('insert', this.$(".grid-item")).isotope();
});

Template.card.onDestroyed(function () {
	$('.grid').isotope('remove', this.$(".grid-item")).isotope();
	var location = this.data.position;
	markerId = Markers.findOne({lat: location.A, lng: location.F});
	if (markerId)
		Markers.remove(markerId); 
});



Template.card.helpers({

	'fromNow': function () {
		return moment(this.submitted).fromNow();
	},

	'timestamp': function () {
		return moment(this.submitted).unix();
	},

	'avatarThumbUrl': function () {
		return cardThumbUrl(this);
	},
	'cardImageUrl': function () {
		return ImageThumbs.findOne(this.imageThumbId).url();
	}

});
	
cardThumbUrl = function (card) {
	var cardOwner = Meteor.users.findOne(card.userId), thumbId;
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
};