import * as Tone from "tone"

export class Recorder {

    constructor() {
        this.context  = Tone.context;
        this.destination = this.context.createMediaStreamDestination()
        this.recorder =  new Mp3MediaRecorder(this.destination.stream)
    }

    startRecording(){
        this.recorder.start()
    }

    stopRecording(){
        this.recorder.stop()
    }
}
