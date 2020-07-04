let Tone;

const publicUrl = process.env.REACT_APP_PUBLIC_URL || "http://localhost:3000";

export class SynthAndEffects {
    audio;
    chunks = []
    blob = undefined
    saveRecording;

    constructor(soundType) {
        this.initialized = false;
        this.soundType = soundType
        // Settings
        this.noteLengthOptions = ["32n", "16n", "8n", "4n", "2n", "1n"]
        this.waveforms = ["sine", "sawtooth6", "square"]
        this.noteLength = this.noteLengthOptions[2]
    }

    initialize() {
        return new Promise((resolve, reject) => {
            import('tone').then(module => {

                Tone = module.default;


                //GENERAL TONEJS SETTINGS
                this.context = Tone.context
                this.context.latencyHint = "balanced"
                this.context.lookAhead = 0.1

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


                // INSTRUMENT_CHAIN
                //Effects
                this.limiter = new Tone.Limiter(-1).toMaster()
                if (this.isChrome) {
                    this.limiter.connect(this.destination)
                }
                this.controllableVolume = new Tone.Volume(-1)
                this.compressor = new Tone.Compressor(-20, 12)
                this.volume = new Tone.Volume(-50)
                this.reverb = new Tone.Reverb(2)
                this.pan = new Tone.Panner(1)
                this.delay = new Tone.FeedbackDelay(0.1, 0)

                //Synth
                this.filter = new Tone.Filter(400, 'lowpass', -12)


                if (this.soundType === "Marimba") {
                    this.mainSoundSource = new Tone.Sampler({
                        "C3": publicUrl + "/samples/marimbaC3.wav"
                    })
                    this.mainSoundSource.volume.value = -6
                } else if (this.soundType === "Harp") {
                    this.mainSoundSource = new Tone.Sampler({
                        "C5": publicUrl + "/samples/harpc3.wav"
                    })
                    this.mainSoundSource.volume.value = -8
                } else {
                    this.mainSoundSource = new Tone.PolySynth(8, Tone.FMSynth, {
                        oscillator: {
                            type: "sine",
                        }
                    })
                }

                this.mainSoundSource.chain(this.filter, this.delay, this.pan, this.reverb, this.volume,
                    this.compressor, this.controllableVolume, this.limiter, Tone.Master)

                //LFOs
                this.panLfo = new Tone.LFO(5, 0, 1);
                this.panLfo.connect(this.pan.pan);
                this.panLfo.start()

                // Volume Adjustments
                this.volumeFilterAdj = -8
                this.volumeADSRAdj = -6
                this.volumeReverbAdj = 4
                this.volumeValue = -5
                this.volume.volume.value = this.volumeValue + this.volumeFilterAdj + this.volumeADSRAdj + this.volumeReverbAdj

                //UTILITY
                this.delayCounter = 0
                this.reverbCounter = 0

                // INITIALISING
                this.reverb.generate() // reverb needs to be initialised
                this.reverb.wet.value = 0.1
                // when all buffers are loaded, initializing is finished.
                Tone.Buffer.on('load', () => {
                    this.initialized = true;
                    resolve();
                })
                Tone.Buffer.on("error", (error) => {
                    reject(error);
                })

            }).catch(e => reject(e));
        })
    }



    /*** UTILITY FUNCTIONS ***/
    startContext() {
        console.log(this.context.isContext)
        this.context = Tone.context
    }

    /*** SYNTH FUNCTIONS ***/
    triggerSynth(note) {
        this.mainSoundSource.triggerAttackRelease(note, this.noteLength);
    }

    setFilter(valueX) {
        if (!this.initialized) return
        let calculatedFrequency = (this._normalizeRange(valueX) * 1300) + 200
        this.filter.frequency.value = calculatedFrequency

        // compensate volume when the filter opens up
        this.volumeFilterAdj = ((-1) * (this._normalizeRange(valueX)) * 8)
        this._setVolumeForAll()

    }

    setNoteLength(value) {
        if (!this.initialized) return
        let numberOfLengthOptions = this.noteLengthOptions.length - 1
        let position = Math.round(((value + 1) / 2) * numberOfLengthOptions)
        this.noteLength = this.noteLengthOptions[position]
    }

    setADSR(value) {
        if (!this.initialized) return
        this.mainSoundSource.set({
            "envelope": {
                "sustain": (this._normalizeRange(value) * 0.9) + 0.1,
                "attack": (this._normalizeRange(value) * 0.2)
            }
        });
        // compensate volume for longer notes
        this.volumeADSRAdj = ((-1) * (this._normalizeRange(value)) * 9)
        this._setVolumeForAll()

    }

    setOscillatorType(value) {
        if (!this.initialized) return
        let numberOfWaveformOptions = this.waveforms.length - 1
        let position = Math.round(((value + 1) / 2) * numberOfWaveformOptions)
        let waveform = this.waveforms[position]
        this.mainSoundSource.set(
            {
                oscillator: {
                    type: waveform

                }
            })
    }


    /*** EFFECT FUNCTIONS ***/
    //Panning
    setPanningEffect(valueX, valueY) {
        if (!this.initialized) return
        this.panLfo.set("max", this._normalizeRange(valueX) * this._normalizeRange(valueX))
        this.panLfo.frequency.value = this._normalizeRange(valueY) * 8

    }

    //Delay
    setDelayFeedback(value) {
        if (!this.initialized) return
        if (this.delayCounter % 35) {
            this.delay.feedback.value = (this._normalizeRange(value)) * 0.9
        }
        this.delayCounter++
    }

    setDelayWet(value) {
        if (!this.initialized) return
        this.delay.wet.value = this._normalizeRange(value)
    }

    //Reverb
    setReverbWet(value) {
        if (!this.initialized) return
        if (this.reverbCounter % 50) {
            this.reverb.wet.value = (this._normalizeRange(value)) * 0.9
        }
        this.reverbCounter++
        // compensate volume when the reverb opens up
        this.volumeReverbAdj = ((1) * (this._normalizeRange(value)) * 4)
        this._setVolumeForAll()
    }

    //INTERNAL FUNCTIONS

    _normalizeRange(value) {
        return ((value + 1) / 2)
    }

    _setVolumeForAll() {
        this.volume.volume.value =
            this.volumeValue + this.volumeFilterAdj + this.volumeADSRAdj + this.volumeReverbAdj
        //console.log("ALL VOLUMES:  "+this.volume.volume.value)
    }

    /*** VOLUME FUNCTIONS ***/
    setcontrollableVolume(value){
        // expects value to be between 0 - 1
        this.controllableVolume.volume.value = value * 100 - 100
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
                this.blob = new Blob(this.chunks, { type: 'audio/ogg; codecs=opus' })

                this.saveRecording = () => {
                    if (this.isChrome) {
                        if (this.blob) {
                            this.fileSaver.saveAs(this.blob)
                        }
                    }


                };
            }
        }
        else {
            alert("Recording is not supported in your browser.")
        }


    }
}


