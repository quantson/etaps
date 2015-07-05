drag = false;

Template.feedAddNew.events({
	'dragstart .draggable': function (e) {
		e.target.style.opacity = '0.4';
		var dragPin = document.createElement('img');
		dragPin.src = 'pin_small.png';
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

Template.cards.helpers({
	'cards': function () {
		return Cards.find();
	}
});