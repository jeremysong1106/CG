

function webGLStart(canvas) {

    var gl = canvas.getContext("experimental-webgl");
    if (!gl) alert("Could not initialise WebGL, sorry :-(\nTo enable WebGL support in your browser, go to about:config and skip the warning.\nSearch for webgl.disabled and set its value to false.");

    gl.viewport(0, 0, canvas.width, canvas.height);



    // TODO 3.2a)	Replace the following code so that
    //              the "vertices" array does not only
    //              contain positions of each vertex,
    //              but also colors. The layout should 
    //              be as follows:
    //              [p0x,p0y,c0x,c0y,c0z,p1x...

    var vertices = [-.5, -.5, 1,0,0,
                     .5, -.5, 0,1,0,
                     0, .5,   0,0,1];


    var indices = [0, 1, 2];


    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    // var vertexShader=gl.createShader(gl.VERTEX_SHADER);
    // gl.shaderSource(vertexShader, getVertexShaderCode());
    // gl.compileShader(vertexShader);
    // if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    //     alert(gl.getShaderInfoLog(vertexShader));
    // var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    // gl.shaderSource(fragmentShader, getFragmentShaderCode());
    // gl.compileShader(fragmentShader);
    // if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
    //     alert(gl.getShaderInfoLog(fragmentShader));


    var fragmentShader = getShader(gl, "shaderWireFrame-fs");
    var vertexShader = getShader(gl, "shaderWireFrame-vs");

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);




    // TODO 3.2a)	Add code to create and enable the second
    //              attribute. Use gl.vertexAttribPointer() to
    //              set offset and stride (in bytes!).
    //              BEWARE: You also have to change the stride
    //              for the position attribute!
// attribute vec2 vColor;
//     attribute vec2 pos;

    var attrVertexPosition = gl.getAttribLocation(shaderProgram, "vVertex");
    gl.enableVertexAttribArray(attrVertexPosition);
    gl.vertexAttribPointer(attrVertexPosition, 2, gl.FLOAT, false, 20, 0);

    var attrVertexColor=gl.getAttribLocation(shaderProgram,'col');
    gl.enableVertexAttribArray(attrVertexColor);
    gl.vertexAttribPointer(attrVertexColor,3,gl.FLOAT,false,20,8);


    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}
