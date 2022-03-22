import { Recorder } from './Recorder';
import { downloadZip } from 'client-zip';
import { Downloader } from './Downloader';

const b64toBlob = dataURI => {
    const byteString = window.atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], {type: 'image/png'});
}

export class PNGRecorder extends Recorder {
    constructor() {
        super();
    }

    record(duration = 1, fps = 30) {
        this.delta = (1 / fps) * 1000;
        this.timer = 0;
        this.recording = true;
        this.duration = duration * 1000;

        this.frames = new Array();
    }

    update(context) {
        if(!this.recording) return;

        if(this.timer <= this.duration) {
            this.frames.push({
                name: `${this.frames.length}.png`.padStart(8, '0'),
                lastModified: new Date(),
                input: b64toBlob(context.canvas.toDataURL('image/png'))
            });

            console.log(((this.timer / this.duration) * 100).toFixed(1) + '%');

            this.timer += this.delta;
        } else {
            this.recording = false;

            downloadZip(this.frames).blob().then(blob => {
                Downloader.blob('result.zip', blob);
                console.log(`ffmpeg -framerate ${1 / (this.delta / 1000)} -i %04d.png output.webm`);
            }).catch(console.error);
        }
    }
}
