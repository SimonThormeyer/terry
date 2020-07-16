let Tone;

let isFireFox = typeof InstallTrigger !== 'undefined';
let isChrome = (!!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime))

export class Recorder {
    audio;
    chunks = []
    blob = undefined
    saveRecording;

    constructor(soundType) {
        this.initialized = false;

    }

    initialize() {
        // checking if instace has already been created
        return new Promise((resolve, reject) => {
                if (Recorder.instace instanceof Recorder) {
                    console.log("constructor")
                    return Recorder.instace;
                } else {

                    import('tone').then(module => {
                        Tone = module.default;
                        //GENERAL TONEJS SETTING
                        this.context = Tone.context

                        //RECORDER
                        if (isChrome || isFireFox) {
                            this.recorderStarted = false
                            this.destination = this.context.createMediaStreamDestination()
                            Tone.Master.connect(this.destination)

                            let options = { mimeType: "audio/webm; codecs=opus" };

                            this.recorder = new MediaRecorder(this.destination.stream, options)

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
                }
            }
        )
    }


    /*** RECORDER FUNCTIONS ***/
    startStopRecording() {
        if (this.isChrome || isFireFox) {
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


