import './css/importCSS';

import { Eagle } from 'akila/utils';
import { Time } from 'akila/time';
import { Process } from './process/Process';
import { Exemples } from './exemples/Exemples';
import { Editor } from './editor/Editor';
import { UI } from './editor/UI';
import { Text } from './lang/Text';

console.log(Eagle.getString());

const time = new Time();
time.onInit(Process.init);
time.onTick(Process.update);
time.onDraw(Process.draw);
time.start();

window.cmd = {
    loadCircle: () => {
        Editor.setValue(Exemples.circle());
    },
    loadMandelbrot: () => {
        Editor.setValue(Exemples.mandelbrot());
    },
    loadConvolution: () => {
        Editor.setValue(Exemples.convolution());
    },
    loadRayMarching: () => {
        Editor.setValue(Exemples.rayMarching());
    },
    loadUvTest: () => {
        Editor.setValue(Exemples.uvTest());
    },
    setLang: lang => {
        Text.setLanguage(lang);
        UI.createWidgets();
    },
    hardReset: () => {
        Process.resetAll();
    },
    record: (format, duration, fps) => {
        Process.record(format, duration, fps);
    },
    programsToClipboard: (short) => {
        Process.programsToB64URLCLipboard(short);
    }
}

document.addEventListener('visibilitychange', () => {
    if(document.visibilityState != 'visible') time.pause();
    else time.play();
});

window.addEventListener('error', () => {
    Process.saveToLocalStorage();
});

window.addEventListener('beforeunload', () => {
    Process.saveToLocalStorage();
});

setTimeout(() => {
    document.querySelector('body').removeChild(document.getElementById('loading'));
    setTimeout(() => {
        Process.programsFromDocumentURLB64();
    }, 100);
}, 10);
