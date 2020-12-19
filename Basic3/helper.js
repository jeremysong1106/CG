// init webGL
function initGL(canvas) {
    console.log("init webGL");
    var gl;
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(\nTo enable WebGL support in your browser, go to about:config and skip the warning.\nSearch for webgl.disabled and set its value to false.");
    }
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

    return getShaderFromSource(gl, str, shaderScript.type);
}

// shader from string source
function getShaderFromSource(gl, shaderSource, shaderType) {
    if (!shaderSource) {
        return null;
    }

    var shader;
    if (shaderType == "--fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if (shaderType == "--vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else {
        return null;
    }

    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

// shader program, todo: do something to generalize
function ShaderProgram(gl, vertexShaderSource, fragmentShaderSource, as_string) {
    var vertexShader;
    var fragmentShader;

    if (as_string) {
        vertexShader = getShaderFromSource(gl, vertexShaderSource, "--vertex");
        fragmentShader = getShaderFromSource(gl, fragmentShaderSource, "--fragment");
    } else {
        vertexShader = getShader(gl, vertexShaderSource)
        fragmentShader = getShader(gl, fragmentShaderSource);
    }

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

    // member function used to attach attributes to the shader program
    shaderProgram.attachAttribute = function (gl, attributeVarName) {
        var shaderProgram = this;
        gl.useProgram(shaderProgram);
        var attributeLocation = gl.getAttribLocation(shaderProgram, attributeVarName);

        if (attributeLocation == null) {
            console.log("Could not attach attribute [" + attributeVarName + "]! Either not defined or unused attribute!");
        } else {
            eval("shaderProgram." + attributeVarName + " = attributeLocation");
        }
    };

    // member function used to attach uniforms to the shader program
    shaderProgram.attachUniform = function (gl, uniformVarName) {
        var shaderProgram = this;
        gl.useProgram(shaderProgram);
        var uniformLocation = gl.getUniformLocation(shaderProgram, uniformVarName);

        if (uniformLocation == null) {
            console.log("Could not attach uniform [" + uniformVarName + "]! Either not defined or unused uniform!");
        } else {
            eval("shaderProgram." + uniformVarName + " = uniformLocation");
        }
    };

    gl.useProgram(shaderProgram);

    return shaderProgram;
};

////////////////////////////////////////////////////////////////////////
//////////////////////    point "class"      ///////////////////////////
////////////////////////////////////////////////////////////////////////
function Point(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.vbo = null;
    this.r = r;
    this.g = g;
    this.b = b;
};

Point.prototype.initBuffers = function (gl) {
    var vertices = [this.x, this.y];
    if (this.vbo != 0) {
        console.log("Delete VBO");
        gl.deleteBuffer(this.vbo);
    }

    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vbo.itemSize = 2;
    this.vbo.numItems = 1;
};

Point.prototype.updateBuffers = function (gl) {
    if (this.vbo != 0) {
        var vertices = [this.x, this.y];
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    } else {
        initBuffers(gl);
    }
};

////////////////////////////////////////////////////////////////////////
/////////////////    line "class"      /////////////////////////////////
////////////////////////////////////////////////////////////////////////
function Line2D(from, to, r, g, b) {
    this.fromX = from[0];
    this.fromY = from[1];
    this.toX = to[0];
    this.toY = to[1];
    this.r = r;
    this.g = g;
    this.b = b;
};

Line2D.prototype.initBuffers = function (gl) {
    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([this.fromX, this.fromY, this.toX, this.toY]), gl.STATIC_DRAW);
    this.vbo.itemSize = 2;
    this.vbo.numItems = 2;
};

Line2D.prototype.updateBuffers = function (gl) {
    if (this.vbo != 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([this.fromX, this.fromY, this.toX, this.toY]), gl.STATIC_DRAW);
    } else {
        initBuffers(gl);
    }
};

////////////////////////////////////////////////////////////////////////
/////////////////    triangle strip "class"      ///////////////////////
////////////////////////////////////////////////////////////////////////
function TriangleStrip2D(vertices, nVertices, r, g, b) {
    this.vertices = vertices;
    this.nVertices = nVertices;
    this.r = r;
    this.g = g;
    this.b = b;
};

TriangleStrip2D.prototype.initBuffers = function (gl) {
    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    this.vbo.itemSize = 2;
    this.vbo.numItems = this.nVertices;
};

TriangleStrip2D.prototype.updateBuffers = function (gl) {
    if (this.vbo != 0) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
    } else {
        initBuffers(gl);
    }
};
