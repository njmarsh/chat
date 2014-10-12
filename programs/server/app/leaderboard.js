(function(){// Set up a collection to contain player information. On the server,
// it is backed by a MongoDB collection named "players".

Messages = new Mongo.Collection("messages");

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.round(Math.random() * 10)];
    }
    return color;
}

if (Meteor.isClient) {
  Template.messageboard.messages = function () {
    return Messages.find({}, {sort: {time: 1}});
  };

  Template.messageboard.selected_name = function () {
    return Session.get("selected_name"); 
  };

  Template.messageboard.events({
    'click button.send': function () {
      var message = document.getElementById('message');
      if (message.value == "") {
        alert('Enter a message')
      } else {
        var time = new Date;
        var epoch = time.getTime();
        var formattedDate = time.toLocaleString();

        Messages.insert({color: Session.get('user_color'), name: Session.get("selected_name"), text: message.value, time:epoch, formattedDate: formattedDate});
      }

      message.value = "";
    },
    'click button.select': function(e) {
      e.preventDefault();
      e.stopPropagation();
      var name = document.getElementById("name");

      if (name.value == "") {
        alert('Enter a name, please');
      } else {
        Session.set('selected_name', name.value);
        Session.set('user_color', getRandomColor());
      }
    }
  });

  Meteor.autosubscribe(function() {
   Messages.find().observe({
    added: function(item) {
        var objDiv = document.getElementById("messageboard");
        objDiv.scrollTop = objDiv.scrollHeight + 50;
    }
   });
  });
}

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Messages.find().count() === 0) {
      var messages = [{color: '#000000', name: 'Room', text: 'Welcome to the room', time: (new Date).toLocaleString()}];
      for (var i = 0; i < messages.length; i++)
        Messages.insert(messages[i]);
    }
  });


}

})();
