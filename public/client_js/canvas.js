var BLOCK_S = 32;
var CanvasInfo =  function(canvasId) {
    this.width = 0;                 // Width of the Canvas
    this.height = 0;                // Height of the Canvas
    this.canvas = null;             // Canvas
    this.context = null;            // Context
    
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    /* Set ne size of Canvas */
    this.get_new_size = function() {
        this.width = (Math.floor((window.innerWidth * 0.84)/BLOCK_S) * BLOCK_S);
        this.height = (Math.floor((window.innerHeight * 0.82)/BLOCK_S) * BLOCK_S);
        $(this.canvas).attr( { width: this.width, height: this.height } );
        $(this.canvas).attr( { style: 'width:'  + this.width + 'px;' + 'height:' + this.height + 'px' } );
    }
};
