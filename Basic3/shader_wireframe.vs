
attribute vec2 vVertex;
attribute vec3 col;
varying vec3 c;
// TODO 3.2a)	Create an attribute describing the
//				color of a vertex.


// TODO 3.2a)	Create an varying variable to 
//				pass the interpolated color to
//				the fragment shader.


void main(void)
{
	gl_Position = vec4(vVertex, 0.0, 1.0);
       
	
	// TODO 3.2a)	Assign the color of the vertex
	//				to the varying variable.

        c=col;
}