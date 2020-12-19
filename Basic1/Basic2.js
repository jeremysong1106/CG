function drawArcCircle(canvas) {
    var context = canvas.getContext("2d");
    context.beginPath();
    context.arc(60,60,50,0,Math.PI*2);
    context.fillStyle='#00ff00';
    context.fill();
    context.closePath();

    context.beginPath();
    context.arc(140,140,50,0,Math.PI*2);
    context.fillStyle='#00ff00';
    context.fill();
    context.strokeStyle='#007f00';
    context.lineWidth=10;
    context.stroke();
    context.closePath();
    //TODO 1.2)       Use the arc() function to
    //                rasterize the two circles
    //                from Task 1.1.



}
