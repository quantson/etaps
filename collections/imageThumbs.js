var imageThumbStore = new FS.Store.GridFS("imageThumbStore");

ImageThumbs = new FS.Collection("imageThumbs", {
	stores: [imageThumbStore],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

ImageThumbs.deny({
	insert: function(){
		return false;
	},
	update: function(){
		return false;
	},
	remove: function(){
		return false;
	},
	download: function(){
		return false;
	}
});

ImageThumbs.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(){
		return true;
	},
	remove: function(userId, doc) {
		return true;
	},
	download: function(){
		return true;
	}
});