# Rock - Paper - Scissors

    $ meteor remove autopublish

## Datastructure

Users

    {
        // name: String,
        wins: Number,
        losses: Number,
        last_activity: Number // timestamp
    }
    
Games
    
    [{
        user1_id: String,
        user2_id: String,
        move_id: String
    }, {
        ...
    }]
    
Moves

    [{
        user1_choice: String,
        user2_choice: String,
        user1_timetomove: Number,
        user2_timetomove: Number
        winning_user: String
    }, {
        ...
    }]