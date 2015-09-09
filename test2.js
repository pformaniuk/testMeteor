Messages = new Meteor.Collection('messages');

if (Meteor.isClient) {
  // counter starts at 0
  Session.setDefault('counter', 0);

  Template.messages.messages = function(){
    var location = Meteor.user().profile.location;
    return Messages.find({location:location},{sort:{time:-1}});  
  }; 
  Template.location.location = function(){
    var location = Meteor.user().profile.location;
    return location;
  };

  Template.entry.events({
     'click #sendBtn': function (text, event) {
      var element = document.getElementById('messageBox'),
          message = element.value,
          user = Meteor.user().profile.name,
          location = Meteor.user().profile.location;
       Messages.insert({'name':user, 'message':message, 'location':location});
       element.value='';
     } 
  });

  Template._loginButtonsLoggedInDropdown.events({
    'click #login-buttons-edit-profile': function(event) {
        Router.go('profileEdit');
    }
});
  Template.profileEdit.events({
    'click #back_home': function(event) {
        Router.go('/');
    },
    'click #profileEdit-edit': function(event) {
        var options = document.getElementById("select-dropdown").options,
            selectedIndex = document.getElementById("select-dropdown").selectedIndex,
            value = options[selectedIndex].value,
            user_form = document.getElementById("usr"),
            mail_form = document.getElementById("mail"),
            newName = user_form.value,
            newMail = mail_form.value;
        Meteor.users.update( { _id: Meteor.userId() }, 
                             { $set: { 'profile.location': value, 
                                       'profile.name': newName, 
                                       'emails.0.address':newMail}} );
        Router.go('/');
    }
});
  Template.profileEdit.onRendered ( function() {
        var name = Meteor.user().profile.name,
            user_form = document.getElementById("usr");
            mail = Meteor.user().emails[0].address,
            mail_form = document.getElementById("mail"),
            user_form.value = name,
            mail_form.value = mail; 
  });
}

Router.route('profileEdit')

Router.route('/', function () {
  // render the Home template with a custom data context
  this.render('Home', {data: {title: 'My Title'}});
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.users.allow({
  update: function (userId, user, fields, modifier) {
    // can only change your own documents
    if(user._id === userId)
    {
      Meteor.users.update({_id: userId}, modifier);
      return true;
    }
    else return false;
  }
});
}
