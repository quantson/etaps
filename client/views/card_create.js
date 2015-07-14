Template.cardCreate.onCreated(function() {
  Session.set('cardCreateErrors', {});
});

Template.cardCreate.helpers({
  errorMessage: function(field) {
    return Session.get('cardCreateErrors')[field];
  },
  errorClass: function (field) {
    return !!Session.get('cardCreateErrors')[field] ? 'has-error' : '';
  },
  locations: function () {
    //todo: add flash effect on change
    return Session.get('newMarker') && Session.get('newMarker').reverse_geo;
  }
});

Template.cardCreate.events({
  'change .location': function (e) {
    if ($(e.target).val() === 'custom')
      $('.customLocDiv').show();
    else
      $('.customLocDiv').hide();
  },

  'submit form': function(e) {
    e.preventDefault();

    var markerEl = Session.get('newMarker');  
    var card = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      location: $(e.target).find('[name=customLoc]').val() || $(e.target).find('[name=location]').val(),
      position: new google.maps.LatLng(markerEl.lat, markerEl.lng),
    };

    var errors = validateCard(card);
    if (!_.isEmpty(errors))
      return Session.set('cardCreateErrors', errors);

    $('.submit-card').text(' Creating etap').prop('disabled', true);
    $('.glyphicon-ok-circle').removeClass('glyphicon-ok-circle').addClass('glyphicon-cog uploading');

    //upload image and thumb to respective collections if user uploaded image
    var imageThumbId, imageId; //IDs to insert in card info
    if (!!Session.get('cardImageThumb_upload') && !!Session.get('cardImage_upload')) {
      //first insert thumb in collection
      ImageThumbs.insert(Session.get('cardImageThumb_upload'), function (error, thumb) {
        imageThumbId = thumb._id;

        if (error)
            sAlert.error(error.reason);
      });

      //then insert image and insert card on upload completed
      Images.insert(Session.get('cardImage_upload'), function (error, image) {
        if (error)
           return sAlert.error(error.reason);

        image.thumbId = imageThumbId;
        imageId = image._id;

        var cursor = Images.find(imageId);
        
        var liveQuery = cursor.observe({
          changed: function (newImage, oldImage) {
            if (newImage.isUploaded()) {
              liveQuery.stop();

              _.extend(card, {
                imageThumbId: imageThumbId,
                imageId: imageId
              });

              insert(card);
              Session.set('cardImageThumb_upload', null);
              Session.set('cardImage_upload', null);
            }  
          }  
        });

      });
    } else {
      insert(card);
    }
    
  }

});

Template.cardCreate.onDestroyed( function () {
  if (Session.get('newMarker'))
    unpin(Session.get('newMarker').id);
  Session.set('newMarker', null);
  Session.set('cardImageThumb_upload', null);
  Session.set('cardImage_upload', null);
});

insert = function (card) {
  Meteor.call('cardInsert', card, function(error, result) {
    // display the error to the user and abort
    if (error)
      return sAlert.error(error.reason);

    Router.go('home');  
  });
};