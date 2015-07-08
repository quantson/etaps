var cardImageStore = new FS.Store.GridFS("cardImages");

CardImages = new FS.Collection("cardImages", {
	stores: [cardImageStore],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});