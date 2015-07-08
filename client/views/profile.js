Template.profile.helpers({
	'ownProfile': function () {
		return Meteor.userId() === this._id;
	},
  'avatarUrl': function () {
    if (!!this.profile && !!Avatars.findOne(this.profile.avatarId)) {
      return Avatars.findOne(this.profile.avatarId).url();
    } else {
      return '/default-avatar.png';
    }
  }
});