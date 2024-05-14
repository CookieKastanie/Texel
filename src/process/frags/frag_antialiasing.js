export default [
    {
        name: 'fxaa',
        frag: `
        vec4 fxaa(TextureInfos tex, vec2 uv) {
            const float FXAA_REDUCE_MIN = (1.0 / 128.0);
            const float FXAA_REDUCE_MUL = (1.0 / 8.0);
            const float FXAA_SPAN_MAX = 8.0;
            
            vec2 fragCoord = uv * currentBuffer.size;
            vec2 inverseVP = 1.0 / currentBuffer.size;
            
            vec2 v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;
            vec2 v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;
            vec2 v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;
            vec2 v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;
            vec2 v_rgbM = vec2(fragCoord * inverseVP);
            
            vec3 rgbNW = texture(tex.sampler, v_rgbNW).xyz;
            vec3 rgbNE = texture(tex.sampler, v_rgbNE).xyz;
            vec3 rgbSW = texture(tex.sampler, v_rgbSW).xyz;
            vec3 rgbSE = texture(tex.sampler, v_rgbSE).xyz;
            vec4 texColor = texture(tex.sampler, v_rgbM);
            vec3 rgbM = texColor.xyz;
            
            const vec3 luma = vec3(0.299, 0.587, 0.114);
            
            float lumaNW = dot(rgbNW, luma);
            float lumaNE = dot(rgbNE, luma);
            float lumaSW = dot(rgbSW, luma);
            float lumaSE = dot(rgbSE, luma);
            float lumaM  = dot(rgbM,  luma);
            float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));
            float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));
            
            vec2 dir;
            dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));
            dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));
            
            float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *
                                  (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);
            
            float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
            dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
                  max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),
                      dir * rcpDirMin)) * inverseVP;
            
            vec3 rgbA = 0.5 * (
                texture(tex.sampler, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +
                texture(tex.sampler, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);
            vec3 rgbB = rgbA * 0.5 + 0.25 * (
                texture(tex.sampler, fragCoord * inverseVP + dir * -0.5).xyz +
                texture(tex.sampler, fragCoord * inverseVP + dir * 0.5).xyz);
        
            vec4 color;
            float lumaB = dot(rgbB, luma);
            if((lumaB < lumaMin) || (lumaB > lumaMax))
                color = vec4(rgbA, texColor.a);
            else
                color = vec4(rgbB, texColor.a);
            return color;
        }`
    },
    {
        name: 'ssaa',
        frag: `
        vec4 ssaa(TextureInfos tex, vec2 uv) {
            int level = min(
                int(tex.size.x) / int(currentBuffer.size.x),
                int(tex.size.y) / int(currentBuffer.size.y)
            );
            
            vec2 texelSize = vec2(1.0 / tex.size.x, 1.0 / tex.size.y);
        
            vec4 outColor = vec4(0.0);
            
            int sampleCount = level / 2;
            for(int x = -sampleCount; x <= sampleCount; ++x)
            for(int y = -sampleCount; y <= sampleCount; ++y) {
                outColor += texture(tex, uv + vec2(x, y) * texelSize);
            }
            
            return vec4(outColor / pow(float(level) + 1.0, 2.0));
        }`
    }
]
