precision mediump float;

uniform mat4 cameraMatrixInverse;

uniform vec3 lightPosition;
uniform vec2 planeSize;

uniform bool cobblestone;

// TODO 6.3a):	Define the checkerboard 
//				texture as a "uniform sampler2D".
//				Find out which name it should 
//				have from Basic3.js!
uniform sampler2D checkerboardTexture;

// TODO 6.3b):	Define the cobblestone 
//				texture as a "uniform sampler2D".
//				Find out which name it should 
//				have from Basic3.js!
uniform sampler2D cobblestoneTexture;


varying vec3 normal;
varying vec3 position;

// TODO 6.3a):	Define a varying variable
//				representing the texture
//				coordinates.
varying vec2 texcoord;



void main(void) {
	
	float shiny = 10.0;
	
	
	vec3 n;
	vec3 color;
	if(cobblestone) {
		
		color = vec3(0.5, 0.5, 0.5);
		// TODO 6.3b):	Read the RGB value from the normal
		//				map provided in cobblestoneTexture.
		//				Map it from [0,1] to [-1,1] and set
		//				the normal accordingly. The plane
		//				should be covered with one single 
		//				instance of the normal map. Therefore,
		//				the texture coordinates have to be
		//				scaled accordingly. Replace the following
		//				dummy line.
		vec2 temp;
        temp.x = texcoord[0]/planeSize[0];
        temp.y = texcoord[1]/planeSize[1];
        n = normalize((texture2D(cobblestoneTexture,vec2(temp[0],temp[1])).rgb*2.0-1.0));
		
	} else {
		
		n = normal;
		// TODO 6.3a):	Read the RGB value from the texture
		//				using the function texture2D() and
		//				the texture coordinates. Replace the
		//				following dummy line.
        color = (texture2D(checkerboardTexture,texcoord)).rgb;

	}
	
	vec3 k_amb = 0.1 * color;
	vec3 k_diff = 0.5 * color;
	vec3 k_spec = 0.4 * vec3(1, 1, 1);

	vec3 color_ambient, color_diffuse, color_specular;


	////////////////////////////////
	////////  ambient term  ////////
	////////////////////////////////
	color_ambient = k_amb;

	////////////////////////////////
	////////  diffuse term  ////////
	////////////////////////////////
	n = normalize(n);
	vec3 l = normalize(lightPosition - position);
	color_diffuse = k_diff * max(0.0, dot(n, l));

	/////////////////////////////////
	////////  specular term  ////////
	/////////////////////////////////
	vec3 cameraPosition = (cameraMatrixInverse * vec4(0, 0, 0, 1)).xyz;
	vec3 v = normalize(cameraPosition - position);
	vec3 r = normalize(2.0 * dot(n, l) * n - l);
	color_specular = k_spec * pow(max(0.0, dot(v, r)), shiny);
	
	///////////////////////////////////
	////////  resulting color  ////////
	///////////////////////////////////
	vec3 color_result = vec3(0);
	color_result += color_ambient;
	color_result += color_diffuse;
	color_result += color_specular;
	gl_FragColor = vec4(color_result, 1.0);
}
