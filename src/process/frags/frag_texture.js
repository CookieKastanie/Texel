export default [
    {
        name: 'texture',
        frag: `
        vec4 texture(TextureInfos tex, vec2 uv) {
            return texture(tex.sampler, uv);
        }`
    }
]
