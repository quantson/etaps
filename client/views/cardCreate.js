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
    return Markers.findOne() && Markers.findOne().reverse_geo;
  }
});

Template.cardCreate.events({
  'change .location': function (e) {
    console.log($(e.target).val());
    if ($(e.target).val() === 'custom')
      $('.customLocDiv').show();
    else
      $('.customLocDiv').hide();
  },

  'submit form': function(e) {
    e.preventDefault();
    
    var card = {
      title: $(e.target).find('[name=title]').val(),
      description: $(e.target).find('[name=description]').val(),
      location: $(e.target).find('[name=customLoc]').val() || $(e.target).find('[name=location]').val(),
      // file: $(e.target).find('[name=title]').val(),
    };
    
    var errors = validateCard(card);
    if (errors.title || errors.url)
      return Session.set('cardCreateErrors', errors);
    
    Meteor.call('cardInsert', card, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);
      
      // show this result but route anyway
      if (result.postExists)
        throwError('This link has already been posted');
      
      // Router.go('postPage', {_id: result._id});  
    });
  },

  'click .cancel': function (e) {
    e.preventDefault();
    if (Markers.findOne()) {
      var markerId = Markers.findOne()._id;
      Markers.remove({ _id: markerId });
    }
    Router.go('home');
  }
});