NewTimer = function() {
    // Private Data
    var self = {
        actualTime  : Date.now(),        // Actual Time
        lastTime    : Date.now(),        // Last Time
        elapsedTime : Date.now(),        // Elapsed Time
    } // self
    // Update Timer
    self.update = function() {
        // Update actual Time
        self.actualTime = Date.now();
        // Update elapsed Time
        self.elapsedTime = self.actualTime - self.lastTime;
        // Update last Time
        self.lastTime = Date.now();
    } // update
    // Get Elapsed Time --> elapsedTime/1000
    self.getElapsed = function() {
        return(self.elapsedTime/1000);
    } // getElapsed
    return (self);
}
