precision mediump float;

attribute vec3 vVertex;
attribute vec3 vNormal;

uniform mat4 modelMatrix; // model matrix
uniform mat4 cameraMatrix; // camera matrix
uniform mat4 projectionMatrix; // projection matrix

uniform mat4 normalMatrix;

// TODO 5.2a)	Define a varying variable to
//				pass the normal to the fragment
//				shader.
varying vec3 normal;

// TODO 5.2a)	Define a varying variable to
//				pass the world position to the
//				fragment shader.

varying vec3 position;

void main(void)
{
	
	mat4 MVP = projectionMatrix * cameraMatrix * modelMatrix;
	gl_Position = MVP * vec4(vVertex, 1);

	// TODO 5.2a)	Assign the normal to the varying variable. 
	//				Before you do so, transform it from model
	//				space to world space. Use the appropriate
	//				matrix. Do not forget to normalize the normal
	//				afterwards.
    normal=normalize(vec3(normalMatrix*vec4(vNormal,1)));
	// TODO 5.2a)	Assign the position to the varying variable. 
	//				Before you do so, transform it from model
	//				space to world space. Use the appropriate
	//				matrix. Do not forget to dehomogenize it 
	//				afterwards.
    vec4 pos=modelMatrix*vec4(vVertex,1);
    position=vec3(pos)/pos.w;
	
	
}
