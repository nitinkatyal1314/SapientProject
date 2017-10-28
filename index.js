/**

 Created by 'Nitin' for free distribution.

 This script fetches the location of the mouse in the browser, creates a canvas
 and renders the hidden background image as the mouse moves over the image in the
 foreground.
 */

(function() {

    // get the canvas element
    var canvas = document.getElementById('myCanvas');

    // get the canvas context
    var context = canvas.getContext("2d");

    // This retrieves the background image.
    var background_image = document.getElementById('background-image');

    // Here we create a pattern from the background image. This pattern will be later
    // filled as a style in the canvas.
    var pattern = context.createPattern(background_image, "repeat");

    // These variables stores the X and Y position of the mouse
    var mouseX = 0;
    var mouseY = 0;

    // An array to store the positions of all the trailing circles with the latest one
    var positions = [];

    // Number of trails to show
    var motionTrailLength = 5;

    /**
     * This method is used to get the mouse position in the canvas. These positions wil be then
     * be used as coordinates for the arcs.
     * @param event
     */
    function setMousePosition(event) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        mouseX = (event.clientX - rect.left) * scaleX;
        mouseY = (event.clientY - rect.top) * scaleY;
    }

    // generates a random number between 10 and 50
    var random_radius = Math.floor((Math.random()*30) + 10);
    var random_start_angle = (Math.random()*2) * Math.PI;
    var random_end_angle = (Math.random()*2) * Math.PI;

    /**
     * This method is used to create an arc for each of the positions.
     * @param x
     * @param y
     */
    function drawCircle(x, y) {
        context.beginPath();
        context.arc(x, y, random_radius, random_start_angle, random_end_angle, true);
        context.fillStyle = pattern;
        context.fill();
    }

    /**
     * This method is used to store the last position of the arc.
     * @param xPos
     * @param yPos
     */
    function storeLastPosition(xPos, yPos) {
        // push an item
        positions.push({
            x: xPos,
            y: yPos
        });

        //get rid of first item (behaving like a queue)
        if (positions.length > motionTrailLength) {
            positions.shift();
        }
    }

    /**
     * This function is used to update the canvas.
     */
    function updateCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < positions.length; i++) {
            drawCircle(positions[i].x, positions[i].y);
        }

        // draw the latest circle
        drawCircle(mouseX, mouseY);

        // store it as the last position
        storeLastPosition(mouseX, mouseY);

        // This is to repaint the canvas at the browser refresh rate (60 times / sec)
        requestAnimationFrame(updateCanvas);
    }

    updateCanvas();

    // add mouse event listener to the canvas, and set its position
    canvas.addEventListener("mousemove", setMousePosition, false);

})();