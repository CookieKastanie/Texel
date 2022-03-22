const GIFEncoder = require('./GIFEncoder');
import { Recorder } from '../../process/Recorder';

export class GIFRecorder extends Recorder {
    constructor() {
        super();

        this.encoder = new GIFEncoder();
        this.delta = 40; // 25 fps

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    record(duration = 1, fps = 25) {
        this.encoder.setRepeat(0); // 0 -> loop forever

        this.delta = (1 / fps) * 1000;
        this.encoder.setDelay(this.delta); // milliseconds

        this.timer = 0;
        this.recording = true;
        this.duration = duration * 1000;

        this.encoder.start();
    }

    update(context) {
        if(!this.recording) return;

        if(this.timer <= this.duration) {
            this.canvas.width = context.canvas.width;
            this.canvas.height = context.canvas.height;

            this.ctx.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height);
            this.encoder.addFrame(this.ctx);

            console.log(((this.timer / this.duration) * 100).toFixed(1) + '%');

            this.timer += this.delta;
        } else {
            this.recording = false;
            this.encoder.finish();
            this.encoder.download('result.gif');
        }
    }
}
