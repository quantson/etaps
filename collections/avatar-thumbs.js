var avatarThumbStore = new FS.Store.GridFS("avatarThumbStore");

AvatarThumbs = new FS.Collection("avatarThumbs", {
	stores: [avatarThumbStore],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

AvatarThumbs.deny({
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

AvatarThumbs.allow({
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