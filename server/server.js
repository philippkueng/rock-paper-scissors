var require = __meteor_bootstrap__.require;

// Users -- {name: String
//			 games_played: [String, ...]}
Users = new Meteor.Collection('users');

// Publish complete sets of users to all clients.
Meteor.publish('users', function(){
	return Users.find();
});

// Games -- { user1_id: String,
//			  user2_id: String,
//			  move_id: String
//          }
Games = new Meteor.Collection('games');

// Publish complete sets of games to all clients.
Meteor.publish('games', function(){
	return Games.find();
});


Meteor.methods({
	assignUserToAGame: function(user_id){
		Games.insert({name:user_id});
		return 'game_name';
	}
});

Meteor.startup(function(){

});