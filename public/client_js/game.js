//------------------------------------------------------------------------
// Socket-Manager
// Set the ID of the Client
socket.on('setID', function(data) {
    id = data;
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
/*
// Spiel aktualsieren
socket.on('updateGame', function(data) {
    // Daten neu setzen
    for(var i in data.Player_list) {
        date = Date.now() - data.sendtime;
        if(data.Player_list[i].id == id && data.time != 0) {
            //console.log("Step: " + STEP_LIST[data.time].x + " - " + STEP_LIST[data.time].y);
            //console.log("Server: " + data.Player_list[i].x + " - " + data.Player_list[i].y);
            if(STEP_LIST[data.time].x == data.Player_list[i].x && STEP_LIST[data.time].y == data.Player_list[i].y) {
                delete STEP_LIST[data.time];
            } else {
                // Position neu setzen
                PLAYER_LIST[data.Player_list[i].id].x = data.Player_list[i].x;
                PLAYER_LIST[data.Player_list[i].id].y = data.Player_list[i].y;    
            }
        } else {
            // Position neu setzen
            PLAYER_LIST[data.Player_list[i].id].x = data.Player_list[i].x;
            PLAYER_LIST[data.Player_list[i].id].y = data.Player_list[i].y;
        }
    }
});
*/
//------------------------------------------------------------------------

// Client ID
var id = null;

// All Player
var PLAYER_LIST = {};
// All Inputs
var INPUT_LIST = [];
// All Steps
var STEP_LIST = {};

// How fast should the main-loop be?
UPDATE_SPEED = (1000/50);

// Game-Class
var Game = {
    time_c : new NewTimer(),            // Timer
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
    // Draw Game
    Game.render();
} // update

// Spiel zeichnen
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
    Canvas_Context.context.fillText("Player-Speed: " + PLAYER_LIST[id].speed, 20, 80);
} // render

// Update all Player
Game.updatePlayer = function() {
    for(var i in PLAYER_LIST) 
        PLAYER_LIST[i].update();
} // updatePlayer

// Processing all Inputs
Game.processInput = function() {
    // There're inputs
    if(INPUT_LIST.length > 0) {
        // Update on the Client
        PLAYER_LIST[id].processEvent(INPUT_LIST[0]);
        // Push in STEP_LIST
        STEP_LIST[INPUT_LIST[0].time] = ({x: PLAYER_LIST[id].x, y: PLAYER_LIST[id].y});
        // Delete Input
        INPUT_LIST.splice(0,1);
    }
} // processInput

//============================================================================================
// MAIN-LOOP
setInterval(function() {
    // Update Timer
    Game.time_c.update();
    // Update Game
    Game.update();
    // Draw Game
    Game.render();
}, UPDATE_SPEED);
//============================================================================================


// Keyboard
document.onkeydown = function(event) {
    // Create new input
    INPUT_LIST.push({type: 'mouse', value: event.keyCode, time: Date.now()}); 
} // onkeydown