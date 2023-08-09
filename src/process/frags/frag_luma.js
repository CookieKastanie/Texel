export default [
    {
        name: 'luma',
        frag: `
		float luma(vec3 color) {
			return dot(color, vec3(0.2126, 0.7152, 0.0722));
		}

        float luma(vec4 color) {
            return luma(color.rgb);
        }`
    }
]
