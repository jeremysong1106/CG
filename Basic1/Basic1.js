function drawPixelwiseCircle(canvas) {
    var context = canvas.getContext("2d");
    var img = context.createImageData(200, 200);

    //TODO 1.1a)      Copy the code from Example.js
    //                and modify it to create a 
    //                circle.

   for (var i=0; i < 4 * 200 * 200; i += 4) {
        var j =i/4;
        var x=j/200;
        var y=j%200;

   if ( (x-100)*(x-100)+(y-100)*(y-100)<2500) {
        img.data[i] = 0;
        img.data[i + 1] = 255;
        img.data[i + 2] = 0;
        img.data[i + 3] = 255;
    }
}
   context.putImageData(img, 0, 0);

    //context.putImageData(c, 0, 0);
}





function drawContourCircle(canvas) {
    var context = canvas.getContext("2d");
    var img = context.createImageData(200, 200);
 
 for (var i=0; i < 4 * 200 * 200; i += 4) {
        var j =i/4;
        var x=j/200;
        var y=j%200;

   if ( (x-100)*(x-100)+(y-100)*(y-100)<2500) {
        img.data[i] = 0;
        img.data[i + 1] = 255;
        img.data[i + 2] = 0;
        img.data[i + 3] = 255;
    }
    if(45*45<((x-100)*(x-100)+(y-100)*(y-100))&(x-100)*(x-100)+(y-100)*(y-100)<55*55){
        img.data[i] = 0;
        img.data[i + 1] = 127;
        img.data[i + 2] = 0;
        img.data[i + 3] = 255;


}
}
   context.putImageData(img, 0, 0);
}
function drawSmoothCircle(canvas) {
    var context = canvas.getContext("2d");
    var img = context.createImageData(200, 200);
    context.scale(0.5,0.5);
    //TODO 1.1c)      Copy your code from above
    //                and extend it to get rid
    //                of the aliasing effects at
    //                the border.
for (var i=0; i < 4 * 200 * 200; i += 4) {
        var j =i/4;
        var x=j/200;
        var y=j%200;
        var l=Math.sqrt((x-100)*(x-100)+(y-100)*(y-100));
   if ( (x-100)*(x-100)+(y-100)*(y-100)<=44*44) {
        img.data[i] = 0;
        img.data[i + 1] = 255;
        img.data[i + 2] = 0;
        img.data[i + 3] = 255;
    }


    if(44*44<((x-100)*(x-100)+(y-100)*(y-100))&(x-100)*(x-100)+(y-100)*(y-100)<=45*45){
        img.data[i] = 0;
        img.data[i + 1] = 255-128*(l-44);
        img.data[i + 2] = 0;
        img.data[i + 3] = 255;


}
    if(45*45<((x-100)*(x-100)+(y-100)*(y-100))&(x-100)*(x-100)+(y-100)*(y-100)<=54*54){
        img.data[i] = 0;
        img.data[i + 1] = 127
        img.data[i + 2] = 0;
        img.data[i + 3] = 255;


}
   if(54*54<((x-100)*(x-100)+(y-100)*(y-100))&(x-100)*(x-100)+(y-100)*(y-100)<=55*55){
        l=Math.sqrt((x-100)*(x-100)+(y-100)*(y-100));
        img.data[i] = 255*(l-54);
        img.data[i + 1] = 127+128*(l-54);
        img.data[i + 2] = 255*(l-54);
        img.data[i + 3] = 255;


}
}

    context.putImageData(img, 0, 0);

}


function drawIntoCanvas(canvas) {
    console.log("This is an exemplary log!");
    var context = canvas.getContext("2d");
    var img = context.createImageData(200, 200);

    for (var i = 0; i < 4 * 200 * 200; i += 4) {
        img.data[i] = 100;
        img.data[i + 1] = 200;
        img.data[i + 2] = 255;
        img.data[i + 3] = 255;
    }

    context.putImageData(img, 0, 0);
}
