Template.hello.greeting = function(){
  return "Rock-paper-scissors";
};

Template.hello.events = {
  'click input': function(){
    amplify.store('user_id', null);
  }
}

// Define a Minimongo collection to match server/server.js
Users = new Meteor.Collection('users');
Games = new Meteor.Collection('games');

// Subscribe to 'users' collection on startup.
Meteor.subscribe('users', function(){

});

// Subscribe to 'games' collection on startup.
Meteor.subscribe('games', function(){

});


////////// Users ///////////

if(!amplify.store('user_id')){
  var user = Users.insert({
    name: Meteor.uuid(),
    last_activity: (new Date()).getTime()
  });
  amplify.store('user_id', user);
  Session.set('user_id', amplify.store('user_id'));

  /* Send a request to the server to be part of a game ----------- */

  Meteor.setTimeout(function(){
    if(Users.find().count() % 2 === 0){
      Session.set('message', 'Asking server to join a game...');
      Meteor.call('assignUserToAGame', Session.get('user_id'), function(err, result){
        if(result){
          Session.set('message', "Just got " + result + " back from the server");
        } else {
          Session.set('message', "Someone else was faster, better luck next time");
        }
      });
    } else {
      Session.set('message', 'Still waiting for someone else to join');
    }
  }, 2000);

} else {
  Session.set('user_id', amplify.store('user_id'));
  Session.set('message', null);
}

Template.status.users_count = function(){
  return Users.find().count();
};

Template.status.user_id = function(){
  return Session.get('user_id');
};

Template.status.connected = function(){
  return Meteor.status().connected;
};

Template.status.message = function(){
  return Session.get('message');
}

////////// Games //////////

Template.games.games = function(){
  return Games.find();
};

// Template.games.events = {};




// get number of users already playing
// if even -> add the current one and show a wait screen
// if odd -> find that last user and initiate a game session