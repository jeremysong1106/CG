precision mediump float;
uniform vec2 canvasSize;
float d;
// TODO 3.3)	Define a constant variable (uniform) to
//              "send" the canvas size to all fragments.

void main(void)
{

	 float smoothMargin = 0.01;
	 float r = 0.8;


	 // TODO 3.3)	Map the fragment's coordinate (gl_FragCoord.xy) into
	 //				the range of [-1,1]. Discard all fragments outside the circle
	 //				with the radius r. Smooth the circle's edge within
	 //				[r-smoothMargin, r] by computing an appropriate alpha value.
	 //				Change the following line!
    vec2 uv=vec2(gl_FragCoord.xy / canvasSize + gl_FragCoord.xy / canvasSize - vec2(1.0,1.0));
    //  vec2 uv= -1 + 2.0*gl_FragCoord.xy/canvasSize.xy;
    d=sqrt((uv[0]*uv[0])+(uv[1]*uv[1]));
    if(d>r){
             discard;
    }


         if(d<= r && d >= (r - smoothMargin)){
            gl_FragColor.a=r-clamp(d,r-smoothMargin,r);
            gl_FragColor.a= gl_FragColor.a/smoothMargin;
            gl_FragColor = vec4(1.0, 85.0 / 255.0, 0.0,  gl_FragColor.a);
         }else{
            gl_FragColor = vec4(1.0, 85.0 / 255.0, 0.0, 1.0);
         }






}
