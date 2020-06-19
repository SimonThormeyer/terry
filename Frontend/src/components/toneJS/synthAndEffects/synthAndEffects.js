let Tone;

export class SynthAndEffects {
    audio;
    chunks = []
    blob = undefined
    saveRecording;

    constructor() {
        this.initialized = false;
        import('tone').then(module => {
            Tone = module.default;

            // Settings
            this.noteLengthOptions = ["32n", "16n", "8n", "4n", "2n", "1n"]
            this.waveforms = ["sine", "sawtooth6", "square"]
            this.noteLength = this.noteLengthOptions[2]

            //GENERAL TONEJS SETTINGS
            this.context = Tone.context
            this.context.latencyHint = "balanced"
            this.context.lookAhead = 0.1

            //RECORDER
            this.recorderStarted = false
            this.destination = this.context.createMediaStreamDestination()
            MediaRecorder.mimeType = "audio/mp3"
            this.recorder = new MediaRecorder(this.destination.stream)
            this.fileSaver = require('file-saver');
            this.blob = undefined

            // INSTRUMENT_CHAIN
            //Effects
            this.limiter = new Tone.Limiter(-1).toMaster()
            this.limiter.connect(this.destination)
            this.compressor = new Tone.Compressor(-20, 12).connect(this.limiter)
            this.volume = new Tone.Volume(0).connect(this.compressor);
            this.reverb = new Tone.Reverb(2).connect(this.volume)
            this.pan = new Tone.Panner(1).connect(this.volume)
            this.delay = new Tone.PingPongDelay(0.1, 0).connect(this.pan)

            //Synth
            this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.delay)
            this.polySynth = new Tone.PolySynth(8, Tone.FMSynth, {
                oscillator: {
                    type: "sine",
                }
            }).connect(this.filter);

            //LFOs
            this.panLfo = new Tone.LFO(5, 0, 1);
            this.panLfo.connect(this.pan.pan);
            this.panLfo.start()

            // Volume Adjustments
            this.volumeFilterAdj = 0
            this.volumeADSRAdj = 0
            this.volumeReverbAdj = 0

            this.volumeValue = 0-10 + this.volumeFilterAdj // trying to keep the volumen roughly around -10db

            //UTILITY
            this.delayCounter = 0
            this.reverbCounter = 0
            this.volume.volume.value = 0

            // INITIALISING
            this.reverb.generate() // reverb needs to be initialised
            this.reverb.wet.value = 0.1
            this.initialized = true;
        })
    }


    /*** UTILITY FUNCTIONS ***/
    startContext() {
        console.log(this.context.isContext)
        this.context = Tone.context
    }

    /*** SYNTH FUNCTIONS ***/
    triggerSynth(note) {
        this.polySynth.triggerAttackRelease(note, this.noteLength);
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

    setSynthADSR(value) {
        if (!this.initialized) return
        this.polySynth.set({
            "envelope": {
                "sustain": (this._normalizeRange(value) * 0.9) + 0.1,
                "attack": (this._normalizeRange(value) * 0.2)
            }
        });
        // compensate volume for longer notes
        this.volumeADSRAdj = ((-1) * (this._normalizeRange(value)) * 6)
        this._setVolumeForAll()

    }

    setOscillatorType(value) {
        if (!this.initialized) return
        let numberOfWaveformOptions = this.waveforms.length - 1
        let position = Math.round(((value + 1) / 2) * numberOfWaveformOptions)
        let waveform = this.waveforms[position]
        this.polySynth.set(
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
        // compensate volume when the filter opens up

        this.volumeReverbAdj = ((1) * (this._normalizeRange(value)) * 3)
        this._setVolumeForAll()
    }

    //INTERNAL FUNCTIONS

    _normalizeRange(value) {
        return ((value + 1) / 2)
    }

    _setVolumeForAll(){
        this.volume.volume.value =
            this.volumeValue + this.volumeFilterAdj + this.volumeADSRAdj + this.volumeReverbAdj
        console.log("ALL VOLUMES:  "+this.volume.volume.value)
    }


    /*** RECORDER FUNCTIONS ***/
    startStopRecording() {
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
                if (this.blob) {
                    this.fileSaver.saveAs(this.blob)
                }

            };
        }
    }
}


