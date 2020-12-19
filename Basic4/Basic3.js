var Basic3 = function () {
    var canvas;
    var alphas = [0.5, 0.5, 0.5, 0.5];

    function getImageInContainer(container) {
        var image = document.getElementById(container).children[0];
        var c = document.createElement('canvas');
        c.width = canvas.width;
        c.height = canvas.height;
        canvas.getContext('2d').clearRect(0, 0, c.width, c.height);
        canvas.getContext('2d').drawImage(image, 0, 0, c.width, c.height);
        var data = canvas.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        return data;
    }

    function doAlphaBlending(index, images, alphas) {

        // TODO 4.3:    Compute the blended color (as an array of 3 values
        //              in the interval [0, 255]) for one pixel
        //              of the resulting image. "images" is the array
        //              of circle images from left to right, "alphas"
        //              contains the respective alpha values. "index"
        //              is the linearized index for the images, so for
        //              example with images[2][index + 1] you can address
        //              the green color channel of the current pixel 
        //              in the third image.

        // 1. Set up a color as a return value, and initialize it with the 
        //    desired background color.

        var   color=[255,255,255];

        // 2. Loop over the four circle images in the correct order to blend
        //    them one after another.
        for(var i=0;i<4;i++) {


            // 3. Compute the resulting alpha value for the current pixel.
            //    If it is a background pixel of the current image (denoted
            //    with a zero alpha channel value), it should not contribute to the
            //    resulting image. Otherwise, it should contribute with the
            //    alpha value given through the sliders.
            var current_a = images[i][index + 3];
            if (current_a != 0) {

                // 4. Compute the resulting color using alpha blending in all
                //    three color channels.
                color[0] = images[i][index] * alphas[i] + (1 - alphas[i]) * color[0];
                color[1] = images[i][index + 1] * alphas[i] + (1 - alphas[i]) * color[1];
                color[2] = images[i][index + 2] * alphas[i] + (1 - alphas[i]) * color[2];
            }
        }
            // 5. Return the resulting color. Replace the following dummy line.
            return color;
    }

    function Render() {

        var context = canvas.getContext("2d");
        var img = context.createImageData(canvas.width, canvas.height);

        var images = [getImageInContainer("div0"),
        getImageInContainer("div1"),
        getImageInContainer("div2"),
        getImageInContainer("div3")];

        // walk over the canvas image and set the blended color for each pixel
        for (var x = 0; x < canvas.width; x++) {
            for (var y = 0; y < canvas.height; y++) {
                // compute the linearized index for the image data array
                var i = 4 * (x + canvas.width * y);
                // compute the blended color using the index, the four circle images and the alpha values
                var color = doAlphaBlending(i, images, alphas);
                // set the color accordingly, alpha value is always 255
                img.data[i] = color[0];
                img.data[i + 1] = color[1];
                img.data[i + 2] = color[2];
                img.data[i + 3] = 255;
            }
        }

        context.putImageData(img, 0, 0);
    }

    return {
        start: function (_canvas) {
            canvas = _canvas;

            var sliders = document.getElementsByName("alpha");
            for (var i = 0; i < sliders.length; i++) {
                sliders[i].value = 0.5;
            }

            Render();
        },

        onChangeAlpha: function (index, value) {
            alphas[index] = value;
            Render();
        },

        allowDrop: function (ev) {
            ev.preventDefault();
        },

        drag: function (ev) {
            ev.dataTransfer.setData("src", ev.target.id);
            start_id = ev.target.id;
        },

        drop: function (ev) {
            ev.preventDefault();
            var src = document.getElementById(ev.dataTransfer.getData("src"));
            var srcParent = src.parentNode;
            var tgt = ev.currentTarget.firstElementChild;

            var a;
            if (srcParent.id == "div0") {
                a = 0;
            } else if (srcParent.id == "div1") {
                a = 1;
            } else if (srcParent.id == "div2") {
                a = 2;
            } else {
                a = 3;
            }

            var b;
            if (tgt.parentNode.id == "div0") {
                b = 0;
            } else if (tgt.parentNode.id == "div1") {
                b = 1;
            } else if (tgt.parentNode.id == "div2") {
                b = 2;
            } else {
                b = 3;
            }

            var sliders = document.getElementsByName("alpha");
            var tmp = alphas[a];
            alphas[a] = alphas[b];
            sliders[a].value = sliders[b].value;
            alphas[b] = tmp;
            sliders[b].value = tmp;

            ev.currentTarget.replaceChild(src, tgt);
            srcParent.appendChild(tgt);

            Render();
        }
    }
}()
