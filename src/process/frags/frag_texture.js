export default [
    {
        name: 'texture',
        frag: `
        vec4 texture(TextureInfos tex, vec2 uv) {
            return texture(tex.sampler, uv);
        }
        
        vec4 texture(TextureInfos tex, vec2 uv, float bias) {
            return texture(tex.sampler, uv, bias);
        }`
    },
    {
        name: 'textureLod',
        frag: `
        vec4 textureLod(TextureInfos tex, vec2 uv, float bias) {
            return textureLod(tex.sampler, uv, bias);
        }`
    }
]
