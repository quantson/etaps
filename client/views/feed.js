drag = false;

Template.feedAddNew.helpers({
	'pinUrl': function () {
		if (Meteor.user() && !!Meteor.user().profile) {
			var thumbId = Meteor.user().profile.avatarThumbId;
			if (thumbId && AvatarThumbs.findOne(thumbId))
				return AvatarThumbs.findOne(thumbId).url();
			else
				return '/default-avatar.png';
		}
	}
});

Template.feedAddNew.events({
	'dragstart .draggable': function (e) {
		e.target.style.opacity = '0.4';
		var dragPin = document.createElement('img');
		dragPin.src = 'pin-small.png';
		e.originalEvent.dataTransfer.setDragImage(dragPin, 17.5, 49);
		drag = true;
	},
	'dragend .draggable': function (e) {
		e.target.style.opacity = '1';
		setTimeout(function () { drag = false; }, 100);		
	},
	'click .pin_frame': function (e) {
		e.preventDefault();
		$('#pin').addClass('bounce');
		setTimeout(function () {
			$('#pin').removeClass('bounce');
		}, 2000);
	}
});


Template.cards.onCreated(function () {
	var self = this;
	var sub;
	this.subscribe('users', function () {
		Session.set('users_loaded', true);
	});

	Tracker.autorun(function () {
		if (Session.get('users_loaded')) {
			if (sub)
				sub.stop();

			var reactiveRoute = Router.current();
			var query = {};

			if (reactiveRoute.route.getName() === 'profile') {
				var userId = Meteor.users.findOne({username: Router.current().params.username})._id;
				query = {userId: userId};
			}

			sub = self.subscribe('cards', query, {sort: {submitted: -1, _id: -1}});
		}
	});

});

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

Template.cards.helpers({
	'cards': function () {
		return Cards.find();
	}
});
