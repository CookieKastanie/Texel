import { Time } from "akila/time";
import { TrackBallCamera } from "akila/utils";
import { NeutralCamera } from "./NeutralCamera";
import { FrameBuffer, Texture } from "akila/webgl";
import { Editor } from "../editor/Editor";
import { Mesh } from "./Mesh";
import { Process } from "./Process";
import { ShaderLayer } from "./ShaderLayer";
import { Mouse } from "akila/inputs";

export class Layer {
    constructor(unit) {
        if(unit == 0) this.savedFragment =
`in vec2 i_uv;
in vec3 i_normal;

out vec4 fragColor;

void main() {
    fragColor = vec4(i_uv, 0.0, 1.0);
}
`;
        else this.savedFragment =
`in vec2 i_uv;
in vec3 i_normal;

out vec4 fragColor;

void main() {
    fragColor = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

        this.shader = new ShaderLayer(this.savedFragment);
        this.framebuffer = new FrameBuffer(600, 600, {
            texColor: true, texColorUnit: unit,
            depthTest: true,
        });

        this.framebuffer.getTexture().setParameters({
            magFilter: Texture.LINEAR,
            minFilter: Texture.LINEAR,
            wrapS: Texture.REPEAT,
            wrapT: Texture.REPEAT
        });

        this.shaderIsValid = true;
        this.errorMessage = '';
        this.needUpdate = false;
        this.updateAt = 0;
        this.realTime = false;
        this.needRender = true;

        this.unit = unit;

        this.vec2Buffer = new Float32Array([0, 0]);
        this.vec3Buffer = new Float32Array([0, 0, 0]);

        this.defaultCamera = new NeutralCamera();

        this.controleCamera = new TrackBallCamera(600, 600);
        this.controleCamera.setScrollSpeed(0.4);
        this.controleCamera.setDistance(2.1);

        this.currentCamera = this.defaultCamera;
        this.currentMesh = Mesh.quad;

        this.mouse = new Mouse();
    }

    bind() {
        Editor.onchange(() => {
            this.updateAt = Time.now + Layer.changeDelta;
            this.needUpdate = true;
        });
        Editor.setValue(this.savedFragment);

        if(this.shaderIsValid) Editor.displayNoError();
        else Editor.displayError(this.errorMessage);

        this.needRender = true;
    }

    setMesh(mesh) {
        this.currentMesh = mesh;
        if(mesh == Mesh.quad) this.currentCamera = this.defaultCamera;
        else this.currentCamera = this.controleCamera;

        this.needUpdate = true;
        this.needRender = true;
    }

    getMesh() {
        return this.currentMesh;
    }

    forceRender() {
        this.needRender = true;
    }

    getFrameBuffer() {
        return this.framebuffer;
    }

    getSavedFragment() {
        return this.savedFragment;
    }

    setSavedFragment(frag) {
        this.savedFragment = frag;
    }

    isRealTime() {
        return this.realTime;
    }

    getWidth() {
        return this.getFrameBuffer().getTexture().getWidth();
    }

    getHeight() {
        return this.getFrameBuffer().getTexture().getHeight();
    }

    setSize(width, height) {
        if(isNaN(width)) width = 1;
        if(isNaN(height)) height = 1;

        width = Math.max(width, 1);
        height = Math.max(height, 1);

        this.getFrameBuffer().setSize(width, height);
        this.forceRender();
        this.controleCamera.setSize(width, height);
    }

    updateFragment() {
        this.needUpdate = false;
        this.shaderIsValid = this.shader.updateFragment(this.savedFragment);

        if(this.shaderIsValid == false) {
            this.errorMessage = this.shader.getCurrentError();
            return;
        }

        this.errorMessage = '';

        this.realTime = 
            this.shader.getUniformFlags().time ||
            (this.currentCamera != this.defaultCamera) ||
            this.shader.getUniformFlags().mouse;

        if(this.realTime == false) {
            const flags = this.shader.getUniformFlags().buffers;
            for(let i = 0; i < Process.layerNumber; ++i) {
                if(Process.layers[i].isRealTime() && flags[i]) {
                    this.realTime = true;
                    break;
                }
            }
        }
    }

    update() {
        if(this.needUpdate == false || Time.now < this.updateAt) {
            return;
        }

        this.savedFragment = Editor.getValue();
        this.updateFragment();

        if(this.shaderIsValid) {
            Editor.displayNoError();
            this.needRender = true;
        } else {
            Editor.displayError(this.errorMessage);
        }
    }

    draw(isSelected) {
        if(this.needRender || (this.shaderIsValid && this.realTime)) {
            this.needRender = false;
            this.shader.use();
            this.framebuffer.use();
            this.framebuffer.clear();
            this.shader.sendFloat('time', Process.timeNow);

            if(isSelected) this.currentCamera.update();
            this.shader.sendMat4('PV', this.currentCamera.getVPMatrix());

            if(this.shader.getUniformFlags().currentBuffer) {
                const texture = this.getFrameBuffer().getTexture();
                this.vec2Buffer[0] = texture.getWidth();
                this.vec2Buffer[1] = texture.getHeight();
                this.shader.sendVec2(`currentBuffer.size`, this.vec2Buffer);
                this.shader.sendFloat(`currentBuffer.ratio`, texture.getWidth() / texture.getHeight());
            }

            for(let i = 0; i < Process.layerNumber; ++i) {
                const b = this.shader.getUniformFlags().buffers[i];
                if(b) {
                    const texture = Process.layers[i].getFrameBuffer().getTexture();
                    if(this.unit != i) texture.use();
                    else {
                        Process.debbugTexture.setUnit(i);
                        Process.debbugTexture.use();
                    }

                    this.vec2Buffer[0] = texture.getWidth();
                    this.vec2Buffer[1] = texture.getHeight();
                    this.shader.sendVec2(`buffer${Layer.ALPHABET[i]}.size`, this.vec2Buffer);
                    this.shader.sendFloat(`buffer${Layer.ALPHABET[i]}.ratio`, texture.getWidth() / texture.getHeight());
                }
            }

            for(let i = 0; i < Process.textureNumber; ++i) {
                const b = this.shader.getUniformFlags().textures[i];
                if(b) {
                    const texture = Process.textures[i];
                    texture.use();
                    this.vec2Buffer[0] = texture.getWidth();
                    this.vec2Buffer[1] = texture.getHeight();
                    this.shader.sendVec2(`tex${Layer.ALPHABET[i]}.size`, this.vec2Buffer);
                    this.shader.sendFloat(`tex${Layer.ALPHABET[i]}.ratio`, texture.getWidth() / texture.getHeight());
                }
            }

            if(this.shader.getUniformFlags().camera) {
                this.shader.sendMat4(`camera.view`, this.currentCamera.getCameraMatrix());
                this.shader.sendMat4(`camera.projection`, this.currentCamera.getProjectionMatrix());
                this.shader.sendVec3(`camera.pos`, this.currentCamera.getPosition());
            }

            if(this.shader.getUniformFlags().mouse) {
                this.vec2Buffer[0] = this.mouse.posX();
                this.vec2Buffer[1] = this.getHeight() - this.mouse.posY();
                this.shader.sendVec2(`mouse.pos`, this.vec2Buffer);

                this.vec2Buffer[0] = this.mouse.velX();
                this.vec2Buffer[1] = -this.mouse.velY();
                this.shader.sendVec2(`mouse.vel`, this.vec2Buffer);

                this.vec3Buffer[0] = this.mouse.isPressed(Mouse.LEFT_BUTTON) * 1.0;
                this.vec3Buffer[1] = this.mouse.isPressed(Mouse.WHEEL_BUTTON) * 1.0;
                this.vec3Buffer[2] = this.mouse.isPressed(Mouse.RIGHT_BUTTON) * 1.0;
                this.shader.sendVec3(`mouse.buttons`, this.vec3Buffer);
            }

            this.currentMesh.draw();

            if(isSelected) this.framebuffer.blitToScreen(FrameBuffer.NEAREST);
        }
    }
}

Layer.changeDelta = 0.5;
Layer.ALPHABET = ['A', 'B', 'C', 'D', 'E', 'F'];
