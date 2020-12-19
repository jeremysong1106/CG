////////////////////////////////////////////////////////////////////////
// GL: 	 The attributes are the "interface" with your application
// 		The data that is stored in a buffer contains multiple vertices.
// 		Each shader instance has acces to the data of one vertex
//
// 		Imagine a parallel for loop where each vertex is identified	
//		with a "gl_VertexID"
// 		and the	 positions are assigned as follows:
// 		CONST vec2& vVertex = vertices[gl_VertexID].position		
////////////////////////////////////////////////////////////////////////
attribute vec2 vVertex;

varying vec3 color;
void main(void)
{
    gl_Position = vec4(vVertex, 0.0, 1.0);
    gl_PointSize = 10.0;
//	
//	if(gl_VertexID == 0)
//		color = vec3(1,0,0);
//	else if(gl_VertexID == 1)
//		color = vec3(0,1,0);
//	else if(gl_VertexID == 2) 
//		color = vec3(0,1,0);

}