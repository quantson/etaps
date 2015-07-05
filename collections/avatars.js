var avatarStore = new FS.Store.FileSystem("avatars", {
  path: "~/app-files/avatars", //optional, default is "/cfs/files" path within app container
  maxTries: 1 //optional, default 5
});

Avatars = new FS.Collection("avatars", {
	stores: [avatarStore],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});