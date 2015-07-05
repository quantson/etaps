var avatarStore = new FS.Store.GridFS("avatars");

Avatars = new FS.Collection("avatars", {
	stores: [avatarStore],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

Avatars.deny({
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

Avatars.allow({
	insert: function(userId, doc) {
		return userId === doc.owner;
	},
	update: function(){
		return true;
	},
	remove: function(userId, doc) {
		return userId === doc.owner;
	},
	download: function(){
		return true;
	}
});