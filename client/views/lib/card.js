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
	}
});
