//------------------------------------------------------------------------
// DATA
// Client ID
var id = null;

// All Player
var PLAYER_LIST = {};
// All Inputs made
var INPUT_LIST = [];
// All Steps of the Player
var STEP_LIST = {};
// ALl new caluclated data from the server
var UPDATE_LIST = [];
//------------------------------------------------------------------------


//------------------------------------------------------------------------
// SOCKET-MANAGER
// Set the Client up
socket.on('setup', function(data) {
    id = data.id;                               // Set ID
    Game.timer_c.startTime = data.startTime;    // Set StartTime
});
// Add new Player
socket.on('addPlayer', function(data) {
    for(var i in data) {
        var player = new NewPlayer(data[i].id);
        player.x = data[i].x;
        player.y = data[i].y;
        PLAYER_LIST[data[i].id] = player;
    }
});
// Remove Player
socket.on('removePlayer', function(data) {
    delete PLAYER_LIST[data];
});

var date = Date.now();
// Spiel aktualsieren
socket.on('updateGame', function(data) {
    // Set new Data
    for(var i in data.Player_list) {
        date = Date.now() - data.sendtime;
        if(data.Player_list[i].id == id && data.time != 0 && STEP_LIST[data.time] != undefined) {
            // Add Update to UPDATE_LIST
            UPDATE_LIST.push({list: data.Player_list[i], time: data.time});
        } else {
            // Set Position of other Playerr
            PLAYER_LIST[data.Player_list[i].id].x = data.Player_list[i].x;
            PLAYER_LIST[data.Player_list[i].id].y = data.Player_list[i].y;
        }
    }
});
//------------------------------------------------------------------------


//------------------------------------------------------------------------
// GAME
// How fast should the main-loop be?
UPDATE_SPEED = (1000/50);

// Game-Class
var Game = {
    timer_c : new NewTimer(),            // Timer
}

// Add new Player in PLAYER_LIST
Game.addPlayer = function(player) {
    PLAYER_LIST[player.id] = player;
} // addPlayer
// Remove Player form PLAYER_LIST
Game.removePlayer = function(id) {
    delete PLAYER_LIST[id];
} // removePlayer

// Update Game
Game.update = function() {
    // Update all Player
    Game.updatePlayer();
    // Process Inputs
    Game.processInput();
    // Synchronize Player
    Game.synchronizePlayer();
    // Draw Game
    Game.render();
} // update

// Update all Player
Game.updatePlayer = function() {
    for(var i in PLAYER_LIST) 
        PLAYER_LIST[i].update();
} // updatePlayer

// Processing all Inputs
Game.processInput = function() {
    // There're inputs
    if(INPUT_LIST.length > 0) {
        // Update on the Server
        Send_Socket(socket, 'processEvent', {input: INPUT_LIST[0], time: INPUT_LIST[0].time});
        // Update on the Client
        PLAYER_LIST[id].processEvent(INPUT_LIST[0]);
        // Push in STEP_LIST
        STEP_LIST[INPUT_LIST[0].time] = ({x: PLAYER_LIST[id].x, y: PLAYER_LIST[id].y});
        // Delete Input
        INPUT_LIST.splice(0,1);
    }
} // processInput

// Synchronize the Player
Game.synchronizePlayer = function() {
    // There're updates
    if(UPDATE_LIST.length > 0 && STEP_LIST.length > 0) {
        // Error-Prevention
        if(STEP_LIST[UPDATE_LIST[0]] == undefined) {
            // The old Player-Position equals the old Server-Position
            if(STEP_LIST[UPDATE_LIST[0].time].x == UPDATE_LIST[0].list.x && STEP_LIST[UPDATE_LIST[0].time].y == UPDATE_LIST[0].list.y) {
                // Do Nothing!
            } else {
                // Set new Position
                PLAYER_LIST[id].x = UPDATE_LIST[0].list.x;
                PLAYER_LIST[id].y = UPDATE_LIST[0].list.y;    
            }
            // Delete data
            delete STEP_LIST[UPDATE_LIST[0].time];
            UPDATE_LIST.splice(0,1);
        }
    }
} // synchronizePlayer

// Render Game
Game.render = function() {
    // Drawing the Background
    Canvas_Context.context.fillStyle="#FF0000";
    Canvas_Context.context.fillRect(0, 0, Canvas_Context.width, Canvas_Context.height);
    // Drawing all Player
    Canvas_Context.context.fillStyle="#0000000";
    for(var i in PLAYER_LIST) {
        Canvas_Context.context.beginPath(); 
        Canvas_Context.context.ellipse(PLAYER_LIST[i].x, PLAYER_LIST[i].y, 20, 20, 45 * Math.PI/180, 0, 2 * Math.PI);
        Canvas_Context.context.stroke();
    }
    Canvas_Context.context.fillStyle = '#000000';
    // Showing all the important Infos
    Canvas_Context.context.font="20px Georgia";
    Canvas_Context.context.fillText("Transmission-Time: " + (date), 20, 20);
    Canvas_Context.context.fillText("Input-List: " + (INPUT_LIST.length), 20, 40);
} // render
//------------------------------------------------------------------------


//------------------------------------------------------------------------
// INPUTS
// Keyboard
document.onkeydown = function(event) {
    // Create new input
    INPUT_LIST.push({type: 'mouse', value: event.keyCode, time: Date.now() - Game.timer_c.startTime});
} // onkeydown
//------------------------------------------------------------------------


//============================================================================================
// MAIN-LOOP
setInterval(function() {
    // Update Timer
    Game.timer_c.update();
    // Update Game
    Game.update();
    // Draw Game
    Game.render();
}, UPDATE_SPEED);
//============================================================================================