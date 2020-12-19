function webGLStart(canvas) {

    var gl = canvas.getContext("experimental-webgl");
    if (!gl) alert("Could not initialise WebGL, sorry :-(\nTo enable WebGL support in your browser, go to about:config and skip the warning.\nSearch for webgl.disabled and set its value to false.");

    gl.viewport(0, 0, canvas.width, canvas.height);

    var c = [0.3, 0.2];
    var r = 0.7;
    var slices = 100;

    var vertices = [];
    var indices = [];


    // TODO 3.1)	Replace the following code so that
    //              the vertices and indices to not describe
    //              a triangle but a circle around the center
    //              c with radius r. Use triangles to describe 
    //              the circle's geometry. The number of
    //              triangles is stored in the variable slices.
    vertices.push(0.3,0.2);
    for(var i=0;i<slices+1;i++){
        // vertices.push(0.3,0.2);
        vertices.push(0.3+r*Math.cos(2*Math.PI*i/100),0.2+r*Math.sin(2*Math.PI*i/100));
        // vertices.push(0.3+r*Math.cos(2*Math.PI*(i+1)/100),0.2+r*Math.sin(2*Math.PI*(i+1)/100));
        // indices.push(0);
        // indices.push(i+1);
        // indices.push(i+2);
    }

  for(var i=1;i<slices+1;i++){
      indices.push(0);
      indices.push(i);
      indices.push(i+1);

}


         var vbo = gl.createBuffer();
         gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
         gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
         var ibo = gl.createBuffer();
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

         var vertexShader = getShader(gl, "shader-vs");
         var fragmentShader = getShader(gl, "shader-fs");

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

         gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

}
