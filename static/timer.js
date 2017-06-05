// Timer-Class
NewTimer = function() {
    // Private Data
    var self = {
        startTime   : Date.now(),                         // Start Time
        actualTime  : Date.now() - this.startTime,        // Actual Time
        lastTime    : Date.now() - this.startTime,        // Last Time
        elapsedTime : Date.now() - this.startTime,        // Elapsed Time
    } // self
    // Update Timer
    self.update = function() {
        // Update actual Time
        self.actualTime = Date.now() - self.startTime;
        // Update elapsed Time
        self.elapsedTime = self.actualTime - self.lastTime;
        // Update last Time
        self.lastTime = Date.now() - self.startTime;
    } // update
    // Get Start Time
    self.getStartTime = function() {
        return (self.startTime);
    } // getStartTime
    // Get Elapsed Time --> elapsedTime/1000
    self.getElapsed = function() {
        return(self.elapsedTime/1000);
    } // getElapsed
    return (self);
}
