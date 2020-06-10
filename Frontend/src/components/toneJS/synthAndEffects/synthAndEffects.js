import Tone from "tone";

export class SynthAndEffects {
    audio;
    chunks = []
    context;

    constructor() {
        // Settings
        this.noteLengthOptions = ["32n", "16n", "8n", "4n", "2n", "1n"]
        this.waveforms = ["sine", "saw", "pulse"]
        this.noteLength = this.noteLengthOptions[2]

        //GENERAL TONEJS SETTINGS
        this.context = Tone.context
        this.context.latencyHint = "balanced"
        this.context.lookAhead = 0.1

        //RECORDER
        this.recorderStarted = false
        this.destination = this.context.createMediaStreamDestination()
        this.recorder = new MediaRecorder(this.destination.stream)
        this.fileSaver = require('file-saver');

        // INSTRUMENT_CHAIN
        //Effects
        this.limiter = new Tone.Limiter(-1).toMaster()
        this.limiter.connect(this.destination)
        this.volume = new Tone.Volume(-5).connect(this.limiter);
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

        //UTILITY
        this.delayCounter = 0
        this.reverbCounter = 0

        // INITIALISING
        this.reverb.generate() // reverb needs to be initialised
        this.reverb.wet.value = 0.1
    }

    /*** SYNTH FUNCTIONS ***/
    triggerSynth(note) {
        this.polySynth.triggerAttackRelease(note, this.noteLength);
    }

    setFilter(value) {
        let calculatedFrequency = (value + 1) / 2 * 5000
        this.filter.frequency.value = calculatedFrequency
    }

    setNoteLength(value) {
        let numberOfLengthOptions = this.noteLengthOptions.length - 1
        let position = Math.round(((value + 1) / 2) * numberOfLengthOptions)
        this.noteLength = this.noteLengthOptions[position]

    }

    setSynthADSR(value) {
        this.polySynth.set({
            "envelope": {
                "sustain": (this._normalizeRange(value) * 0.9) + 0.1,
                "attack": (this._normalizeRange(value) * 0.2)
            }
        });
    }

    setOscillatorType(value) {
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
        this.panLfo.set("max", this._normalizeRange(valueX) * this._normalizeRange(valueX))
        this.panLfo.frequency.value = this._normalizeRange(valueY) * 8

    }

    //Delay
    setDelayFeedback(value) {
        if (this.delayCounter % 35) {
            this.delay.feedback.value = (this._normalizeRange(value)) * 0.9
        }
        this.delayCounter++
    }

    setDelayWet(value) {
        this.delay.wet.value = this._normalizeRange(value)
    }

    //Reverb

    setReverbWet(value) {
        if (this.reverbCounter % 50) {
            this.reverb.wet.value = (this._normalizeRange(value)) * 0.9
        }
        this.reverbCounter++
    }



    /*** RECORDER FUNCTIONS ***/
    startStopRecording() {
        if (!this.recorderStarted) {
            this.recorder.start()
            this.recorderStarted = true
        } else {
            this.recorder.stop()
        }

        this.recorder.ondataavailable = evt => this.chunks.push(evt.data);
        this.recorder.onstop = evt => {
            console.log(evt)
            let blob = new Blob(this.chunks, {type: 'audio/ogg; codecs=opus'});
            console.log(blob)
            this.fileSaver.saveAs(blob)

        };
    }


    //INTERNAL FUNCTIONS
    _normalizeRange(value) {
        return ((value + 1) / 2)
    }

}


