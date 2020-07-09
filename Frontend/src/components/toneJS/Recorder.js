let Tone;

export class Recorder {
    audio;
    chunks = []
    blob = undefined
    saveRecording;

    constructor(soundType) {
        this.initialized = false;
        if (Recorder.instace instanceof Recorder) {
            console.log("constructor")
            return Recorder.instace;
        }
    }

    initialize() {

        // checking if instace has already been created
        return new Promise((resolve, reject) => {

            import('tone').then(module => {
                Tone = module.default;
                //GENERAL TONEJS SETTINGS
                this.context = Tone.context

                this.masterVolume = new Tone.Volume(-1).toMaster()

                //RECORDER
                if (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)) {
                    this.recorderStarted = false
                    this.destination = this.context.createMediaStreamDestination()
                    MediaRecorder.mimeType = "audio/mp3"
                    this.recorder = new MediaRecorder(this.destination.stream)
                    this.fileSaver = require('file-saver');
                    this.blob = undefined
                    this.isChrome = true
                } else {
                    this.isChrome = false
                }

                // when all buffers are loaded, initializing is finished.
                Tone.Buffer.on('load', () => {
                    this.initialized = true;
                    resolve();
                })
                Tone.Buffer.on("error", (error) => {
                    reject(error);
                })
                Recorder.instace = this

            }).catch(e => reject(e));
        })
    }


    /*** RECORDER FUNCTIONS ***/
    startStopRecording() {
        if (this.isChrome) {
            if (!this.recorderStarted) {
                this.recorder.start()
                this.recorderStarted = true
            } else {
                this.recorder.stop()
                this.recorderStarted = false
            }

            this.recorder.ondataavailable = evt => this.chunks.push(evt.data);
            this.recorder.onstop = evt => {
                this.blob = new Blob(this.chunks, {type: 'audio/ogg; codecs=opus'})

                this.saveRecording = () => {
                    if (this.isChrome) {
                        if (this.blob) {
                            this.fileSaver.saveAs(this.blob)
                        }
                    }
                };
            }
        } else {
            alert("Recording is not supported in your browser.")
        }

    }
}


