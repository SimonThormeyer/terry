import MediaRecorder from 'media-stream-library';


export class Recorder {

    constructor() {
        this.audioContext = new AudioContext()
        this.destination = this.audioContext.createMediaStreamDestination()
        this.recorder = new MediaRecorder(this.destination.stream)
    }


}
