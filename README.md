# Rock - Paper - Scissors

    $ meteor remove autopublish
    $ meteor add amplify

## Datastructure

**Users** - MongoDB collection

*visible (readable, editable) to both all clients and the server*

    {
        _id: String, // added automatically
        name: String,
        play_against: String, // _id of that other user
        repetition: Number, // reflects repetition of the game collection below
        last_activity: Number // timestamp
    }

**Games** - MongoDB collection

*only visible (readable, editable) to the server*
    
    {
        _id: String, // added automatically
        player1: String,
        player2: String,
        repetition: Number,
        step_counter: Number,
        made_last_step: String,
        moves_player1: [String],
        moves_player2: [String]
    }


## How the app works

The app consists of two collections, one called Users and one called Games. Users is publicly editable and fully pushed to all clients. Games on the other hand is only visible from within the server to prevent cheating somewhat.

When a user first opens up his browser and new unique id get's generated for that user and then stored in the HTML5 LocalStorage to hold on to that id even when the page is manually refreshed. Next this new user get's a list of all users currently within the system and is able to click on the button besides one that isn't currently engaging in another game. As soon as the "play against" button is pressed a private Game entry is created via the server and 10 iterations are played. After those 10 iterations, the game ends and both users are freed again and reappear in the users list as available.

## Users

-> _id - wins/numbers_played - last_played - (playing, available)