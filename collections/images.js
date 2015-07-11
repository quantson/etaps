var imageStore = new FS.Store.GridFS("images");

Images = new FS.Collection("images", {
	stores: [imageStore],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

Images.deny({
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

Images.allow({
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