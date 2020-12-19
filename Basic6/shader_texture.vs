precision mediump float;

attribute vec3 vVertex;
attribute vec3 vNormal;
attribute vec2 vTexCoord;

uniform mat4 modelMatrix; // model matrix
uniform mat4 cameraMatrix; // camera matrix
uniform mat4 projectionMatrix; // projection matrix

uniform mat4 normalMatrix;

varying vec3 normal;
varying vec3 position;

// TODO 6.3a):	Define a varying variable
//				representing the texture
//				coordinates.
varying vec2 texcoord;


void main(void)
{

	mat4 MVP = projectionMatrix * cameraMatrix * modelMatrix;
	gl_Position = MVP * vec4(vVertex, 1);

	normal = normalize((normalMatrix * vec4(normalize(vNormal), 0)).xyz);
	vec4 pos = modelMatrix * vec4(vVertex, 1);
	position = pos.xyz / pos.w;
	
	
	// TODO 6.3a):	Pass the texture coordinate
	//				attribute to the corresponding 
	//				varying variable.
    texcoord=vTexCoord;
		
	
}
