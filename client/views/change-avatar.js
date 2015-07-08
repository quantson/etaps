Template.changeAvatar.events({

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
	  $('#submitCrop').text('Save and upload').prop('disabled', false);
	},

	'click .crop-action>.btn': function (e) {
		var $btn = $(e.target).is('.btn') ? $(e.target) : $(e.target).parent();
		$('#crop').cropper($btn.data("method"), $btn.data("option"));
	},

	'click #submitCrop': function () {
		$('#submitCrop').text('Uploading...').prop('disabled', true);

		//Create a canvas for avatar and thumb and get dataURL
		var avatarThumbURL = $('#crop').cropper('getCroppedCanvas', {
			width: 100,
			heigt: 100
		}).toDataURL();	
		var avatarURL = $('#crop').cropper('getCroppedCanvas', {
			width: 300,
			heigt: 300
		}).toDataURL();

		console.log(avatarThumbURL);
		var thumbId;
		//upload avatar and thumb to respective collections
    AvatarThumbs.insert(avatarThumbURL, function (error, thumb) {
    	thumbId = thumb._id;

      if (error)
          sAlert.error(error.reason);
      else { 
        //remove old avatarThumb and set new one
        var userId = Meteor.userId();
        if (Meteor.users.findOne(userId).profile.avatarThumb) {
          formerAvatarThumbId = Meteor.users.findOne(userId).profile.avatarThumbId;
          AvatarThumbs.remove(formerAvatarThumbId);
        }
        var avatarThumbId = {
          'profile.avatarThumbId': thumb._id
        };
        Meteor.users.update(userId, {$set: avatarThumbId});
      }
    });

    Avatars.insert(avatarURL, function (error, avatar) {
      if (error)
          sAlert.error(error.reason);
      else { 
        //remove old avatar and set new one
        var userId = Meteor.userId();
        if (Meteor.users.findOne(userId).profile.avatarId) {
          formerAvatarId = Meteor.users.findOne(userId).profile.avatarId;
          Avatars.remove(formerAvatarId);
        }
        var avatarId = {
          'profile.avatarId': avatar._id
        };
        Meteor.users.update(userId, {$set: avatarId});
      }
      avatar.thumb = thumbId;

    	var cursor = Avatars.find(avatar._id);
    	var liveQuery = cursor.observe({
    		changed: function (newAvatar, oldAvatar) {
    			if (newAvatar.isUploaded()) {
    				liveQuery.stop();
    				setTimeout(function () { $('#avatar-crop-modal').modal('toggle'); }, 1000);
    			}
    		}
    	});
    });	
	}

});

Template.avatarModal.helpers({
	avatars: function () {
		return Avatars.find();
	}
});
