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

		// save move
		if(is_player1){

			// save the data for the current move
			var game = Games.findOne({
				player1: user_id,
				done: {
					$exists: false
				}
			});
			if(game){
				Games.update({
					_id: game._id
				}, {
					$push: {
						moves_player1: weapon
					}
				});

				// increase step counter until all the players have made a move.
				if(game.step_counter < 1){
					Games.update({
						_id: game._id
					}, {
						$inc: {
							step_counter: 1
						}
					});

				} else { // all players moved, go on to the next repetition.
					if(game.repetition < 10){
						Games.update({
							_id: game._id
						}, {
							$set: {
								step_counter: 0,
								repetition: game.repetition + 1
							}
						});

						// increase repetition for both users.
						// player1
						Users.update({
							_id: game.player1
						}, {
							$inc: {
								repetition: 1
							}
						});

						// player2
						Users.update({
							_id: game.player2
						}, {
							$inc: {
								repetition: 1
							}
						});
					} else {
						// remove the play_against properties
						Users.update({
							_id: game.player1
						}, {
							$set: {
								play_against: null
							}
						});

						Users.update({
							_id: game.player2
						}, {
							$set: {
								play_against: null
							}
						});

						// mark the game as done.
						Games.update({
							_id: game._id,
							done: {
								$exists: false
							}
						}, {
							$set: {
								done: true
							}
						});
					}
				}
			} else {
				console.log('game not yet found');
			}
			


		} else { // player2

			// save the data for the current move
			var game = Games.findOne({
				player2: user_id,
				done: {
					$exists: false
				}
			});

			if(game){
				Games.update({
					_id: game._id
				}, {
					$push: {
						moves_player2: weapon
					}
				});

				// increase step counter until all the players have made a move.
				if(game.step_counter < 1){
					Games.update({
						_id: game._id
					}, {
						$inc: {
							step_counter: 1
						}
					});

				} else { // all players moved, go on to the next repetition.
					if(game.repetition < 10){
						Games.update({
							_id: game._id
						}, {
							$set: {
								step_counter: 0,
								repetition: game.repetition + 1
							}
						});

						// increase repetition for both users.
						// player1
						Users.update({
							_id: game.player1
						}, {
							$inc: {
								repetition: 1
							}
						});

						// player2
						Users.update({
							_id: game.player2
						}, {
							$inc: {
								repetition: 1
							}
						});
					} else {
						// remove the play_against properties
						Users.update({
							_id: game.player1
						}, {
							$set: {
								play_against: null
							}
						});

						Users.update({
							_id: game.player2
						}, {
							$set: {
								play_against: null
							}
						});

						// mark the game as done.
						Games.update({
							_id: game._id,
							done: {
								$exists: false
							}
						}, {
							$set: {
								done: true
							}
						});
					}
				}
			} else {
				console.log('game not yet found');
			}
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