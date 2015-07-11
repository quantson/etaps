Template.imageUpload.events({

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
          $('#image-crop-modal').modal('toggle');
          $image.attr('src', blobURL);
          $image.one('built.cropper', function () {
            URL.revokeObjectURL(blobURL); // Revoke when load complete
          });
          $inputImage.val('');
          $image.cropper({
			  		autoCropArea: 1,
			  		guides: false,
				  });
        } else {
          alert('Please choose an image file.');
        }
      }
    } 
  },

  'uploading': function () {
    return !!Session.get('cardImage_upload');
  }
});

Template.imageModal.events({

  'hidden.bs.modal': function () {
	  $('#crop').cropper('destroy');
	},

	'click .crop-action>.btn': function (e) {
		var $btn = $(e.target).is('.btn') ? $(e.target) : $(e.target).parent();
		$('#crop').cropper($btn.data("method"), $btn.data("option"));
	},

	'click #submitCrop': function () {
		//Create a canvas for image and thumb and get dataURL
		var imageThumbURL = $('#crop').cropper('getCroppedCanvas', {
			width: 300
		}).toDataURL();
		var imageURL = $('#crop').cropper('getCroppedCanvas', {
			width: 1000
		}).toDataURL();

    Session.set('cardImageThumb_upload', imageThumbURL);
    Session.set('cardImage_upload', imageURL);

    //Hide Canvas
    $('#image-crop-modal').modal('toggle');

    $('.image-preview').attr('src', imageThumbURL);
  }

});



