precision mediump float;
varying vec3 c;


// TODO 3.2a)	Define the varying variable again
//				using the same name to enable 
//				communication between vertex and
//				fragment shader.


void main(void)
{

	float epsilon = .01;

	
	// TODO 3.2a)	Give each pixel the interpolated
	//				triangle color. Change the following line.
	gl_FragColor = vec4(c, 1.0);


	// TODO 3.2b)	Use the color as barycentric coordinates
	//				and discard all pixels not considered 
	//				edges (farther away from an edge than 
	//				epsilon). Use the GLSL mechanism 'discard'.
       if(c[1]>epsilon&&c[0]>epsilon&&c[2]>epsilon){
         discard;
       }
        

	
	
}