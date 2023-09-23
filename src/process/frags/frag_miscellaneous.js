export default [
    {
        name: 'saturate',
        frag: `
        float saturate(float x) { return clamp(x, 0., 1.); }
        vec2 saturate(vec2 x) { return clamp(x, 0., 1.); }
        vec3 saturate(vec3 x) { return clamp(x, 0., 1.); }
        vec4 saturate(vec4 x) { return clamp(x, 0., 1.); }`
    },
	{
		name: 'map',
		frag: `
        float map(float value, float inMin, float inMax, float outMin, float outMax) {
            return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
        }

        vec2 map(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {
            return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
        }

        vec3 map(vec3 value, vec3 inMin, vec3 inMax, vec3 outMin, vec3 outMax) {
            return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
        }

        vec4 map(vec4 value, vec4 inMin, vec4 inMax, vec4 outMin, vec4 outMax) {
            return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
        }`
	},
    {
        name: 'unpackNormalMap',
        frag: `
        vec3 unpackNormalMap(vec3 n) {
            return normalize(n * 2.0 - 1.0);
        }

        vec3 unpackNormalMap(vec4 n) {
            return normalize(n.rgb * 2.0 - 1.0);
        }

        vec3 unpackNormalMap(vec2 n) {
            vec2 n2 = n * 2.0 - 1.0;
            float z = sqrt(1.0 - clamp(dot(n2, n2), 0.0, 1.0));
            return normalize(vec3(n2, z));
        }`
    }
]
