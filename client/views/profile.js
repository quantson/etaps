Template.profile.events({
  'change .input-file': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
    	file.owner = Meteor.userId();
      Avatars.insert(file, function (error, fileObj) {
        if (error)
        	sAlert.error(error.reason);
        else{
          var userId = Meteor.userId();
          if (Meteor.users.findOne(userId).profile.avatar) {
            formerAvatarId = Meteor.users.findOne(userId).profile.avatar.substr(19);
            Avatars.remove(formerAvatarId);
          }
          var avatarId = {
            'profile.avatarId': fileObj._id
          };
          Meteor.users.update(userId, {$set: avatarId});
        }
      });
    });
  }
});

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