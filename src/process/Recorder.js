export class Recorder {
    constructor() {
        this.timer = 0;
        this.recording = false;
    }

    record(duration, fps) {}

    update(context) {}

    isRecording() {
        return this.recording;
    }

    getTime() {
        return this.timer / 1000; // ms to seconds
    }
}

