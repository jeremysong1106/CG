"use strict";

///////////////////////////
//// global variables  ////
///////////////////////////

// create 2d point
function Point(x, y) {
    this.x = x;
    this.y = y;
}

// create rgb color triple
function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
}
// pixel scale
var pixelScale = 10;

// line
var line = new Line(new Point(10 / pixelScale, 10 / pixelScale),
                    new Point(180 / pixelScale, 180 / pixelScale),
                    new Color(0, 0, 0));

//////////////
//// gui  ////
//////////////

// event listener for gui
function onChangePixelScale(value) {
    // rescale line
    var s = pixelScale / value;
    line.startPoint.x = line.startPoint.x * s;
    line.startPoint.y = line.startPoint.y * s;
    line.endPoint.x = line.endPoint.x * s;
    line.endPoint.y = line.endPoint.y * s;
    // set new scaling factor
    pixelScale = value;
    // rerender scene
    RenderCanvas1();
}

function onMouseDownCanvas1(e) {
    var rect = document.getElementById("canvas1").getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    console.log("onMouseDownCanvas1: " + x + " " + y);

    // set new points
    if (e.ctrlKey) {
        line.endPoint.x = x / pixelScale;
        line.endPoint.y = y / pixelScale;
    }
    else {
        line.startPoint.x = x / pixelScale;
        line.startPoint.y = y / pixelScale;
    }

    // rerender image
    RenderCanvas1();
}


//////////////////////////////
//// bresenham algorithm  ////
//////////////////////////////

function bresenham(image, line) {
var x0 = Math.floor(line.startPoint.x);
    var y0 = Math.floor(line.startPoint.y);
    var x1 = Math.floor(line.endPoint.x);
    var y1 = Math.floor(line.endPoint.y);

    // TODO 2.1     Write code to draw a line
    //              between the start point and
    //              the end point. To make things
    //              easier, there are some comments
    //              on what to do next: 

    // compute deltas and update directions

    if(x0>x1){
        var temp = x1;
        x1=x0;
        x0=temp;
        var temp1=y1;
        y1=y0;
        y0=temp1;
    }

    var dx= x1-x0;
    var dy= y1-y0;
    var m = dy/dx;
    
    var D = dx - 2*dy;
    var DE = -2*dy;
    var DNE = 2*(dx-dy);
    
    if(m>1){
        D= dy-2*dx;
        DE = -2*dx;
        DNE = 2*(dy-dx);
    }

    if(m<0 && m >= -1){
        D =dx+2*dy;// dx-2*(dy+2*y0-2*y1);
        DE = 2*dy;//-2*(dy+2*y0-2*y1);
        DNE = 2*(dx+dy);
    }

    if(m<-1){
        D =-dy -2*dx;
        DE = -2*dx;
        DNE = 2*(-dy-dx);
    }
    var x = x0;
    var y = y0;


    // set initial coordinates



    // start loop to set nPixels 
    var nPixels = x1-x0; // think about how many pixels need to be set - zero is not correct ;)
    if(Math.abs(m)>1){
        nPixels=Math.abs(y1-y0);
    }
    for (var i = 0; i < nPixels; ++i) {
        // set pixel using the helper function setPixelS()
        var pixel = new Point(x,y);
        setPixelS(image, pixel, new Color(0,0,0), pixelScale);
        if (Math.abs(m)<=1){
            x=x+1;
        }
        if(m>1){
            y=y+1;
        }
        if(m<-1){
            y=y-1;
        }

        if(D<0){
            if(m<0 && m>=-1){
                y=y-1;
            }
            if(m>=0 && m<=1){
                y=y+1;
            }
            if (m > 1 || m < -1) {
                x += 1;
            }
            D += DNE;
        }
        else {
            D += DE;
        }

        // update error


        // update coordinates depending on the error


    }
}




        // update coordinates depending on the error


    // }

//////////////////////////
//// render function  ////
//////////////////////////

function RenderCanvas1() {
    // get canvas handle
    var context = document.getElementById("canvas1").getContext("2d");
    var canvas = context.createImageData(200, 200);

    // clear canvas
    clearImage(canvas, new Color(255, 255, 255));

    // draw line
    bresenham(canvas, line);


    // draw start and end point with different colors
    setPixelS(canvas, line.startPoint, new Color(255, 0, 0), pixelScale);
    setPixelS(canvas, line.endPoint, new Color(0, 255, 0), pixelScale);

    // show image
    context.putImageData(canvas, 0, 0);
}


function setupBresenham(canvas) {
    // execute rendering
    RenderCanvas1();
    // add event listener
    document.getElementById("canvas1").addEventListener('mousedown', onMouseDownCanvas1, false);
}
