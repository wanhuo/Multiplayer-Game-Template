// Send Data
Send_Socket = function(socket, name, data) {
    try {
        //for(var i = 0;i < 1000000;i++) ;
        socket.emit(name, data);
    } catch(e) {
        console.log(e);
    }
} // Send_Socket