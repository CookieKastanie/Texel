import { Display, Texture } from "akila/webgl";
import { Mouse } from "akila/inputs";
import { Layer } from "./Layer";
import { Mesh } from "./Mesh";
import { UI } from "../editor/UI";
import { Editor } from "../editor/Editor";
import { Downloader } from './Downloader';
import { Time } from "akila/time";
import { GIFRecorder } from '../libs/gif/GIFRecorder';

export class Process {
    static init() {
        UI.init();

        Mouse.DOM_TARGET_CANVAS = true;
        Process.display = new Display(600, 600, {webGLVersion: 2, antialias: false});
        Process.display.disable(Display.DEPTH_TEST);
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
            Process.textures.push(new Texture(null, 1, 1).setParameters({flipY: true}).setUnit(i + Process.layerNumber));
        }

        Process.newTextureData = new Array();

        Process.selectLayer(0);
        UI.createMenus();

        Process.loadLocalStorage();

        Process.afterDraw = () => {}; // A changer

        Process.gifRecorder = new GIFRecorder();
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
    }

    static getSelectedLayer() {
        return Process.selectedLayer;
    }

    static setSelectedLayerSize(width, height) {
        width = Math.max(width, 1);
        height = Math.max(height, 1);
        
        Process.selectedLayer.setSize(width, height);
        Process.display.setSize(width, height);
    }

    static setSelectedLayerMesh(mesh) {
        Process.selectedLayer.setMesh(mesh);
    }

    static updateTexture(index, img) {
        Process.textures[index].setTextureData(img);

        for(let i = 0; i < Process.layerNumber; ++i) {
            const b = Process.layers[i].shader.getUniformFlags().textures[index];
            if(b) Process.layers[i].forceRender();
        }
    }

    static update() {
        for(const l of Process.layers) l.update();
    }

    static draw() {
        if(Process.gifRecorder.isRecording()) Process.timeNow = Process.gifRecorder.getTime();
        else Process.timeNow = Time.now;

        for(let i = 0; i < Process.layerNumber; ++i) {
            Process.layers[i].draw(Process.selectedLayerIndex == i);
        }

        Process.afterDraw(); // A changer

        Process.gifRecorder.update(Process.display.getCtx());
    }

    static serializePrograms() {
        let str = '';

        for(let i = 0; i < Process.layerNumber; ++i) {
            const frag = Process.layers[i].getSavedFragment();

            str += `${frag}@start_end@`;
        }

        return str;
    }

    static unserializePrograms(textFile) {
        const frags = textFile.split('@start_end@');
        for(let i = 0; i < Math.min(frags.length, Process.layerNumber); ++i) {
            const frag = frags[i];
            if(frag != '') {
                Process.layers[i].setSavedFragment(frag);
                if(i == Process.selectedLayerIndex) Editor.setValue(frag);
            }
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
}

Process.layerNumber = 4;
Process.textureNumber = 6;
