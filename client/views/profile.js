Template.profile.events({
  'change .input-file': function(event, template) {
    FS.Utility.eachFile(event, function(file) {
      Avatars.insert(file, function (err, fileObj) {
        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
      });
    });
  }
});