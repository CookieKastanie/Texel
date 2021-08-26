const GIFEncoder = require('./GIFEncoder');

export class GIFRecorder {
    constructor() {
        this.encoder = new GIFEncoder();
        this.timer = 0;
        this.delta = 40; // 25 fps
        this.recording = false;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    record(duration = 1000, fps = 25) { // duration in ms
        if(!this.recording) {
            this.encoder.setRepeat(0); // 0 -> loop forever

            this.delta = (1 / fps) * 1000;
            this.encoder.setDelay(this.delta); // milliseconds

            this.timer = 0;
            this.recording = true;
            this.duration = duration;
    
            this.encoder.start();
        } else {
            console.warn('You are already recording');
        }
    }

    update(context) {
        if(this.recording) {
            if(this.timer <= this.duration) {
                this.canvas.width = context.canvas.width;
                this.canvas.height = context.canvas.height;

                this.ctx.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height);
                this.encoder.addFrame(this.ctx);

                console.log(((this.timer / this.duration) * 100) + '%');

                this.timer += this.delta;
            } else {
                this.recording = false;
                this.encoder.finish();
                this.encoder.download('result.gif');
            }
        }
    }

    isRecording() {
        return this.recording;
    }

    getTime() {
        return this.timer / 1000; // ms to seconds
    }
}
