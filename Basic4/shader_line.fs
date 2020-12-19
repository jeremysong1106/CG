precision mediump float;

varying vec3 world_pos;

void main(void)
{
	gl_FragColor = vec4(clamp(world_pos, vec3(-1), vec3(1)) * 0.5 + 0.5, 1.0);
}