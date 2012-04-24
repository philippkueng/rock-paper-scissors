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
	insert_move: function(user_id, is_player1, weapon){

		var game = null;

		// fetch game
		if(is_player1){
			game = Games.findOne({
				player1: user_id,
				done: {$exists: false}
			});
		} else {
			game = Games.findOne({
				player2: user_id,
				done: {$exists: false}
			});
		}

		if(game){

			// check if it's a duplicate entry -> eg. doubleclick instead of single one.
			if(game.made_last_step === user_id){
				console.log('duplicate!');
			}

			if(is_player1){
				// save current move for player1
				Games.update({
					_id: game._id
				}, {
					$push: {
						moves_player1: weapon
					}
				});

			} else {
				// save current move for player2
				Games.update({
					_id: game._id
				}, {
					$push: {
						moves_player2: weapon
					}
				});
			}

			// increase to 1 until both players have played.
			if(game.step_counter < 1){
				Games.update({
					_id: game._id
				}, {
					$inc: {
						step_counter: 1
					}
				});

				// set the made_last_step to check for duplicate hits
				Games.update({
					_id: game._id
				}, {
					$set: {
						made_last_step: user_id
					}
				});

			} else { // both players have voted

				if(game.repetition < 10){

					// increase repetition
					Games.update({
						_id: game._id
					}, {
						$set: {
							step_counter: 0,
							made_last_step: null,
							repetition: game.repetition + 1
						}
					});

					// increase repetition for player1
					Users.update({
						_id: game.player1
					}, {
						$inc: {
							repetition: 1
						}
					});

					// increase repetition for player2
					Users.update({
						_id: game.player2
					}, {
						$inc: {
							repetition: 1
						}
					});


				} else { // game is finished and we need to wrap up.

					// mark the game as done
					Games.update({
						_id: game._id
					}, {
						$set: {
							done: true
						}
					});

					// remove the play_against property for player1
					Users.update({
						_id: game.player1
					}, {
						$set: {
							play_against: null
						}
					});

					// remove the play_against property for player2
					Users.update({
						_id: game.player2
					}, {
						$set: {
							play_against: null
						}
					});
				}
			}

		} else { // shouldn't happen! really!
			console.log('game not yet found');
		}

		return 'foobar';
	},
	start_game: function(user_id, other_user_id){
		var p1 = "";
		var p2 = "";

		if(user_id < other_user_id){
			p1 = user_id;
			p2 = other_user_id;
		} else {
			p1 = other_user_id;
			p2 = user_id;
		}

		// TODO: implement locking.

		Games.insert({
			player1: p1,
			player2: p2,
			repetition: 1,
			step_counter: 0,
			made_last_step: null,
			moves_player1: [],
			moves_player2: []
		});

		// Update users
		Users.update({
			_id: p1
		}, {
			$set: {
				play_against: p2,
				repetition: 1
			}
		});

		Users.update({
			_id: p2
		}, {
			$set: {
				play_against: p1,
				repetition: 1
			}
		});

		return 'Game started';
	}
});

Meteor.startup(function(){

});