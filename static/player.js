// Player-Class
NewPlayer = function(id) {
    // Private Data
    var self = {
        id : id,                      // ID
        x : Math.floor(400*Math.random()),    // X-Position
        y : Math.floor(300*Math.random()),    // Y-Position

        timer_c: new NewTimer(),      // Timer
        speed  : 0,                   // Speed
        xSpeed : 0,                   // X-Speed
        ySpeed : 0,                   // Y-Speed

        // Only Server
        lastUpdateTime: 0,            // When was the last update of the player? 
        InputEvent: null,             // Events/Inputs
    } // self

    // Update Player
    self.update = function() {
        // Update Timer
        self.timer_c.update();
        // CalculateSpeed
        self.calculateSpeed();
    } // update

     // Calculate Speed
    self.calculateSpeed = function() {
        //self.speed = Math.floor(200 * self.timer_c.getElapsed());
        self.speed = 2;
    } // calculateSpeed

    // Process Events/Inputs
    self.processEvent = function(event) {
        // A --> Walking left
        if(event.value == 65)
            self.xSpeed = -self.speed;
        // D --> Walking Right
        if(event.value == 68)
            self.xSpeed = +self.speed;
        // W --> Walking Up
        if(event.value == 87)
            self.ySpeed = -self.speed;
        // S --> Walking Down
        if(event.value == 83)
            self.ySpeed = +self.speed;

        // Moves
        self.x += self.xSpeed;
        self.y += self.ySpeed;

        self.xSpeed = 0;
        self.ySpeed = 0;
    } // processEvent

    return (self);
}
