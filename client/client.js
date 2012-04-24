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

// Subscribe to 'users' collection on startup.
Meteor.subscribe('users', function(){

});

// Subscribe to 'games' collection on startup.
Games = new Meteor.Collection('games');
Meteor.subscribe('games', function(){

});


////////// Users ///////////

if(!amplify.store('user_id')){
  var user = Users.insert({
    name: Meteor.uuid(),
    last_activity: (new Date()).getTime(),
    play_against: null,
    repetition: null
  });
  amplify.store('user_id', user);
  Session.set('user_id', amplify.store('user_id'));

} else {
  Session.set('user_id', amplify.store('user_id'));
  // var user = Users.findOne({_id: Session.get('user_id')});

  // if(user.play_against){
  //   Session.set('play_against', user.play_against);
  //   console.log('user_playagainst: ' + user.play_against);
  // }
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


////////// Users //////////

Template.users.users = function(){
  var user = Users.findOne({_id: Session.get('user_id')});
  if(user && user.play_against){
    return null;
  } else {
    return Users.find({
      _id: {
        $ne: Session.get('user_id')
      }
    });
  }
};

Template.user_item.events = {
  'click input': function(){

    var my_id = Session.get('user_id');
    var opponent_id = this._id;

    // let the server handle the collision detection etc.
    var response = Meteor.call('start_game', my_id, opponent_id);
    console.log('--> game started');
  }
};


// as long as a game is played this templates are visible.
Template.rps_game.opponent = function(){

  var user = Users.findOne({_id: Session.get('user_id'), play_against: {$ne: null}});
  if(user){
    return user.play_against;
  } else {
    return null;
  }
};

Template.rps_game.repetition = function(){
  var user = Users.findOne({_id: Session.get('user_id'), play_against: {$ne: null}});

  if(user.repetition){
    return user.repetition;
  } else {
    Users.update({
      _id: Session.get('user_id')
    }, {
      $set: {
        repetition: 1
      }
    });
    return 1;
  }
};

var increase_repetition = function(weapon){

  // find out wether this user is player1 or player2 -> the smaller one is player1
  var player1 = false;
  var user = Users.findOne({
    _id: Session.get('user_id')
  });

  if(user){

    if(Session.get('user_id') < user.play_against){
      player1 = true;
    }

    var increase = Meteor.call('insert_move', Session.get('user_id'), player1, weapon);
  } else {
    console.log('cannot find user');
  }
  
};

Template.rps_game_rock.events = {
  'click': function(){
    console.log('rock');
    increase_repetition('rock');
  }
};

Template.rps_game_paper.events = {
  'click': function(){
    console.log('paper');
    increase_repetition('paper');
  }
};

Template.rps_game_scissors.events = {
  'click': function(){
    console.log('scissors');
    increase_repetition('scissors');
  }
}

////////// Games //////////

// Template.games.games = function(){
//   return Games.find();
// };

// Template.games.events = {};




// get number of users already playing
// if even -> add the current one and show a wait screen
// if odd -> find that last user and initiate a game session