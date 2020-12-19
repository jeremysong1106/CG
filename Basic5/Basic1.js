function arrow(context, fromx, fromy, tox, toy, text) {
    if (fromx == tox && fromy == toy) return;

    // http://stuff.titus-c.ch/arrow.html
    var headlen = 5;   // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
    if (text) {
        var d = [tox - fromx, toy - fromy];
        var l = Math.sqrt(d[0] * d[0] + d[1] * d[1]);
        context.fillText(text, tox + 10 / l * d[0], toy + 10 / l * d[1]);
    }
}

function floatToColor(rgb_float) {
    return [Math.max(Math.min(Math.floor(rgb_float[0] * 255.0), 255), 0),
    Math.max(Math.min(Math.floor(rgb_float[1] * 255.0), 255), 0),
    Math.max(Math.min(Math.floor(rgb_float[2] * 255.0), 255), 0)];
}

function setStrokeStyle(context, rgb_float) {
    var c = floatToColor(rgb_float);
    context.strokeStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
}

function setFillStyle(context, rgb_float) {
    var c = floatToColor(rgb_float);
    context.fillStyle = 'rgb(' + c[0] + ',' + c[1] + ',' + c[2] + ')';
}

function computeNormals(polygon) {
    var nVertices = polygon.length;
    var normals = new Array(nVertices);
    for (var i = 0; i < nVertices; ++i) normals[i] = [0.0, 0.0];

    for (var e = 0; e < nVertices; ++e) {
        var i = e;
        var j = e + 1;
        if (j == nVertices) j = 0;
        var dir = [polygon[j][0] - polygon[i][0], polygon[j][1] - polygon[i][1]];
        var l = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1]);
        if (l != 0.0) {
            var edgeNormal = [-dir[1] / l, dir[0] / l];
            normals[i][0] += edgeNormal[0];
            normals[i][1] += edgeNormal[1];
            normals[j][0] += edgeNormal[0];
            normals[j][1] += edgeNormal[1];
        }
    }

    for (var i = 0; i < nVertices; ++i) {
        var n = [normals[i][0], normals[i][1]];
        var l = Math.sqrt(n[0] * n[0] + n[1] * n[1]);
        if (l != 0.0) {
            normals[i][0] = n[0] / l;
            normals[i][1] = n[1] / l;
        }
    }
    return normals;
}

function PhongLighting(context, point, normal, eye, pointLight, albedo, showVectors) {


    // TODO 5.1a) Implement Phong lighting - follow the stepwise instructions below:

    // 1. Compute view vector v, light vector l and the reflected light vector r (all pointing away from the point and normalized!).
    //    Note: To help you implementing this task, we draw the computed vectors for the user specified sample point.
    //    Replace the following dummy lines:

    var v = vec2.fromValues(eye[0] - point[0], eye[1] - point[1]);
    var l = vec2.fromValues(pointLight[0] - point[0], pointLight[1] - point[1]);
    var r1 = vec2.fromValues(pointLight[0] - point[0], point[1] - pointLight[1]);
    var r =vec2.create();
    vec2.normalize(r,r1);

    // 2. Compute the ambient part, use 0.1 * albedo as ambient material property.
    //    You can check your results by setting "color" (defined below) to only ambient part -
    //    this should give you constant dark green.
    var ambient = vec3.fromValues(0.1 * albedo[0], 0.1 * albedo[1], 0.1 * albedo[2]);

    // 3. Compute the diffuse part, use 0.5 * albedo as diffuse material property.
    //    You can check your results by setting "color" (defined below) to only diffuse part -
    //    this should give you a color which gets lighter the more the plane's normal coincides with the direction to the light.
    var alpha = Math.atan2(Math.abs(pointLight[1] - point[1]), Math.abs(pointLight[0] - point[0]));
    var diffuse = vec3.fromValues(0.5 * albedo[0] * Math.cos(alpha), 0.5 * albedo[1] * Math.cos(alpha), 0.5 * albedo[2] * Math.cos(alpha));

    // 4. Compute the specular part, assume an attenuated white specular material property (0.4 * [1.0, 1.0, 1.0]).
    //    Use the defined shiny factor.
    //    You can check your results by setting "color" (defined below) to only diffuse part -
    //    this should give you a grey spotlight where view direction and reflection vector coincide.
    var shiny = 30.0;
    var beta = Math.atan2(Math.abs(eye[0] - point[0]), Math.abs(eye[1] - point[1]));
    var phi = Math.PI / 2 - alpha - beta;
    var specular = vec3.fromValues(0.4 * Math.pow(Math.cos(phi), shiny), 0.4 * Math.pow(Math.cos(phi), shiny), 0.4 * Math.pow(Math.cos(phi), shiny));

    // 5. Add ambient, diffuse and specular color.
    //    Store the result in the variable color - replace the following dummy line:
    var color = vec3.fromValues(ambient[0] + diffuse[0] + specular[0], ambient[1] + diffuse[1] + specular[1], ambient[2] + diffuse[2] + specular[2]);
    // var color = vec3.fromValues(diffuse[0], diffuse[1], diffuse[2]);


    if (showVectors) {
        // draw vectors
        var vecScale = 100;
        context.strokeStyle = 'rgb(0,0,0)';
        arrow(context, point[1], point[0], point[1] + vecScale * normal[1], point[0] + vecScale * normal[0], "n");
        arrow(context, point[1], point[0], point[1] + vecScale * v[1], point[0] + vecScale * v[0], "v");
        arrow(context, point[1], point[0], point[1] + vecScale * l[1], point[0] + vecScale * l[0], "l");
        arrow(context, point[1], point[0], point[1] + vecScale * r[1], point[0] + vecScale * r[0], "r");
    }

    return color;
}

var Basic1_1 = function () {
    var canvas;
    var nSamples = 5;
    var alpha = 0.25;

    function Render() {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 600, 300);
        context.font = "italic 12px Georgia";
        context.textAlign = "center";

        // light source
        var eye = [40, 20];

        // draw eye
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.fillText("eye", eye[1], eye[0] + 20);
        context.arc(eye[1], eye[0], 4, 0, 2 * Math.PI);
        context.fill();

        // light source
        var pointLight = [20, 580];

        // draw light source
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.fillText("light", pointLight[1], pointLight[0] + 20);
        context.arc(pointLight[1], pointLight[0], 4, 0, 2 * Math.PI);
        context.fill();

        // line
        var line = [[270, 0], [270, 600]];
        var albedo = [0, 1, 0];

        // draw surface (line)
        setStrokeStyle(context, [0.5, 0.5, 0.5]);
        context.beginPath();
        context.lineWidth = 4;
        context.moveTo(line[0][1], line[0][0]);
        context.lineTo(line[1][1], line[1][0]);
        context.stroke();
        context.fillText("surface", line[0][1] + 50, line[0][0] + 20);
        context.lineWidth = 1;

        for (var i = 0; i < nSamples; ++i) {
            var _alpha = i / (nSamples - 1.0);
            // sampled point on the surface
            var point = [(1.0 - _alpha) * line[0][0] + _alpha * line[1][0], (1.0 - _alpha) * line[0][1] + _alpha * line[1][1]];
            var normal = [-1.0, 0.0];

            // compute light - Phong Lighting
            var color = PhongLighting(context, point, normal, eye, pointLight, albedo, false);

            // draw point
            setFillStyle(context, color)
            context.beginPath();
            context.arc(point[1], point[0], 4, 0, 2 * Math.PI);
            context.fill();
        }

        // current point on the surface
        var point = [(1.0 - alpha) * line[0][0] + alpha * line[1][0], (1.0 - alpha) * line[0][1] + alpha * line[1][1]];
        var normal = [-1.0, 0.0];

        // compute light - Phong Lighting
        var color = PhongLighting(context, point, normal, eye, pointLight, albedo, true);

        // draw point
        setFillStyle(context, color)
        context.beginPath();
        context.fillText("p", point[1], point[0] + 20);
        context.arc(point[1], point[0], 6, 0, 2 * Math.PI);
        context.fill();
    }

    return {
        start: function (_canvas) {
            canvas = _canvas;

            // reset the slider and the checkboxes
            var slider = document.getElementById('nSamples');
            slider.value = 5;

            canvas.addEventListener('mousedown', onMouseDown, false);
            Render();
        },
        onChangeNSamples: function (value) {
            nSamples = value;
            Render();
        }
    }

    function onMouseDown(e) {
        var rect = canvas.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        alpha = x / rect.width;
        Render();
    }
}()

var Basic1_2 = function () {
    var canvas;
    var nLineSegments = 5;
    var amplitude = 50;

    function Render() {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 600, 300);
        context.font = "italic 12px Georgia";
        context.textAlign = "center";

        // light source
        var eye = [40, 20];

        // draw eye
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.fillText("eye", eye[1], eye[0] + 20);
        context.arc(eye[1], eye[0], 4, 0, 2 * Math.PI);
        context.fill();

        // light source
        var pointLight = [20, 580];

        // draw light source
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.fillText("light", pointLight[1], pointLight[0] + 20);
        context.arc(pointLight[1], pointLight[0], 4, 0, 2 * Math.PI);
        context.fill();

        // line segments
        var p0 = 0;
        var p1 = 600;
        var lineSegments = new Array(nLineSegments);
        for (var i = 0; i < nLineSegments; ++i) {
            var _alpha = i / (nLineSegments);
            var start = [270 - amplitude * Math.sin(_alpha * Math.PI), Math.floor((1.0 - _alpha) * p0 + _alpha * p1)];
            _alpha = (i + 1.0) / (nLineSegments);
            var end = [270 - amplitude * Math.sin(_alpha * Math.PI), Math.ceil((1.0 - _alpha) * p0 + _alpha * p1)];
            lineSegments[i] = [[start[0], start[1]], [end[0], end[1]]];
        }
        var albedo = [0, 1, 0];

        // draw surface (line segments) using flat shading
        for (var i = 0; i < nLineSegments; ++i) {

            // TODO 5.1b) Implement Flat Shading of the line segments - follow the stepwise instructions below:

            // 1. Compute representant of the primitive (-> midpoint on the line segment).
            var midpoint = [(lineSegments[i][0][0] + lineSegments[i][1][0])/2, (lineSegments[i][0][1] + lineSegments[i][1][1])/2];

            // 2. Compute the normal of the line segment.
            var normal = [-1.0, midpoint[1]];

            // 3. Use the function PhongLighting that you implemented in the previous assignment to evaluate the color.
            color = PhongLighting(context, midpoint, normal, eye, pointLight, albedo, false);

            // 4. Set the stroke color (use setStrokeStyle() defined in this .js-file).
            setStrokeStyle(context,color);



            // draw the line segment
            context.beginPath();
            context.lineWidth = 8;
            context.moveTo(lineSegments[i][0][1], lineSegments[i][0][0]);
            context.lineTo(lineSegments[i][1][1], lineSegments[i][1][0]);
            context.stroke();

            if (i < nLineSegments - 1) {
                // draw auxiliary line between this and the next line segment
                context.beginPath();
                setStrokeStyle(context, [0, 0, 0]);
                context.lineWidth = 1;
                context.moveTo(lineSegments[i][1][1], lineSegments[i][1][0] + 4);
                context.lineTo(lineSegments[i][1][1], lineSegments[i][1][0] + 14);
                context.stroke();
            }
        }
        context.fillText("surface", p0[1] + 50, p0[0] + 20);
        context.lineWidth = 1;
    }

    return {
        start: function (_canvas) {
            canvas = _canvas;

            // reset the slider and the checkboxes
            var slider1 = document.getElementById('nLineSegments2_2');
            slider1.value = 5;
            var slider2 = document.getElementById('amplitude2_2');
            slider2.value = 50;

            Render();
        },
        onChangeNLineSegments: function (value) {
            nLineSegments = value;
            Render();
        },
        onChangeAmplitude: function (value) {
            amplitude = value;
            Render();
        }
    }
}()

var Basic1_3 = function () {
    var canvas;
    var nLineSegments = 5;
    var amplitude = 50;

    function Render() {
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 600, 300);
        context.font = "italic 12px Georgia";
        context.textAlign = "center";

        // light source
        var eye = [40, 20];

        // draw eye
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.fillText("eye", eye[1], eye[0] + 20);
        context.arc(eye[1], eye[0], 4, 0, 2 * Math.PI);
        context.fill();

        // light source
        var pointLight = [20, 580];

        // draw light source
        context.fillStyle = 'rgb(0,0,0)';
        context.beginPath();
        context.fillText("light", pointLight[1], pointLight[0] + 20);
        context.arc(pointLight[1], pointLight[0], 4, 0, 2 * Math.PI);
        context.fill();

        // line segments
        var p0 = 0;
        var p1 = 600;
        var lineSegments = new Array(nLineSegments);
        for (var i = 0; i < nLineSegments; ++i) {
            var _alpha = i / (nLineSegments);
            var start = [270 - amplitude * Math.sin(_alpha * Math.PI), Math.floor((1.0 - _alpha) * p0 + _alpha * p1)];
            _alpha = (i + 1.0) / (nLineSegments);
            var end = [270 - amplitude * Math.sin(_alpha * Math.PI), Math.ceil((1.0 - _alpha) * p0 + _alpha * p1)];
            lineSegments[i] = [[start[0], start[1]], [end[0], end[1]]];
        }
        var albedo = [0, 1, 0];

        // draw surface (line segments) using flat shading
        for (var i = 0; i < nLineSegments; ++i) {


            // TODO 5.1c) Implement Gouraud Shading of the line segments - follow the stepwise instructions below:

            // 1. Evaluate the color at the vertices using the PhongLighting function.
            var normal = [-1.0, 0.0];
            var s = PhongLighting(context, lineSegments[i][0], normal, eye, pointLight, albedo, false);
            var e = PhongLighting(context, lineSegments[i][1], normal, eye, pointLight, albedo, false);

            // 2. Use the linear gradient stroke style of the context to linearly interpolate the vertex colors over the
            // primitive (https://www.w3schools.com/TAgs/canvas_createlineargradient.asp).
            //    The color triples can be scaled from [0,1] to [0,255] using the function floatToColor().
            //    The start and end points of the line segments are stored in [y,x] order concerning the canvas, r
            //    emember when using createLinearGradient()!
            var start_color = floatToColor(s);
            var end_color = floatToColor(e);
            var grd=context.creatLinearGradient(lineSegments[i][0][1], lineSegments[i][0][0], lineSegments[i][1][1], lineSegments[i][1][0]);
            grd.addColorStop(0, 'rgb(' + start_color[0] + ',' + start_color[1] + ',' + start_color[2] + ')');
            grd.addColorStop(1, 'rgb(' + end_color[0] + ',' + end_color[1] + ',' + end_color[2] + ')');
            context.strokeStyle = grd;



            // draw line segment
            context.beginPath();
            context.lineWidth = 8;
            context.moveTo(lineSegments[i][0][1], lineSegments[i][0][0]);
            context.lineTo(lineSegments[i][1][1], lineSegments[i][1][0]);
            context.stroke();

            if (i < nLineSegments - 1) {
                // draw auxiliary line between this and the next line segment
                context.beginPath();
                setStrokeStyle(context, [0, 0, 0]);
                context.lineWidth = 1;
                context.moveTo(lineSegments[i][1][1], lineSegments[i][1][0] + 4);
                context.lineTo(lineSegments[i][1][1], lineSegments[i][1][0] + 14);
                context.stroke();
            }
        }
        context.fillText("surface", p0[1] + 50, p0[0] + 20);
        context.lineWidth = 1;
    }

    return {
        start: function (_canvas) {
            canvas = _canvas;

            // reset the slider and the checkboxes
            var slider1 = document.getElementById('nLineSegments2_3');
            slider1.value = 5;
            var slider2 = document.getElementById('amplitude2_3');
            slider2.value = 50;

            Render();
        },
        onChangeNLineSegments: function (value) {
            nLineSegments = value;
            Render();
        },
        onChangeAmplitude: function (value) {
            amplitude = value;
            Render();
        }
    }
}()

