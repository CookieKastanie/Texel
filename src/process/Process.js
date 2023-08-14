import { Display, Texture } from "akila/webgl";
import { Mouse } from "akila/inputs";
import { Layer } from "./Layer";
import { Mesh } from "./Mesh";
import { UI } from "../editor/UI";
import { Editor } from "../editor/Editor";
import { Downloader } from './Downloader';
import { Time } from "akila/time";
import { Recorder } from "./Recorder";
import { GIFRecorder } from '../libs/gif/GIFRecorder';
import { PNGRecorder } from './PNGRecorder';
import { SB } from "./SB";
import { Clipboard } from "./Clipboard";

export class Process {
    static init() {
        UI.init();

        Mouse.DOM_TARGET_CANVAS = true;
        Process.display = new Display(600, 600, {webGLVersion: 2, antialias: false});
        Process.display.setClearColor(0.0, 0.0, 0.0, 0.0);
        Process.display.clear();

        Process.debbugTexture = new Texture(null, 1, 1);

        Mesh.init();

        Process.layers = new Array();
        for(let i = 0; i < Process.layerNumber; ++i) {
            Process.layers.push(new Layer(i));
        }

        Process.textures = new Array();
        for(let i = 0; i < Process.textureNumber; ++i) {
            const params = {
                magFilter: Texture.LINEAR,
                minFilter: Texture.LINEAR_MIPMAP_LINEAR,
                wrapS: Texture.REPEAT,
                wrapT: Texture.REPEAT,
                flipY: true
            }

            Process.textures.push(new Texture(null, 1, 1).setParameters(params).setUnit(i + Process.layerNumber));
        }

        Process.selectLayer(0);
        UI.createWidgets();

        Process.loadLocalStorage();

        Process.afterDraw = () => {}; // A changer

        Process.recorder = new Recorder();
    }

    static selectLayer(n) {
        n = Math.max(Math.min(Process.layerNumber - 1, n), 0);
        Process.selectedLayerIndex = n;
        Process.selectedLayer = Process.layers[n];

        Process.display.useDefaultFrameBuffer();
        Process.display.setSize(
            Process.selectedLayer.getFrameBuffer().getTexture().getWidth(),
            Process.selectedLayer.getFrameBuffer().getTexture().getHeight()
        );

        Process.selectedLayer.bind();
        UI.call('refreshUniforms');
    }

    static getSelectedLayer() {
        return Process.selectedLayer;
    }

    static setSelectedLayerSize(width, height) {
        Process.selectedLayer.setSize(width, height);
        Process.display.setSize(
            Process.selectedLayer.getWidth(),
            Process.selectedLayer.getHeight()
        );
        UI.call('refreshSize');
    }

    static setSelectedLayerMesh(mesh) {
        Process.selectedLayer.setMesh(mesh);
    }

    static updateTexture(index, img) {
        Process.textures[index].setTextureData(img);
        Process.textures[index].generateMipmap();
        Process.forceRenderLayerWithTexture(index);
    }

    static forceRenderLayerWithTexture(index) {
        for(let i = 0; i < Process.layerNumber; ++i) {
            const b = Process.layers[i].shader.getUniformFlags().textures[index];
            if(b) Process.layers[i].forceRender();
        }
    }

    static getTextureParams(index) {
        return Process.textures[index].getParameters();
    }

    static setTextureParams(index, params) {
        Process.textures[index].setParameters(params);
        Process.forceRenderLayerWithTexture(index);
    }

    static update() {
        for(const l of Process.layers) l.update();
    }

    static draw() {
        if(Process.recorder.isRecording()) Process.timeNow = Process.recorder.getTime();
        else Process.timeNow = Time.now;

        for(let i = 0; i < Process.layerNumber; ++i) {
            Process.layers[i].draw(Process.selectedLayerIndex == i);
        }

        Process.afterDraw(); // A changer

        Process.recorder.update(Process.display.getCtx());
    }

    static serializePrograms() {
        const data = {
            glsl: SB.VERSION,
            date: new Date(),
            layers: [],
            textures: []
        }

        for(let i = 0; i < Process.layerNumber; ++i) {
            const layer = Process.layers[i];

            data.layers.push({
                width: layer.getWidth(),
                height: layer.getHeight(),
                fragment: layer.getSavedFragment(),
                uniforms: layer.getUserUniforms()
            });
        }

        for(let i = 0; i < Process.textureNumber; ++i) {
            const texture = Process.textures[i];
            data.textures.push({parameters: texture.getParameters()});
        }

        return JSON.stringify(data);
    }

    static unserializePrograms(textFile) {
        try {
            const data = JSON.parse(textFile);

            if(data.glsl !== SB.VERSION) console.warn('File GLSL version differs from that of the application');

            if(Array.isArray(data.layers))
            for(let i = 0; i < Math.min(data.layers.length, Process.layerNumber); ++i) {
                const layer = data.layers[i];
                if(layer.fragment && typeof layer.fragment === 'string') {
                    Process.layers[i].setSavedFragment(layer.fragment);
                    Process.layers[i].setUseruniforms(layer.uniforms);
                    Process.layers[i].updateFragment();
                    Process.layers[i].forceRender();
                    
                    if(i == Process.selectedLayerIndex) {
                        Editor.setValue(layer.fragment);
                        Process.setSelectedLayerSize(layer.width, layer.height);
                    } else {
                        Process.layers[i].setSize(layer.width, layer.height);
                    }
                }
            }

            if(Array.isArray(data.textures))
            for(let i = 0; i < Math.min(data.textures.length, Process.textureNumber); ++i) {
                const texture = Process.textures[i];
                texture.setParameters(data.textures[i].parameters);
            }
            UI.call('refreshTextureParameters');
            
        } catch(e) {
            console.error(e);
        }
    }

    static saveToLocalStorage() {
        const value = Process.serializePrograms();
        localStorage.setItem('last_session', value);
    }

    static loadLocalStorage() {
        const textFile = localStorage.getItem('last_session');
        if(typeof textFile == 'string') {
            Process.unserializePrograms(textFile);
        }
    }

    static downloadPrograms(fileName = 'program.txl') {
        Downloader.text(fileName, Process.serializePrograms());
    }

    static uploadPrograms(file) {
        for(let i = 0; i < Process.layerNumber; ++i) {
            Process.layers[i].resetUserUniforms();
        }
        
        Process.unserializePrograms(file);
    }

    static saveCurrentImage(fileName = 'render.png') {
        // A changer
        Process.layers[Process.selectedLayerIndex].forceRender();
        Process.afterDraw = () => {
            Downloader.canvasImage(fileName, Process.display.getCanvas());
            Process.afterDraw = () => {};
        }
    }

    static resetAll() {
        window.addEventListener('beforeunload', e => {
            e.stopPropagation();
            localStorage.clear();
        }, true);

        location.reload();
    }

    static record(format, duration, fps) {
        if(Process.recorder.isRecording()) {
            console.warn('You are already recording');
            return;
        }

        switch(format) {
            case 'gif':
                Process.recorder = new GIFRecorder();
                break;

            case 'png':
                Process.recorder = new PNGRecorder();
                break;
        
            default:
                Process.recorder = new Recorder();
                break;
        }

        Process.recorder.record(duration, fps);
    }

    static programsToB64URLCLipboard(short = false) {
        let json = Process.serializePrograms();

        if(short) {
            json = JSON.parse(json);
            delete json.date;
            delete json.textures;
            json.layers = [json.layers[0]];
            console.log(json)
            json = JSON.stringify(json);
        }

        const b64 = window.btoa(json);

        const href = window.location.origin + window.location.pathname;
        const url = `${href}?b64=${b64}`;
        Clipboard.copyText(url);
    }

    static programsFromDocumentURLB64() {
        const params = new URLSearchParams(window.location.search);
        const b64 = params.get('b64');
        if(!b64) return;

        if(confirm('Accept new program ?')) {
            const json = window.atob(b64);
            Process.unserializePrograms(json);
            Process.saveToLocalStorage();
        }
        
        window.location.href = window.location.origin + window.location.pathname;
    }
}

Process.layerNumber = 4;
Process.textureNumber = 6;
