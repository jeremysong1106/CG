var enableInteraction = false;

mat4.perspective = function (out, fovy, near, far) {

    // TODO 4.2     Implement the creation of the projection
    //              matrix. Orientate yourselves by the 2D case
    //              implemented in Basic1.js.

    out[0] = 2*near/(near*Math.tan(fovy/2)+near*Math.tan(fovy/2));
    out[1] =0;
    out[2] =0;
    out[3]=0;

    out[4] =0;
    out[5] =2*near/(near*Math.tan(fovy/2)+near*Math.tan(fovy/2));
    out[6] =0;
    out[7] =0;

    out[8] =0;
    out[9] =0;
    out[10] =-(far+near)/(far-near);
    out[11] =-1;

    out[12] =0;
    out[13] =0;
    out[14] =-2*far*near/(far-near);
    out[15] =0;


    return out;


};

function Camera3D() {
    this.eye = [10, 10, 10];
    this.fovy = 30.0 / 180.0 * Math.PI;
    this.near = 5;
    this.far = 30;
    this.lookAtPoint = [0, 0, 0];
    this.upVector = [0, 1, 0];

    // the cameraMatrix transforms from world space to camera space
    this.cameraMatrix = mat4.create();
    // projection matrix
    this.projectionMatrix = mat4.create();

    // setup matrices
    this.update();
}

Camera3D.prototype.setMatrices = function (cameraMatrix, projectionMatrix) {
    this.cameraMatrix = cameraMatrix;
    this.projectionMatrix = projectionMatrix;
};

Camera3D.prototype.lookAt = function (point3D) {
    this.lookAtPoint = [point3D[0], point3D[1], point3D[2]];
    this.update();
};

Camera3D.prototype.setEye = function (eye3D) {
    this.eye[0] = eye3D[0];
    this.eye[1] = eye3D[1];
    this.eye[2] = eye3D[2];
    this.update();
};

Camera3D.prototype.setFar = function (far) {
    this.far = far;
    this.update();
};

Camera3D.prototype.setFovy = function (fovy) {
    this.fovy = fovy;
    this.update();
};

Camera3D.prototype.move = function (dir) {
    if (dir == 0) {
        vec3.sub(this.eye, this.eye, this.w);
    } else if (dir == 1) {
        var origin = vec3.fromValues(0, 0, 0);
        vec3.rotateY(this.eye, this.eye, origin, -5 * Math.PI / 180);
    } else if (dir == 2) {
        vec3.add(this.eye, this.eye, this.w);
    } else if (dir == 3) {
        var origin = vec3.fromValues(0, 0, 0);
        vec3.rotateY(this.eye, this.eye, origin, 5 * Math.PI / 180);
    }
    this.update();
};

Camera3D.prototype.update = function () {

    // TODO 4.2     Implement the creation of the camera matrix
    //              (this.cameraMatrix), also setting the three
    //              vectors this.u, this.v and this.w which form
    //              the camera coordinate system. Use the
    //              notation from the lecture.
    //              Again, be careful to use column-major notation.
    this.g=vec3.create();
    this.u=vec3.create();
    this.v=vec3.create();
    this.w=vec3.create();
    vec3.subtract(this.g,this.lookAtPoint,this.eye);
    vec3.scale(this.w,this.g,-1/vec3.length(this.g));
    vec3.cross(this.u,this.upVector,this.w);
    vec3.scale(this.u,this.u,1/vec3.length(this.u));
    vec3.cross(this.v,this.w,this.u);





    this.cameraMatrix=mat4.create();
    this.cameraMatrix[0]=this.u[0];
    this.cameraMatrix[1]=this.v[0];
    this.cameraMatrix[2]=this.w[0];
    this.cameraMatrix[3]=0;
    this.cameraMatrix[4]=this.u[1];
    this.cameraMatrix[5]=this.v[1];
    this.cameraMatrix[6]=this.w[1];
    this.cameraMatrix[7]=0;
    this.cameraMatrix[8]=this.u[2];
    this.cameraMatrix[9]=this.v[2];
    this.cameraMatrix[10]=this.w[2];
    this.cameraMatrix[11]=0;
    this.cameraMatrix[12]=-1*(this.u[0]*this.eye[0]+this.u[1]*this.eye[1]+this.u[2]*this.eye[2]);
    this.cameraMatrix[13]=-1*(this.v[0]*this.eye[0]+this.v[1]*this.eye[1]+this.v[2]*this.eye[2]);
    this.cameraMatrix[14]=-1*(this.w[0]*this.eye[0]+this.w[1]*this.eye[1]+this.w[2]*this.eye[2]);
    this.cameraMatrix[15]=1;








    // use mat4.perspective to set up the projection matrix
    mat4.perspective(this.projectionMatrix, this.fovy, this.near, this.far);


};


var Basic2 = function () {

    // shader programs
    var shaderProgramCube;
    var shaderProgramLine;

    // clear color
    var clearColor = [0.5, 0.5, 0.5];

    // gl buffer data
    var vboCube;
    var iboCube;
    var iboNCube;
    var vboCube;
    var iboCube;
    var iboNCube;

    // cameras
    var camera = new Camera3D();
    var cameraDebug = new Camera3D();


    ////////////////////////////////
    ////////  webGL helper  ////////
    ////////////////////////////////
    function initGL(canvas) {
        console.log("init webGL");
        // http://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html
        var gl;
        try {
            gl = canvas.getContext("experimental-webgl");
        } catch (e) { }
        if (!gl) alert("Could not initialise WebGL, sorry :-(");
        return gl;
    }

    // shader from java script block
    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "--fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        }
        else if (shaderScript.type == "--vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        }
        else return null;

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    function shaderProgram(gl, vertexShaderSourceID, fragmentShaderSourceID) {
        var vertexShader = getShader(gl, vertexShaderSourceID);
        var fragmentShader = getShader(gl, fragmentShaderSourceID);

        // create shader program
        var shaderProgram = gl.createProgram();

        // attach shaders
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);

        // link program
        gl.linkProgram(shaderProgram);
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }
        return shaderProgram;
    }

    //////////////////////////////
    ////////  init scene  ////////
    //////////////////////////////
    function initScene(gl) {

        //////////////////////////////////////
        ////////  setup geometry - cube //////
        //////////////////////////////////////

        // buffer on the cpu
        var v = [
            // front
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,
            // back
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
        ];

        var i = [
            // front
            0, 1, 2,
            2, 3, 0,
            // top
            1, 5, 6,
            6, 2, 1,
            // back
            7, 6, 5,
            5, 4, 7,
            // bottom
            4, 0, 3,
            3, 7, 4,
            // left
            4, 5, 1,
            1, 0, 4,
            // right
            3, 2, 6,
            6, 7, 3,
        ];

        // create vertex buffer on the gpu
        vboCube = gl.createBuffer();
        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vboCube);
        // copy data from cpu to gpu memory
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

        // create index buffer on the gpu
        iboCube = gl.createBuffer();
        // bind buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboCube);
        // copy data from cpu to gpu memory
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);

        iboNCube = i.length;

        //////////////////////////////////////
        ////////  setup geometry - line //////
        //////////////////////////////////////

        // buffer on the cpu
        v = [0, 0, 0,
            0, 0, 1];
        i = [0, 1];


        // create vertex buffer on the gpu
        vboLine = gl.createBuffer();
        // bind buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vboLine);
        // copy data from cpu to gpu memory
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);

        // create index buffer on the gpu
        iboLine = gl.createBuffer();
        // bind buffer
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLine);
        // copy data from cpu to gpu memory
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(i), gl.STATIC_DRAW);

        iboNLine = i.length;


        ///////////////////////////////
        ////////  setup shaders  //////
        ///////////////////////////////
        shaderProgramCube = shaderProgram(gl, "shader-vs-cube", "shader-fs-cube");
        gl.useProgram(shaderProgramCube);
        attrVertex = gl.getAttribLocation(shaderProgramCube, "vVertex");
        gl.enableVertexAttribArray(attrVertex);

        shaderProgramLine = shaderProgram(gl, "shader-vs-line", "shader-fs-line");
        gl.useProgram(shaderProgramLine);
        attrVertex = gl.getAttribLocation(shaderProgramLine, "vVertex");
        gl.enableVertexAttribArray(attrVertex);

        ////////////////////////////////////
        ////////  setup debug camera  //////
        ////////////////////////////////////

        var debugCameraMatrix = mat4.fromValues(0.2873478829860687, -0.1802094429731369, 0.9407208561897278, 0,
            0, 0.9821414351463318, 0.18814417719841003, 0,
            -0.9578263163566589, -0.05406283214688301, 0.28221625089645386, 0,
            5.960464477539062e-7, 2.7939677238464355e-7, -53.15073013305664, 1);
        var debugProjectionMatrix = mat4.fromValues(3.732, 0, 0, 0, 0, 3.732, 0, 0, 0, 0, -1.01, -1, 0, 0, -10.05, 0);
        cameraDebug.setMatrices(debugCameraMatrix, debugProjectionMatrix);
    }

    //////////////////////////////
    ////////  draw scene  ////////
    //////////////////////////////

    function drawScene(gl, time, debug) {

        var modelMatrixCube = mat4.create();

        var cam = debug ? cameraDebug : camera;

        // draw the cube
        drawCube(gl, time, modelMatrixCube, cam);

        if (debug) {
            // draw camera frustum

            var halfSideFar = camera.far * Math.tan(camera.fovy);
            var halfSideNear = camera.near * Math.tan(camera.fovy);
            var from = vec3.fromValues(camera.eye[0], camera.eye[1], camera.eye[2]);

            for (var i = 0; i < 4; i++) {
                var from_corner = [-1, -1];
                var to_corner = [-1, 1];
                if (i == 1) {
                    from_corner = [-1, 1];
                    to_corner = [1, 1];
                } else if (i == 2) {
                    from_corner = [1, 1];
                    to_corner = [1, -1];
                } else if (i == 3) {
                    from_corner = [1, -1];
                    to_corner = [-1, -1];
                }

                // draw near plane
                var fromNear = vec3.fromValues(camera.eye[0] - camera.w[0] * camera.near + from_corner[0] * camera.u[0] * halfSideNear + from_corner[1] * camera.v[0] * halfSideNear,
                    camera.eye[1] - camera.w[1] * camera.near + from_corner[0] * camera.u[1] * halfSideNear + from_corner[1] * camera.v[1] * halfSideNear,
                    camera.eye[2] - camera.w[2] * camera.near + from_corner[0] * camera.u[2] * halfSideNear + from_corner[1] * camera.v[2] * halfSideNear);
                var toNear = vec3.fromValues(camera.eye[0] - camera.w[0] * camera.near + to_corner[0] * camera.u[0] * halfSideNear + to_corner[1] * camera.v[0] * halfSideNear,
                    camera.eye[1] - camera.w[1] * camera.near + to_corner[0] * camera.u[1] * halfSideNear + to_corner[1] * camera.v[1] * halfSideNear,
                    camera.eye[2] - camera.w[2] * camera.near + to_corner[0] * camera.u[2] * halfSideNear + to_corner[1] * camera.v[2] * halfSideNear);
                var modelMatrix = mat4.fromValues(0, 0, 0, 0,
                    0, 0, 0, 0,
                    toNear[0] - fromNear[0], toNear[1] - fromNear[1], toNear[2] - fromNear[2], 0,
                    fromNear[0], fromNear[1], fromNear[2], 1);
                drawLine(gl, modelMatrix);

                // draw far plane
                var fromFar = vec3.fromValues(camera.eye[0] - camera.w[0] * camera.far + from_corner[0] * camera.u[0] * halfSideFar + from_corner[1] * camera.v[0] * halfSideFar,
                    camera.eye[1] - camera.w[1] * camera.far + from_corner[0] * camera.u[1] * halfSideFar + from_corner[1] * camera.v[1] * halfSideFar,
                    camera.eye[2] - camera.w[2] * camera.far + from_corner[0] * camera.u[2] * halfSideFar + from_corner[1] * camera.v[2] * halfSideFar);
                var toFar = vec3.fromValues(camera.eye[0] - camera.w[0] * camera.far + to_corner[0] * camera.u[0] * halfSideFar + to_corner[1] * camera.v[0] * halfSideFar,
                    camera.eye[1] - camera.w[1] * camera.far + to_corner[0] * camera.u[1] * halfSideFar + to_corner[1] * camera.v[1] * halfSideFar,
                    camera.eye[2] - camera.w[2] * camera.far + to_corner[0] * camera.u[2] * halfSideFar + to_corner[1] * camera.v[2] * halfSideFar);
                var modelMatrix = mat4.fromValues(0, 0, 0, 0,
                    0, 0, 0, 0,
                    toFar[0] - fromFar[0], toFar[1] - fromFar[1], toFar[2] - fromFar[2], 0,
                    fromFar[0], fromFar[1], fromFar[2], 1);
                drawLine(gl, modelMatrix);

                // draw sides
                var modelMatrix = mat4.fromValues(0, 0, 0, 0,
                    0, 0, 0, 0,
                    toFar[0] - from[0], toFar[1] - from[1], toFar[2] - from[2], 0,
                    from[0], from[1], from[2], 1);
                drawLine(gl, modelMatrix);
            }
        }
    }

    function drawCube(gl, time, modelMatrix, cam) {
        gl.useProgram(shaderProgramCube);
        // set shader uniforms
        var uniformLocModelMatrix = gl.getUniformLocation(shaderProgramCube, "modelMatrix");
        gl.uniformMatrix4fv(uniformLocModelMatrix, false, modelMatrix);
        var uniformLocCameraMatrix = gl.getUniformLocation(shaderProgramCube, "cameraMatrix");
        gl.uniformMatrix4fv(uniformLocCameraMatrix, false, cam.cameraMatrix);
        var uniformLocProjectionMatrix = gl.getUniformLocation(shaderProgramCube, "projectionMatrix");
        gl.uniformMatrix4fv(uniformLocProjectionMatrix, false, cam.projectionMatrix);
        // bind buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, vboCube);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboCube);
        var attrVertex = gl.getAttribLocation(shaderProgramCube, "vVertex");
        gl.vertexAttribPointer(attrVertex, 3, gl.FLOAT, false, 12, 0);
        // draw
        gl.drawElements(gl.TRIANGLES, iboNCube, gl.UNSIGNED_SHORT, 0);
    }

    function drawLine(gl, modelMatrix) {
        gl.useProgram(shaderProgramLine);
        // set shader uniforms
        var uniformLocModelMatrix = gl.getUniformLocation(shaderProgramLine, "modelMatrix");
        gl.uniformMatrix4fv(uniformLocModelMatrix, false, modelMatrix);
        var uniformLocCameraMatrix = gl.getUniformLocation(shaderProgramLine, "cameraMatrix");
        gl.uniformMatrix4fv(uniformLocCameraMatrix, false, cameraDebug.cameraMatrix);
        var uniformLocProjectionMatrix = gl.getUniformLocation(shaderProgramLine, "projectionMatrix");
        gl.uniformMatrix4fv(uniformLocProjectionMatrix, false, cameraDebug.projectionMatrix);
        // bind buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, vboLine);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboLine);
        var attrVertex = gl.getAttribLocation(shaderProgramLine, "vVertex");
        gl.vertexAttribPointer(attrVertex, 3, gl.FLOAT, false, 12, 0);
        // draw
        gl.drawElements(gl.LINES, iboNLine, gl.UNSIGNED_SHORT, 0);
    }

    /////////////////////////////
    ///////   Render Loop   /////
    /////////////////////////////
    var gl; // webGL context
    var t = 0; // time counter

    function renderLoop() {

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        // draw scene from camera on left side
        gl.viewport(0, 0, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
        drawScene(gl, t, false);

        // draw scene from debug view on right side
        gl.viewport(gl.drawingBufferWidth / 2, 0, gl.drawingBufferWidth / 2, gl.drawingBufferHeight);
        drawScene(gl, t, true);

        // wait
        window.setTimeout(renderLoop, 1000 / 60);

        // update time
        t += 1000 / 60;
    }

    ///////////////////////////////////
    //////////   setup web gl   ///////
    ///////////////////////////////////

    var canvas;

    return {
        webGLStart: function (_canvas) {
            // store canvas
            canvas = _canvas;

            // reset the slider
            var slider = document.getElementById('slider_fovy');
            slider.value = 30;

            // add event listener
            document.addEventListener('keypress', onKeyPress, false);

            // initialize webGL canvas
            gl = new initGL(canvas);

            // init scene and shaders
            initScene(gl);

            // set clear color and enable depth test
            gl.clearColor(clearColor[0], clearColor[1], clearColor[2], 1.0);
            gl.enable(gl.DEPTH_TEST);

            // start render loop
            renderLoop();
        },

        onChangeFovySlider: function (value) {
            camera.setFovy(value * Math.PI / 180.0);
        }
    }

    /////////////////////////////////////
    //////////   event listener   ///////
    /////////////////////////////////////

    function onKeyPress(e) {
        if (enableInteraction) {
            if (e.charCode == 119) { // W
                camera.move(0);
            } else if (e.charCode == 97) { // A
                camera.move(1);
            } else if (e.charCode == 115) { // S
                camera.move(2);
            } else if (e.charCode == 100) { // D
                camera.move(3);
            }
        }

    }
}()
