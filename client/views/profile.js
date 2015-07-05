Template.profile.events({
  'change .input-file': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
    	file.owner = Meteor.userId();
      Avatars.insert(file, function (error, fileObj) {
        if (error)
        	sAlert.error(error.reason);
        else {
        	if (Meteor.user().profile.avatar) {
        		formerAvatarId = Meteor.user().profile.avatar.substr(19);
        		Avatars.remove(formerAvatarId);
        	}
        	var userId = Meteor.userId();
          var avatarURL = {
            'profile.avatar': '/cfs/files/avatars/' + fileObj._id
          };
          Meteor.users.update(userId, {$set: avatarURL});
        }
      });
    });
  }
});

Template.profile.helpers({
	'ownProfile': function () {
		return Meteor.userId() === this._id;
	}
});