attribute vec3 vVertex;

uniform mat4 modelMatrix;
uniform mat4 cameraMatrix;
uniform mat4 projectionMatrix;

varying vec3 world_pos;

void main(void)
{
	vec4 pos = projectionMatrix * cameraMatrix * modelMatrix * vec4(vVertex,1.0);

	world_pos = (modelMatrix * vec4(vVertex, 1.0)).xyz;

	gl_Position = pos;
}