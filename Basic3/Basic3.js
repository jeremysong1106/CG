function webGLStart(canvas) {

    var gl = canvas.getContext("experimental-webgl");
    if (!gl) alert("Could not initialise WebGL, sorry :-(\nTo enable WebGL support in your browser, go to about:config and skip the warning.\nSearch for webgl.disabled and set its value to false.");

    var glVersion = gl.getParameter(gl.VERSION);
    var glslVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
    console.log("GL Version: \t" + glVersion);
    console.log("GLSL Version: \t" + glslVersion);

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    var vertices = [-1, -1,
    1, -1,
    1, 1,
    -1, 1];
    var indices = [0, 1, 2, 0, 2, 3];

    var vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    var ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);


    var fragmentShader = getShader(gl, "shaderCircleFromQuad-fs");
    var vertexShader = getShader(gl, "shaderCircleFromQuad-vs");

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

    var attrVertexPosition = gl.getAttribLocation(shaderProgram, "vVertex");
    gl.enableVertexAttribArray(attrVertexPosition);
    gl.vertexAttribPointer(attrVertexPosition, 2, gl.FLOAT, false, 8, 0);



    // TODO 3.3)	Define a constant variable (uniform) to 
    //              "send" the canvas size to all fragments.


    var UniformLocation =gl.getUniformLocation(shaderProgram,"canvasSize")
     gl.uniform2f(UniformLocation,canvas.width,canvas.height);




    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
}
