Markers = new Mongo.Collection('markers');

Meteor.publish("newMarkers", function () {
	return Markers.find({type: 'addNew'});
});

Meteor.methods({
	removeMarker: function () {
		//todo: add user check
		Markers.remove({type: 'addNew'});
	}
});

