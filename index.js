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

    // This retrieves the noise image
    var noise_image = document.getElementById('noise-image');

    // Here we create a pattern from the background image. This pattern will be later
    // filled as a style in the canvas.
    var pattern = context.createPattern(background_image, "repeat");

    var noise_pattern = context.createPattern(noise_image, "repeat");

    // These variables stores the X and Y position of the mouse
    var mouseX = 0;
    var mouseY = 0;

    // An array to store the positions of all the trailing circles with the latest one
    var positions = [];

    // Number of trails to show
    var motionTrailLength = 5;

    // Holds the source radius (fixed)
    var sourceRadius = 40;

    // Holds the fixed noise radius
    var noiseFixedRadius = 50;

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

    //var random_start_angle = (Math.random()*2) * Math.PI;
    //var random_end_angle = (Math.random()*2) * Math.PI;

    /**
     * This method is used to create an arc for each of the positions.
     * @param x
     * @param y
     * @param radius: Holds the radius of the circle.
     * @param transparency: Holds the transparency value (b/w 0 -1)
     */
    function drawCircle(x, y, radius, transparency) {

        context.beginPath();
        context.arc(x, y, radius, 0, 2*Math.PI, true);

        if (radius == sourceRadius) {
            context.fillStyle = pattern;
        }
        else {
            context.fillStyle = noise_pattern;
        }

        context.globalAlpha = transparency;
        context.fill();
    }

    function drawEllipse(centerX, centerY, width, transparency) {

        var height = 1.2 * width;
        context.beginPath();
        context.moveTo(centerX, centerY - height/2);
        context.bezierCurveTo(
            centerX/2 + width/2, centerY/2 - height/2,
            centerX + width/2, centerY + height/2,
            centerX, centerY + height/2);

        context.bezierCurveTo(
            centerX/2 - width/2, centerY/2 + height/2,
            centerX - width/2, centerY - height/2,
            centerX, centerY - height/2);

        if (width == sourceRadius) {
            context.fillStyle = pattern;
            context.lineWidth = 5;
            context.stroke();
        }
        else {
            context.fillStyle = noise_pattern;
        }

        context.globalAlpha = transparency;
        context.fill();
        context.closePath();
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

        // get rid of first item (behaving like a queue)
        if (positions.length > motionTrailLength) {
            positions.shift();
        }
    }

    /**
     * This function is used to update the canvas.
     */
    function updateCanvas() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        var radius = null;
        var transparency = 1;

        for (var i = 0; i < positions.length; i++) {

            // generate the radius and transparency value for the noise arcs. The first one will have a fixed radius
            // and no transparency. All other arcs will be transparent.
            if (i > 0) {
                radius = (2*i + noiseFixedRadius);
            }
            else {
                radius = noiseFixedRadius
            }

            //drawCircle(positions[i].x, positions[i].y, radius, transparency);
            drawEllipse(positions[i].x, positions[i].y, radius, transparency);
        }

        // draw the source arc
        //drawCircle(mouseX, mouseY, sourceRadius, transparency);
        drawEllipse(mouseX, mouseY, sourceRadius, transparency);

        // store it as the last position
        storeLastPosition(mouseX, mouseY);

        // This is to repaint the canvas at the browser refresh rate (60 times / sec)
        requestAnimationFrame(updateCanvas);
    }

    updateCanvas();

    // add mouse event listener to the canvas, and set its position
    canvas.addEventListener("mousemove", setMousePosition, false);

})();