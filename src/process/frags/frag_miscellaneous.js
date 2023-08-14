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
	}
]
