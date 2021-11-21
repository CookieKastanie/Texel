import { frags } from './frags/importFrags';

export class SB {
    static buidVertexShader() {
        return `#version ${SB.VERSION}
        precision mediump float;
        
        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec2 a_uv;
        layout(location = 2) in vec3 a_normal;
        
        out vec2 i_uv;
        out vec3 i_normal;
        
        uniform mat4 PV;

        void main(){
            gl_Position = PV * vec4(a_position, 1.0);
            i_uv = a_uv;
            i_normal = a_normal;
        }`;
    }

    static buidFragmentShader(s) {
        return `${fragBegin}${s}`;
    }
}

SB.VERSION = '300 es';

SB.TEX = 'tex';
SB.CURRENT_BUFFER = 'currentBuffer';
SB.BUFFER = 'buffer';
SB.TIME = 'time';
SB.PI = 'PI';
SB.HALF_PI = 'HALF_PI';
SB.CAMERA = 'camera';

SB.FUNCNAMES = (() => {
    let str = '';
    for(const f of frags) str += ` ${f.name}`;
    return str;
})()

SB.ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F'];

SB.BUFFERCOUNT = 4;
SB.TEXCOUNT = 6;

const fragBegin = `#version ${SB.VERSION}\n`+
`precision mediump float;

struct TextureInfos {
    sampler2D sampler;
    vec2 size;
    float ratio;
};

struct Camera {
    mat4 view;
    mat4 projection;
    vec3 pos;
};

uniform TextureInfos ${SB.CURRENT_BUFFER};

${(() => {
    let str = '';
    for(let i = 0; i < SB.BUFFERCOUNT; ++i) {
        str += `uniform TextureInfos ${SB.BUFFER}${SB.ALPHABET[i]};\n`;
    }

    return str;
})()}

${(() => {
    let str = '';
    for(let i = 0; i < SB.TEXCOUNT; ++i) {
        str += `uniform TextureInfos ${SB.TEX}${SB.ALPHABET[i]};\n`;
    }

    return str;
})()}

uniform float ${SB.TIME};

uniform Camera ${SB.CAMERA};

const float ${SB.PI}      = 3.1415926535897932;
const float ${SB.HALF_PI} = 1.5707963267948966;

${(() => {
    let str = '';
    for(const f of frags) str += f.frag;
    return str;
})()}

`.replace(/\r?\n|\r/g, ' ').replace(/\s+/g, ' ');
