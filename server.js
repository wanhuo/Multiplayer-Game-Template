// ================================================================================
// Requirements
var express = require('express');           // Domain-Manager
var app = express();                        // Sub-/ Domains
var serv = require('http').Server(app);     // Server starten
var UUID = require('node-uuid');            // UserID erstellen
var io = require('socket.io')(serv,{});     // Sockets

// Requirements
// Only Server
require('./js_server/game');
// Server - Client
require('./static/timer');
require('./static/trans_socket');
// ================================================================================


// ================================================================================
// Interface
// Start Server
var PORT = 80;
serv.listen(PORT);                        // --> Port
// Normal
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
// Return all files
app.use('/',express.static(__dirname + '/'));
console.log("Server started.");
// ================================================================================


// ================================================================================
// SOCKETMANAGER
SOCKET_LIST = {};           // Liste aller Sockets


io.sockets.on('connection', function(socket) {
    //---------------------------------------------------------------------------
    // LOGIN
    // Add Socket to SOCKET_LIST
    socket.id = UUID();                     // Create an ID for the socket
    SOCKET_LIST[socket.id] = socket;        // --> Add
    Game.addPlayer(socket.id);
    Send_Socket(socket, 'setup', {id: socket.id, startTime: Game.timer_c.getStartTime()});// Client Setup
    //---------------------------------------------------------------------------
    
    
    //---------------------------------------------------------------------------
    // LOGOUT
    // Disconnect
    socket.on('disconnect', function(){
        delete SOCKET_LIST[socket.id];          // Delete Socket
        Game.removePlayer(socket.id);           // Delete Player
    });
    //---------------------------------------------------------------------------

    //---------------------------------------------------------------------------
    // ProcessEvents/Inputs
    socket.on('processEvent', function(data) {
        PLAYER_LIST[socket.id].processEvent(data.input);
        PLAYER_LIST[socket.id].lastUpdateTime = data.time;
    });
    //---------------------------------------------------------------------------
});
// ================================================================================