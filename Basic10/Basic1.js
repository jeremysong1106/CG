var showAABB = true;
var useTree = false;
var seed = -17;

////////////////////////////////////////////////////////
/////////////////////   HELPER   ///////////////////////
////////////////////////////////////////////////////////

function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function sort_along_x(objects) {
    var objs = new Array(objects.length);
    for (var i = 0; i < objects.length; i++) {
        objs[i] = objects[i];
    }
    objs.sort(function (a, b) { return (a.aabb[0][0] + a.aabb[1][0]) / 2 - (b.aabb[0][0] + b.aabb[1][0]) / 2; });
    return objs;
}

function sort_along_y(objects) {
    var objs = new Array(objects.length);
    for (var i = 0; i < objects.length; i++) {
        objs[i] = objects[i];
    }
    objs.sort(function (a, b) { return (a.aabb[0][1] + a.aabb[1][1]) / 2 - (b.aabb[0][1] + b.aabb[1][1]) / 2; });
    return objs;
}

function overlaps(first, second) {
    var f_min_x = 1000;
    var f_min_y = 1000;
    var f_max_x = 0;
    var f_max_y = 0;
    var s_min_x = 1000;
    var s_min_y = 1000;
    var s_max_x = 0;
    var s_max_y = 0;
    for (var i = 0; i < first.primitives.length; i++) {
        var point = first.primitives[i].p0;
        if (point[0] < f_min_x) f_min_x = point[0];
        if (point[1] < f_min_y) f_min_y = point[1];
        if (point[0] > f_max_x) f_max_x = point[0];
        if (point[1] > f_max_y) f_max_y = point[1];
    }
    for (var i = 0; i < second.primitives.length; i++) {
        var point = second.primitives[i].p0;
        if (point[0] < s_min_x) s_min_x = point[0];
        if (point[1] < s_min_y) s_min_y = point[1];
        if (point[0] > s_max_x) s_max_x = point[0];
        if (point[1] > s_max_y) s_max_y = point[1];
    }
    if (f_min_x > s_max_x) return false; // min x
    if (f_max_x < s_min_x) return false; // max x
    if (f_min_y > s_max_y) return false; // min y
    if (f_max_y < s_min_y) return false; // max y
    return true;
}

////////////////////////////////////////////////////////
/////////////   Line - 2D Primitive   //////////////////
////////////////////////////////////////////////////////

function Line(p0, p1, color) {
    this.p0 = vec2.clone(p0);
    this.p1 = vec2.clone(p1);
    this.color = color;
}

Line.prototype.draw = function (context) {
    context.setLineDash([1, 0]);
    context.strokeStyle = 'rgb(' + Math.floor(255 * this.color[0]) + ',' + Math.floor(255 * this.color[1]) + ',' + Math.floor(255 * this.color[2]) + ')';
    context.beginPath();
    context.moveTo(this.p0[0], this.p0[1]);
    context.lineTo(this.p1[0], this.p1[1]);
    context.stroke();
}

////////////////////////////////////////////////////////
//////////////////   2D Object   ///////////////////////
////////////////////////////////////////////////////////

function Object(primitives) {
    this.primitives = primitives;

// console.log(primitives);
    // TODO 10.1 a)     Compute the axis-aligned bounding box
    //                  for the object. The box should be defined by 
    //                  its bottom left (smallest x- and y-value) and
    //                  its top right corner (highest x- and y-value).

    // 1. Compute the axis-aligned bounding box!
    //    Replace the following dummy line.
    var x0 = 500;
    var y0 = 500;
    var x1 = 0;
    var y1 = 0;
    for (var i = 0; i < primitives.length; i++) {
        if (primitives[i].p0[0] < x0)
            x0 = primitives[i].p0[0];
        if (primitives[i].p0[1] < y0)
            y0 = primitives[i].p0[1];
        if (primitives[i].p0[0] > x1)
            x1 = primitives[i].p0[0];
        if (primitives[i].p0[1] > y1)
            y1 = primitives[i].p0[1];
    }
    this.aabb = [[x0,y0],[x1,y1]]; // should be in this format: [[x, y], [x, y]] - [bottom left corner, top right corner]


    // 2. Compute the primitives to graphically represent the
    //    bounding box as "Line"s. Use the given color.
    var color = [0.1, 0.1, 0.1];
    var line0 = new Line([x0,y0],[x1,y0],color);
    var line1 = new Line([x1,y0],[x1,y1],color);
    var line2 = new Line([x1,y1],[x0,y1],color);
    var line3 = new Line([x0,y1],[x0,y0],color);

    this.aabb_primitives = [line0,line1,line2,line3];



}

Object.prototype.draw = function (context) {
    for (var i = 0; i < this.primitives.length; ++i) {
        this.primitives[i].draw(context);
    }
    if (showAABB) {
        for (var i = 0; i < this.aabb_primitives.length; i++) {
            this.aabb_primitives[i].draw(context);
        }
    }
}


////////////////////////////////////////////////////////
//////////////   Kd tree and its nodes   ///////////////
////////////////////////////////////////////////////////

function Node(isInner, objects, min, max, splitAxis, splitPosition, children) {
    this.isInner = isInner;                 // Is it an inner node (storing min, max, splitAxis, splitPosition and children)
    //      or a leaf (storing min, max, splitAxis and objects)?
    this.min = min;                         // bottom left corner of node
    this.max = max;                         // top right corner of node
    this.splitAxis = splitAxis;             // Should this node be splitted along the x axis ('x')
    //      or along the y axis ('y') if need be?
    if (this.isInner) {
        this.splitPosition = splitPosition; // position of the split along the axis defined by splitAxis
        this.children = children;           // two-element array holding the left and right / top and bottom children
    } else {
        this.objects = objects;             // array holding the objects of this leaf node
    }
}

Node.prototype.draw = function (context) {
    if (this.isInner) {
        var line;
        if (this.splitAxis == 'x') {
            var color = [0, 0, 1]; // vertical splitting lines: blue
            line = new Line([this.splitPosition, this.min[1]], [this.splitPosition, this.max[1]], color);
        } else {
            var color = [1, 0, 0]; // horizontal splitting lines: red
            line = new Line([this.min[0], this.splitPosition], [this.max[0], this.splitPosition], color);
        }
        line.draw(context);
        this.children[0].draw(context);
        this.children[1].draw(context);
    } else {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw(context);
        }
    }
}

function KDTree(objects) {
    this.objects = objects;

    // This creates the root node as a single leaf node containing the whole canvas size
    // and all objects. The first axis to split along is the x axis.
    this.root = new Node(false, this.objects, [0, 0], [600, 300], 'x');

    // The root node is put onto the stack for further examination.
    // In the following, the stack contains all leaf nodes which might
    // be split into inner nodes afterwards.
    var stack = [];
    stack.push(this.root);

    // As long as the stack is not empty, this loop pops nodes 
    // from the stack.
    while (stack.length != 0) {
        var node = stack.pop();


        // TODO 10.1 b)     Build the kd-tree structure by
        //                  splitting nodes which contain 
        //                  too many triangles.

        if (node.objects.length > 3) { // The node needs to be split.

            // This node should be an inner node from now on.
            node.isInner = true;

            // 1. Compute the split position (x value for split along x axis,
            //    y value for split along y axis). 
            //    You can use the functions sort_along_x() and sort_along_y() 
            //    in order to get a sorted copy of the objects in the node.
            //    Use the objects' bounding boxes to choose the right split 
            //    position!
            // var split = Math.floor(objs.length / 2);

            if (node.splitAxis == 'x') {
                // ...
                var objs = sort_along_x(node.objects);
                // console.log(objs);
                var split = Math.floor(objs.length / 2);
                var splitx = objs[split - 1].aabb[1][0] + (objs[split].aabb[0][0] - objs[split - 1].aabb[1][0]) / 2;
                }
                    else {
                // ...
                var objs = sort_along_y(node.objects);
                // console.log(objs);
                var split = Math.floor(objs.length / 2);
                var splity = objs[split - 1].aabb[1][1] + (objs[split].aabb[0][1] - objs[split - 1].aabb[1][1]) / 2;
            }
            // 2. Iterate over the objects in the node and assign them to
            //    one of the two or even both arrays (via .push()), depending on their
            //    relative position to the split position.
            //    Use the objects' bounding boxes to decide!
            //    Afterwards, the node should not contain any objects,
            //    so we set its objects to null.
            var objectsLeft = [];
            var objectsRight = [];
            var left;
            var right;
            for (var i = 0; i < node.objects.length; i++) {
                var obj = node.objects[i];
                if (node.splitAxis == 'x') {
                    // ...
                    left = obj.aabb[0][0];
                    right = obj.aabb[1][0];
                    if (left < splitx)
                        objectsLeft.push(obj);
                    if (right > splitx)
                        objectsRight.push(obj);
                } else {
                    // ...
                    left = obj.aabb[0][1];
                    right = obj.aabb[1][1];
                    if (left < splity)
                        objectsLeft.push(obj);
                    if (right > splity)
                        objectsRight.push(obj);
                }
            }
            node.objects = null;

            // 3. Create two new leafs with the appropriate objects, min, max and splitAxis.
            //    Afterwards, assign them as the current node's children and push them on
            //    the stack for further splitting.
            var leftChild;
            var rightChild;
            if (node.splitAxis == 'x') {
                // ...
                console.log(node);
                leftChild = new Node(false,objectsLeft,node.min,[splitx,node.max[1]],'y');
                rightChild = new Node(false, objectsRight, [splitx, node.min[1]], node.max, 'y');
                node.splitPosition = splitx;

            } else {
                // ...
                // ...
                leftChild = new Node(false, objectsLeft, node.min, [node.max[0], splity], 'x',splity);
                rightChild = new Node(false, objectsRight, [node.min[0], splity], node.max, 'x',splity);
                node.splitPosition = splity;
            }
            // ...
            node.children = new Array(2);
            node.children[0] = leftChild;
            node.children[1] = rightChild;
            stack.push(leftChild);
            stack.push(rightChild);

        }
    }

}

KDTree.prototype.draw = function (context) {
    this.root.draw(context);
}

////////////////////////////////////////////////////////
///////////////////   2D Scene   ///////////////////////
////////////////////////////////////////////////////////

function Scene(objects) {
    this.objects = objects;
    this.kdTree = new KDTree(objects);
}

Scene.prototype.draw = function (context) {
    if (!useTree) { // simply draw the objects
        for (var i = 0; i < this.objects.length; ++i) {
            this.objects[i].draw(context);
        }
    } else { // draw the kdTree and the contained objects
        this.kdTree.draw(context);
    }
}

var Basic1 = function () {
    var canvas;
    var context;
    var scene;

    // ray tracing parameters
    var maxIter = 1; // recursion depth
    var nPixels = 4; // number of pixels

    var nPolygons = 10;

    // init 2d scene
    function initScene() {
        var objects = new Array();
        var border = 50.0;

        var number = 0;
        while (number < nPolygons) {
            var color = [random(), random(), random()];
            var numPoints = Math.floor(random() * 7) + 3;
            var points = new Array(numPoints);
            var middle = [border + random() * (600.0 - 2 * border), border + random() * (300.0 - 2 * border)];
            var deltaPhi = 2 * Math.PI / numPoints;
            for (var i = 0; i < numPoints; i++) {
                var radius = (random()) * border;
                points[i] = [middle[0] + radius * Math.cos(i * deltaPhi), middle[1] + radius * Math.sin(i * deltaPhi)];
            }
            var lines = new Array(numPoints);
            for (var i = 0; i < numPoints; i++) {
                lines[i] = new Line(points[i], points[(i + 1) % numPoints], color);
            }
            var polygon = new Object(lines);
            var overlapping = false;
            for (var i = 0; i < objects.length; i++) {
                if (overlaps(polygon, objects[i])) {
                    overlapping = true;
                    break;
                }
            }
            if (!overlapping) {
                objects.push(polygon);
                number++;
            }
        }
        scene = new Scene(objects);
    }

    return {
        start: function (_canvas) {
            var slider = document.getElementById('nPolygons');
            slider.value = 10;
            var checkbox1 = document.getElementById('box');
            checkbox1.checked = true;
            var checkbox2 = document.getElementById('tree');
            checkbox2.checked = false;

            canvas = _canvas;
            context = _canvas.getContext("2d");
            initScene();
            scene.draw(context);
        },
        onChangeNPolygons: function (value) {
            nPolygons = value;
            seed = -17;
            initScene();
            context.clearRect(0, 0, canvas.width, canvas.height);
            scene.draw(context);
        },
        onChangeShowAABB: function () {
            showAABB = !showAABB;
            context.clearRect(0, 0, canvas.width, canvas.height);
            scene.draw(context);
        },
        onChangeUseTree: function () {
            useTree = !useTree;
            context.clearRect(0, 0, canvas.width, canvas.height);
            scene.draw(context);
        }
    }
}()
