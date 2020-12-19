////////////////////////////////////////////////////////
/////////////////////   HELPER   ///////////////////////
////////////////////////////////////////////////////////

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

function isVec2Parallel(dir0, dir1) {
    if (dir0[0] == 0.0 && dir1[0] == 0.0) return true;
    if (dir0[1] == 0.0 && dir1[1] == 0.0) return true;
    if (dir0[0] / dir1[0] == dir0[1] / dir1[1]) return true;
    return false;
}


////////////////////////////////////////////////////////
////////////////////   MATERIAL   //////////////////////
////////////////////////////////////////////////////////

function Material(color, type, args) {
    this.color = color;
    this.type = type; // 1: perfect mirror, 2: perfect diffuse
    this.args = args;
}


////////////////////////////////////////////////////////
//////////////   INTERSECTION POINT   //////////////////
////////////////////////////////////////////////////////

function Intersection(t_ray, material, normal, point) {
    this.t_ray = t_ray;
    this.material = material;
    this.normal = vec2.clone(normal);
    this.point = vec2.clone(point);
}

Intersection.prototype.log = function () {
    console.log("intersection");
    console.log("t: " + this.t_ray);
    console.log("material: " + this.material.type);
    console.log("normal: " + this.normal[0] + ", " + this.normal[1]);
    console.log("point: " + this.point[0] + ", " + this.point[1]);
}


////////////////////////////////////////////////////////
/////////////////////   RAY   //////////////////////////
////////////////////////////////////////////////////////

function Ray(p0, dir, generation, t_min, t_max) {
    // primary ray: generation = 0
    if (!generation) generation = 0;
    if (!t_min) t_min = 0.0001;
    if (!t_max) t_max = 10000.0;
    this.p0 = vec2.clone(p0);
    this.dir = vec2.clone(dir);
    vec2.normalize(this.dir, this.dir);
    this.generation = generation;
    this.t_min = t_min;
    this.t_max = t_max;
}

Ray.prototype.clone = function (ray) {
    this.p0 = vec2.clone(ray.p0);
    this.dir = vec2.clone(ray.dir);
    this.generation = ray.generation;
    this.t_min = ray.t_min;
    this.t_max = ray.t_max;
}

Ray.prototype.eval = function (t) {
    return vec2.fromValues(this.p0[0] + t * this.dir[0], this.p0[1] + t * this.dir[1]);
}

Ray.prototype.reflect = function (intersection) {

    // TODO 11.1c)   Implement the reflection function for perfect diffuse and perfect reflecting material.
    //              Make use of the attributes of the intersection (see definition above).

    switch (intersection.material.type) {
        case 1: // perfect mirror
            {
                // TODO: Reflect the ray perfectly!
                // ...


                var a = vec2.create();
                vec2.scale(a, intersection.normal, 2 * vec2.dot(this.dir, intersection.normal));

                var dir = vec2.create();
                vec2.sub(dir, this.dir, a);

                return new Ray(intersection.point, dir , this.generation + 1);
            }
            break;
        case 2: // perfect diffuse
            {
                // TODO: Reflect the ray to a random direction in the hemisphere around the intersection normal!
                // Hint: - Use Math.random() to generate a random number.
                //       - To sample a direction in the hemisphere around the normal,
                //         you can rotate the normal with a random angle between [-PI/2, +PI/2].
                //         To do so you can use mat2.fromRotation(...) and vec2.transformMat2(...)!
                // // ...
                var a = (Math.random()-0.5)*Math.PI;
                var dir = vec2.create();
                var out = mat3.create();

                mat2.fromRotation(out,a);
                vec2.transformMat2(dir,intersection.normal,out);
                return new Ray(intersection.point, dir, this.generation + 1);
            }
            break;
    };


    return null;
}

Ray.prototype.draw = function (context) {
    if (this.generation == -1) {
        context.strokeStyle = 'rgb(240, 240, 0)';
        context.setLineDash([2, 2]);
    }
    else {
        var v = 200;
        context.strokeStyle = 'rgb(' + v + ',' + v + ',' + v + ')';
        context.setLineDash([4, 2]);
    }

    var p0 = this.eval(this.t_min);
    var p1 = this.eval(this.t_max);
    context.beginPath();
    context.moveTo(p0[0], p0[1]);
    context.lineTo(p1[0], p1[1]);
    context.stroke();
}


////////////////////////////////////////////////////////
/////////////   Line - 2D Primitive   //////////////////
////////////////////////////////////////////////////////

function Line(p0, p1, material) {
    this.p0 = vec2.clone(p0);
    this.p1 = vec2.clone(p1);
    this.material = material;
}

Line.prototype.draw = function (context) {
    context.setLineDash([1, 0]);
    context.strokeStyle = 'rgb(' + Math.floor(255 * this.material.color[0]) + ',' + Math.floor(255 * this.material.color[1]) + ',' + Math.floor(255 * this.material.color[2]) + ')';
    context.beginPath();
    context.moveTo(this.p0[0], this.p0[1]);
    context.lineTo(this.p1[0], this.p1[1]);
    context.stroke();
}

Line.prototype.direction = function () {
    var lineDir = vec2.create();
    vec2.sub(lineDir, this.p1, this.p0);
    return lineDir;
};

Line.prototype.normal = function () {
    var lineDir = this.direction();
    vec2.normalize(lineDir, lineDir);
    return [-lineDir[1], lineDir[0]];
};

Line.prototype.intersect = function (ray) {
    var result = null;

    var lineDir = this.direction();
    if (!isVec2Parallel(lineDir, ray.dir)) {

        // TODO 11.1b)   Intersect the ray with the line.
        //              If there is an intersection, return an Intersection "object",
        //              e.g. result = new Intersection(t_intersect, this.material, this.normal(), intersectionPoint);!
        //              Only handle the case where you have a single intersection or no intersection (ray is not parallel to line).
        var c1 = lineDir[0]*this.p0[1]-lineDir[1]*this.p0[0];
        var c2 = ray.dir[0]*ray.p0[1]-ray.dir[1]*ray.p0[0];


        // console.log(this.p0);
        var p = vec3.create();
        vec3.cross(p,vec3.fromValues(-lineDir[1],lineDir[0],c1),vec3.fromValues(-ray.dir[1],ray.dir[0],c2));
        var constrain1 = -p[0]/p[2];
        var constrain2 = -p[1]/p[2];
        var t = Math.sqrt((constrain1-ray.p0[0])*(constrain1-ray.p0[0])+(constrain2-ray.p0[1])*(constrain2-ray.p0[1]));
        // console.log(t);
        // if(constrain1<601&&constrain1>-1&&constrain2<301&&constrain2>-1){
        if(t<=ray.t_max&&t>=ray.t_min) {
            if (299 <= constrain1 && constrain1 <= 391 && 9 <= constrain2 && constrain2 <= 101) {
                result = new Intersection(t, this.material, this.normal(), [-p[0] / p[2], -p[1] / p[2]]);
            } else if (99 <= constrain1 && constrain1 <= 191 && 9 <= constrain2 && constrain2 <= 101) {
                result = new Intersection(t, this.material, this.normal(), [-p[0] / p[2], -p[1] / p[2]]);
            } else if (599 <= constrain1 && constrain1 <= 601) {
                result = new Intersection(t, this.material, this.normal(), [-p[0] / p[2], -p[1] / p[2]]);

            } else if (301 > constrain2 && constrain2 > 299) {
                result = new Intersection(t, this.material, this.normal(), [-p[0] / p[2], -p[1] / p[2]]);

            } else if (1 > constrain2 ) {
                result = new Intersection(4*t, this.material, this.normal(), [-p[0] / p[2], -p[1] / p[2]]);

            } else if (1 > constrain1) {
                result = new Intersection(4*t, this.material, this.normal(), [-p[0] / p[2], -p[1] / p[2]]);

            }
        }


        }



        // result = new Intersection(t, this.material, this.normal(), [-p[0]/p[2],-p[1]/p[2]]);




    return result;
};


////////////////////////////////////////////////////////
/////////////   Circle - 2D Primitive   ////////////////
////////////////////////////////////////////////////////

function Circle(mid, radius, material) {
    this.mid = vec2.clone(mid);
    this.radius = radius;
    this.material = material;
}

Circle.prototype.draw = function (context) {
    context.setLineDash([1, 0]);
    context.strokeStyle = 'rgb(' + Math.floor(255 * this.material.color[0]) + ',' + Math.floor(255 * this.material.color[1]) + ',' + Math.floor(255 * this.material.color[2]) + ')';
    context.fillStyle = 'rgb(' + Math.floor(255 * this.material.color[0]) + ',' + Math.floor(255 * this.material.color[1]) + ',' + Math.floor(255 * this.material.color[2]) + ')';
    context.beginPath();
    context.arc(this.mid[0], this.mid[1], this.radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();
}

Circle.prototype.intersect = function (ray) {
    var result = null;

    if (ray.generation == -1) return null;

    var b_vec = vec2.create();
    vec2.sub(b_vec, ray.p0, this.mid);

    var a = vec2.dot(ray.dir, ray.dir);
    var b = 2.0 * vec2.dot(ray.dir, b_vec);
    var c = vec2.dot(b_vec, b_vec) - this.radius * this.radius;

    var t;
    if (a == 0.0) {
        t = -c / b;
    } else {
        var d = b * b / (4 * a * a) - c / a;
        if (d > 0.0) t = -b / (2.0 * a) - Math.sqrt(d);
    }

    if (t) {
        if (t > 0) {
            var p = [ray.p0[0] + t * ray.dir[0], ray.p0[1] + t * ray.dir[1]];
            var normal = vec2.create();
            vec2.sub(normal, p, this.mid);
            vec2.normalize(normal, normal);
            result = new Intersection(t, this.material, normal, p);
        }
    }

    return result;
};


////////////////////////////////////////////////////////
//////////////////   2D Object   ///////////////////////
////////////////////////////////////////////////////////

function Object(primitives) {
    this.primitives = primitives;
}

Object.prototype.intersect = function (ray) {

    var result = null;

    for (var i = 0; i < this.primitives.length; ++i) {
        var intersection = this.primitives[i].intersect(ray);
        if (intersection) {
            if (!result) result = intersection;
            else if (result.t_ray > intersection.t_ray) result = intersection;
        }
    }

    return result;
};

Object.prototype.draw = function (context) {
    for (var i = 0; i < this.primitives.length; ++i) {
        this.primitives[i].draw(context);
    }
}


////////////////////////////////////////////////////////
/////////////////   Light Source   /////////////////////
////////////////////////////////////////////////////////

function LightSource(primitives, type, args) {
    this.primitives = primitives;
    this.type = type; // 0 : point light source
    this.args = args;
}

LightSource.prototype.intersect = function (ray) {

    var result = null;

    for (var i = 0; i < this.primitives.length; ++i) {
        var intersection = this.primitives[i].intersect(ray);
        if (intersection) {
            if (!result) result = intersection;
            else if (result.t_ray > intersection.t_ray) result = intersection;
        }
    }

    return result;
};

LightSource.prototype.draw = function (context) {
    for (var i = 0; i < this.primitives.length; ++i) {
        this.primitives[i].draw(context);
    }
}

LightSource.prototype.sample = function () {
    switch (this.type) {
        case 0: return vec2.fromValues(this.args[0], this.args[1]); // point light source
        default: return vec2.fromValues(this.args[0], this.args[1]);
    }
}


////////////////////////////////////////////////////////
///////////////////   2D Scene   ///////////////////////
////////////////////////////////////////////////////////

function Scene(objects, lightSources) {
    this.objects = objects;
    this.lightSources = lightSources;
}

Scene.prototype.addObject = function (object) {
    this.objects.push(object);
};

Scene.prototype.addLightSource = function (lightSource) {
    this.lightSources.push(lightSource);
};

Scene.prototype.intersect = function (ray) {

    var result = null;

    // intersect objects
    for (var i = 0; i < this.objects.length; ++i) {
        var intersection = this.objects[i].intersect(ray);
        if (intersection) {
            if (!result) result = intersection;
            else if (result.t_ray > intersection.t_ray) result = intersection;
        }
    }

    // intersect light sources
    for (var i = 0; i < this.lightSources.length; ++i) {
        var intersection = this.lightSources[i].intersect(ray);
        if (intersection) {
            if (!result) result = intersection;
            else if (result.t_ray > intersection.t_ray) result = intersection;
        }
    }

    return result;
};

Scene.prototype.draw = function (context) {
    // draw objects
    for (var i = 0; i < this.objects.length; ++i) {
        this.objects[i].draw(context);
    }
    // draw lightSources
    for (var i = 0; i < this.lightSources.length; ++i) {
        this.lightSources[i].draw(context);
    }
}

var Basic1 = function () {
    var canvas;
    var context;
    var scene;

    // ray tracing parameters
    var maxIter = 1; // recursion depth
    var nPixels = 4; // number of pixels
    var showRays = true;

    document.getElementById("nDepth").value = "1";
    document.getElementById("nPixels").value = "4";

    // init 2d scene
    function initScene() {
        var material0 = new Material([0.8, 0.8, 0.8], 1, []);
        var box0 = new Object([new Line([300.0, 10.0], [300.0, 100.0], material0),
                               new Line([300.0, 100.0], [390.0, 100.0], material0),
                               new Line([390.0, 100.0], [390.0, 10.0], material0),
                               new Line([390.0, 10.0], [300.0, 10.0], material0)]);

        var material1 = new Material([1.0, 0.0, 0.0], 2, []);
        var box1 = new Object([new Line([100.0, 10.0], [100.0, 100.0], material1),
                               new Line([100.0, 100.0], [190.0, 100.0], material1),
                               new Line([190.0, 100.0], [190.0, 10.0], material1),
                               new Line([190.0, 10.0], [100.0, 10.0], material1)]);

        var material2 = new Material([0.1, 0.1, 0.1], 2, []);
        var box2 = new Object([new Line([0.0, 300.0], [0.0, 0.0], material2),
                               new Line([600.0, 300.0], [0.0, 300.0], material2),
                               new Line([600.0, 0.0], [600.0, 300.0], material2),
                               new Line([0.0, 0.0], [600.0, 0.0], material2)]);


        var materialSun = new Material([10.0, 10.0, 0.0], 0, []);
        var sun = new LightSource([new Circle([500.0, 200.0], 5.0, materialSun)], 0, [500.0, 200.0]);

        scene = new Scene([box0, box1, box2], [sun]);
    }

    // recursive ray tracing
    function traceRay(context, ray, iter, maxIter, weightRay) {
        if (iter >= maxIter) return; // max recursion depth
        if (weightRay < 0.01) return; // result does not conrtibute much to the final color -> break to save performance


        // intersect ray with geometry
        var intersection = scene.intersect(ray);
        if (intersection) {
            //intersection.log();
            ray.t_max = intersection.t_ray;

            // draw ray
            if (showRays)
                ray.draw(context);

            if (intersection.material.type == 0) { // light source
                return intersection.material.color;
            }

            // compute indirect light
            var L_indirect = [0.0, 0.0, 0.0];
            var nSamples = 2; // number of brdf samples
            if (intersection.material.type == 1) nSamples = 1; // perfect mirror
            for (var s = 0; s < nSamples; ++s) {
                var secondary_ray = ray.reflect(intersection);
                if (secondary_ray) {
                    var weight = vec2.dot(intersection.normal, secondary_ray.dir);

                    // recursive call
                    var L_indirect_sample = traceRay(context, secondary_ray, iter + 1, maxIter, weightRay * weight);
                    if (L_indirect_sample) vec3.scaleAndAdd(L_indirect, L_indirect, L_indirect_sample, weight);
                }
            }
            L_indirect = [L_indirect[0] / nSamples, L_indirect[1] / nSamples, L_indirect[2] / nSamples];

            // compute direct light
            var L_direct = [0.0, 0.0, 0.0];
            if (intersection.material.type != 1) { // not a perfect mirror
                for (var i = 0; i < scene.lightSources.length; ++i) {
                    var nSamplesLight = 1;
                    var src = scene.lightSources[i];
                    for (var s = 0; s < nSamplesLight; ++s) {
                        // sample point light source
                        var sample = src.sample();

                        var dir = vec2.create();
                        vec2.sub(dir, sample, intersection.point);
                        var dist = vec2.length(dir);
                        if (vec2.dot(dir, intersection.normal) > 0.0) {
                            var light_ray = new Ray(intersection.point, dir, -1, 0.001, dist - 0.001);
                            if (!scene.intersect(light_ray)) {
                                var weight = vec2.dot(intersection.normal, light_ray.dir);
                                vec3.scaleAndAdd(L_direct, L_direct, src.primitives[0].material.color, weight);
                                // draw rays to light source
                                light_ray.t_max = dist;
                                if (showRays)
                                    light_ray.draw(context);
                            }
                        }
                    }
                }
            }

            var L = vec3.create();
            vec3.add(L, L_direct, L_indirect);

            var result = [intersection.material.color[0] * L[0],
                          intersection.material.color[1] * L[1],
                          intersection.material.color[2] * L[2]]

            // draw intersection point with light information
            {
                setFillStyle(context, result);
                context.beginPath();
                context.arc(intersection.point[0], intersection.point[1], 4 * weightRay, 0, 2 * Math.PI);
                context.fill();
            }

            return result;
        } else {
            if (showRays)
                ray.draw(context);
            return null;
        }
    }

    // renderer
    function Render() {
        context.clearRect(0, 0, 600, 300);
        context.font = "bold 12px Georgia";

        // draw scene
        scene.draw(context);

        // draw text
        context.fillStyle = 'rgb(0,0,0)';
        context.fillText("diffuse", 125, 60);
        context.fillText("mirror", 325, 60);
        context.fillText("sensor", 2, 190);
        context.fillText("point light", 510, 210);

        // camera parameters
        var nearPlane = 20; // in world space units
        var sensorHeight = 50.0; // in world space units
        var eye = vec2.fromValues(0.0, 150.0); // camera origin
        var viewDir = vec2.fromValues(1.0, 0.0); // has to be normalized
        var pixelSize = sensorHeight / nPixels;
        var sensorSpan = vec2.fromValues(-viewDir[1], viewDir[0]);
        var backgroundColor = [0.0, 0.0, 0.0];
        var pixelColors = [];

        // iterate over all pixels of the virtual sensor
        for (var pixelIdx = 0; pixelIdx < nPixels; ++pixelIdx) {
            // compute pixel position in world space
            var y = pixelSize * (pixelIdx - nPixels / 2.0 + 0.5);
            var pixelPos = vec2.fromValues(eye[0] + nearPlane * viewDir[0] + sensorSpan[0] * y,
                                            eye[1] + nearPlane * viewDir[1] + sensorSpan[1] * y);


            var ray;
            // TODO 11.1a)   Set up primary ray based on the camera origin (eye) and the current pixel position (pixelPos).
            //              ray = new Ray(p0, dir);
                var dir = vec2.fromValues(pixelPos[0]-eye[0],pixelPos[1]-eye[1]);
                ray = new Ray(eye,dir);


            var pixelColor;
            // TODO 11.1a)   Start ray tracing.
            //              Use the global variable maxIter and a initial weight of 1.0.
            //              pixelColor = traceRay(context, ...);
            pixelColor = traceRay(context,ray,0,maxIter,1.0);



            if (pixelColor) pixelColors.push(pixelColor);
            else pixelColors.push(backgroundColor);
        }

        // draw pixels
        for (var pixelIdx = 0; pixelIdx < nPixels; ++pixelIdx) {
            // compute pixel position in world space
            var y = pixelSize * (pixelIdx - nPixels / 2.0);
            var pixelPos = vec2.fromValues(eye[0] + nearPlane * viewDir[0] + sensorSpan[0] * y,
                                            eye[1] + nearPlane * viewDir[1] + sensorSpan[1] * y);
            // draw pixel
            context.setLineDash([1, 0]);
            setFillStyle(context, pixelColors[pixelIdx]);
            context.beginPath();
            context.rect(pixelPos[0], pixelPos[1], 3, pixelSize);
            context.fill();
        }
    }

    return {
        start: function (_canvas) {
            canvas = _canvas;
            context = _canvas.getContext("2d");
            initScene();
            scene.draw(context);

            Render();

        },
        onChangeNPixels: function (value) {
            nPixels = value;
            Render();
        },
        onChangeRecursionDepth: function (value) {
            maxIter = value;
            Render();
        },
        onChangeShowRays: function () {
            showRays = !showRays;
            Render();
        }
    }
}()
