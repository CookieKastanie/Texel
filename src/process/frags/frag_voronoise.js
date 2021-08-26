export default [
    {
        name: 'voronoi',
        frag: `vec3 voronoi_hash3(vec2 p) {
            vec3 q = vec3( dot(p,vec2(127.1,311.7)),
                           dot(p,vec2(269.5,183.3)),
                           dot(p,vec2(419.2,371.9)) );
            return fract(sin(q)*43758.5453);
        }
        
        float voronoi(in vec2 p, float u, float v) {
            float k = 1.0+63.0*pow(1.0-v,6.0);
        
            vec2 i = floor(p);
            vec2 f = fract(p);
            
            vec2 a = vec2(0.0,0.0);
            for(int y=-2; y<=2; ++y)
            for(int x=-2; x<=2; ++x) {
                vec2  g = vec2(x, y);
                vec3  o = voronoi_hash3(i + g)*vec3(u,u,1.0);
                vec2  d = g - f + o.xy;
                float w = pow(1.0-smoothstep(0.0,1.414,length(d)), k);
                a += vec2(o.z*w,w);
            }
            
            return a.x/a.y;
        }`
    },
    {
        name: 'voronoiDist',
        frag: `vec2 voronoiDist_hash2(vec2 p) {
            return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
        }
        
        vec3 voronoiDist(in vec2 x, float offset) {
            vec2 n = floor(x);
            vec2 f = fract(x);
        
            vec2 mg, mr;
        
            float md = 8.0;
            for(int j=-1; j<=1; ++j)
            for(int i=-1; i<=1; ++i) {
                vec2 g = vec2(float(i),float(j));
                vec2 o = voronoiDist_hash2(n + g);
                o = 0.5 + 0.5*sin(offset + 6.2831*o);
                vec2 r = g + o - f;
                float d = dot(r,r);
        
                if(d<md) {
                    md = d;
                    mr = r;
                    mg = g;
                }
            }
        
            md = 8.0;
            for(int j=-2; j<=2; ++j)
            for(int i=-2; i<=2; ++i) {
                vec2 g = mg + vec2(float(i),float(j));
                vec2 o = voronoiDist_hash2(n + g);
                o = 0.5 + 0.5*sin(offset + 6.2831*o);
                vec2 r = g + o - f;
        
                if( dot(mr-r,mr-r)>0.00001 )
                md = min( md, dot( 0.5*(mr+r), normalize(r-mr) ) );
            }
        
            return vec3( md, mr );
        }`
    }
]
