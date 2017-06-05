// Requirements
require('../server');               // Server
require('../static/player');        // Player
require('../static/timer');         // Timer
require('../static/trans_socket');  // SocketManager

// List of all Player
PLAYER_LIST= {};
// How fast should the main-loop be?
UPDATE_SPEED = 20;


//------------------------------------------------------------------------
// GAME
// Game-Object
Game = {
    timer_c : new NewTimer(),       // Timer
}

// Add new Player
Game.addPlayer = function(id) {
    var Player = new NewPlayer(id);
    PLAYER_LIST[id] = Player;                   // --> Add Player
    // Send new Player to Clients
    for(var i in SOCKET_LIST)
        // Send to Client
        Send_Socket(SOCKET_LIST[i], 'addPlayer', PLAYER_LIST);
} // addPlayer
// Remove Player
Game.removePlayer = function(id) {
    delete PLAYER_LIST[id];                     // --> Delete Player
    // Remove Player from all Clients
    for(var i in SOCKET_LIST)
        // Send to Client
        Send_Socket(SOCKET_LIST[i], 'removePlayer', id);
} // removePlayer

// Update Server
Game.update = function() {
    // Update Player
    for(var i in PLAYER_LIST)
        PLAYER_LIST[i].update();
} // update

// Send new data to all clients
Game.send = function() {
    for(var i in SOCKET_LIST) {
        try {
            // Send to Client
            Send_Socket(SOCKET_LIST[i], 'updateGame', { Player_list: Game.getAllPlayerData(), time: PLAYER_LIST[i].lastUpdateTime, sendtime: Date.now()});
        } catch(e) {
            // Exception
        }
    }
} // send

// Get Data of all Player
Game.getAllPlayerData = function() {
    var pack = [];
    for(var i in PLAYER_LIST)
        // Add to Package-List
        pack.push({id: PLAYER_LIST[i].id, x: PLAYER_LIST[i].x, y: PLAYER_LIST[i].y});
    return (pack);
} // getAllPlayerData
//------------------------------------------------------------------------


//============================================================================================
// MAIN-LOOP
setInterval(function() {
    // Update Timer
    Game.timer_c.update();
    // Update Game
    Game.update();
    // Send to Clients
    Game.send();
}, UPDATE_SPEED);
//============================================================================================
