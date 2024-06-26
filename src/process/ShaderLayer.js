import { Display, Shader } from "akila/webgl";
import { SB } from './SB';

export class ShaderLayer extends Shader {
    constructor(fs) {
        super(SB.buidVertexShader(), SB.buidFragmentShader(`void main(){}`));

        this.uniformFlags = {
            time: false,
            buffers: new Array(SB.BUFFERCOUNT),
            textures: new Array(SB.TEXCOUNT),
            camera: false,
            mouse: false
        };

        this.currentError = '';

        this.updateFragment(fs);
    }

    getCurrentError() {
        return this.currentError;
    }

    textureInfoUniformExist(name) {
        return (this.getUniformLocation(name +'.sampler') != undefined) ||
               (this.getUniformLocation(name +'.size') != undefined) ||
               (this.getUniformLocation(name +'.ratio') != undefined);
    }

    cameraInfoUniformExist(name) {
        return (this.getUniformLocation(name +'.view') != undefined) ||
               (this.getUniformLocation(name +'.projection') != undefined) ||
               (this.getUniformLocation(name +'.pos') != undefined);
    }

    updateFragment(s) {
        const frag = SB.buidFragmentShader(s);

        let newShader;
        try {
            newShader = this.createShader(Display.ctx.FRAGMENT_SHADER, frag);
        } catch (error) {
            this.currentError = error.substr(0, error.length - 1);

            const offset = -1; // ajuste le numero de ligne de l'erreur
            this.currentError = this.currentError.replaceAll(/ERROR: [0-9]+:[0-9]+:/g, m => {
                return m.replace(/:[0-9]+:/g, e => {
                    return e.replace(/[0-9]+/g, n => {
                        return parseInt(n) + offset;
                    });
                });
            })

            return false;
        }
        this.delShad(this.fragmantShader);
        this.fragmantShader = newShader;
        Display.ctx.attachShader(this.program, this.fragmantShader);
        Display.ctx.linkProgram(this.program);
        this.fetchUniforms();

        if(this.getUniformLocation(SB.TIME)) this.uniformFlags.time = true;
        else this.uniformFlags.time = false;

        this.use();
        if(this.textureInfoUniformExist(SB.CURRENT_BUFFER)) {
            this.sendInt(SB.CURRENT_BUFFER +'.sampler', 15);
            this.uniformFlags.currentBuffer = true;
        } else {
            this.uniformFlags.currentBuffer = false;
        }

        for(let i = 0; i < SB.BUFFERCOUNT; ++i) {
            const uName = SB.BUFFER + SB.ALPHABET[i];
            if(this.textureInfoUniformExist(uName)) {
                this.sendInt(uName +'.sampler', i);
                this.uniformFlags.buffers[i] = true;
            } else {
                this.uniformFlags.buffers[i] = false;
            }
        }

        for(let i = 0; i < SB.TEXCOUNT; ++i) {
            const uName = SB.TEX + SB.ALPHABET[i];
            if(this.textureInfoUniformExist(uName)) {
                this.sendInt(uName +'.sampler', i + SB.BUFFERCOUNT);
                this.sendInt(uName +'.yInv', 1);
                this.uniformFlags.textures[i] = true;
            } else {
                this.uniformFlags.textures[i] = false;
            }
        }

        this.uniformFlags.camera = this.cameraInfoUniformExist(SB.CAMERA);

        this.uniformFlags.mouse = this.cameraInfoUniformExist(SB.MOUSE);

        this.currentError = '';

        // delete built in uniform infos
        delete this.uniformInfos['PV'];
        for(let k in this.uniformInfos) {
            for(let unif of ShaderLayer.customAtomsList) {
                if(k.startsWith(unif) || k.startsWith(`${unif}.`)) {
                    delete this.uniformInfos[k];
                    break;
                }
            }
        }

        return true;
    }

    getUniformFlags() {
        return this.uniformFlags;
    }

    // @override
    createShader(type, text) {
        const shader = Display.ctx.createShader(type);
    
        Display.ctx.shaderSource(shader, text);
        Display.ctx.compileShader(shader);
        if (!Display.ctx.getShaderParameter(shader, Display.ctx.COMPILE_STATUS)) {
            throw Display.ctx.getShaderInfoLog(shader);
        }
    
        return shader;
    }

    send(name, value, type, length) {
        ShaderLayer.sendFuncMatrix[type][length].bind(this)(name, value);
    }
}

ShaderLayer.customAtomsList = new Array();
for(let i = 0; i < SB.BUFFERCOUNT; ++i) {
    ShaderLayer.customAtomsList.push(`${SB.BUFFER}${SB.ALPHABET[i]}`);
}
for(let i = 0; i < SB.TEXCOUNT; ++i) {
    ShaderLayer.customAtomsList.push(`${SB.TEX}${SB.ALPHABET[i]}`);
}
ShaderLayer.customAtomsList.push(SB.CURRENT_BUFFER, SB.TIME, SB.PI, SB.HALF_PI, SB.CAMERA, SB.MOUSE);

ShaderLayer.customAtoms = ShaderLayer.customAtomsList.join(' ');

ShaderLayer.customFuncs = `${SB.FUNCNAMES}`;

ShaderLayer.sendFuncMatrix = {
    FLOAT: [Shader.prototype.sendFloat, Shader.prototype.sendVec2, Shader.prototype.sendVec3, Shader.prototype.sendVec4],
    INT: [Shader.prototype.sendInt, Shader.prototype.sendIVec2, Shader.prototype.sendIVec3, Shader.prototype.sendIVec4]
}
