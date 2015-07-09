Template.avatarChange.events({

  'change #inputImage': function(event, template) {
    var $inputImage = $('#inputImage'),
    		$image = $('#crop'),
        URL = window.URL || window.webkitURL,
        blobURL;

    if (URL) {
      var files = event.target.files,
          file;

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+$/.test(file.type)) {
          blobURL = URL.createObjectURL(file);
          $('#avatar-crop-modal').modal('toggle');
          $image.attr('src', blobURL);
          $image.one('built.cropper', function () {
            URL.revokeObjectURL(blobURL); // Revoke when load complete
          });
          $inputImage.val('');
          $image.cropper({
			  		autoCropArea: 0.5,
			  		aspectRatio: 1/1,
			  		preview: '.img-preview'
				  });
        } else {
          alert('Please choose an image file.');
        }
      }
    } 
  },
});

Template.avatarModal.events({

  'hidden.bs.modal': function () {
	  $('#crop').cropper('destroy');
	},

	'click .crop-action>.btn': function (e) {
		var $btn = $(e.target).is('.btn') ? $(e.target) : $(e.target).parent();
		$('#crop').cropper($btn.data("method"), $btn.data("option"));
	},

	'click #submitCrop': function () {
		$('.upload-txt').text(' Uploading...').prop('disabled', true);
    $('.glyphicon-upload').removeClass('glyphicon-upload').addClass('glyphicon-cog uploading');

		//Create a canvas for avatar and thumb and get dataURL
		var avatarThumbURL = $('#crop').cropper('getCroppedCanvas', {
			width: 100,
			heigt: 100
		}).toDataURL();	
		var avatarURL = $('#crop').cropper('getCroppedCanvas', {
			width: 300,
			heigt: 300
		}).toDataURL();

    //Hide Canvas
    $('#avatar-crop-modal').modal('toggle');

		var thumbId, avatarThumbId, avatarId;
		//upload avatar and thumb to respective collections
    AvatarThumbs.insert(avatarThumbURL, function (error, thumb) {
    	thumbId = thumb._id;

      if (error)
          sAlert.error(error.reason);
      else { 
        //set avatarThumbId for replacement
        var userId = Meteor.userId();
        avatarThumbId = {
          'profile.avatarThumbId': thumb._id
        };
      }
    });

    Avatars.insert(avatarURL, function (error, avatar) {
      if (error)
          sAlert.error(error.reason);
      else { 
        //set avatarId for replacement
        avatarId = {
          'profile.avatarId': avatar._id
        };
      }
      avatar.thumb = thumbId;

      var cursor = Avatars.find(avatar._id);
      var liveQuery = cursor.observe({
        changed: function (newAvatar, oldAvatar) {
          if (newAvatar.isUploaded()) {
            liveQuery.stop();
          
            //remove old avatar (if set) and set new one
            if (Meteor.user().profile.avatarThumbId) {
              formerAvatarThumbId = Meteor.user().profile.avatarThumbId;
              AvatarThumbs.remove(formerAvatarThumbId);
            }
            Meteor.users.update(Meteor.userId(), {$set: avatarThumbId});
            if (Meteor.user().profile.avatarId) {
              formerAvatarId = Meteor.user().profile.avatarId;
              Avatars.remove(formerAvatarId);
            }
            Meteor.users.update(Meteor.userId(), {$set: avatarId});

    				$('.upload-txt').text(' Change picture').prop('disabled', true);
            $('.uploading').removeClass('glyphicon-cog uploading').addClass('glyphicon-upload');
    			}
    		}
    	});
    });	
	}

});

// Template.avatarModal.helpers({
// 	avatars: function () {
// 		return Avatars.find();
// 	}
// });
