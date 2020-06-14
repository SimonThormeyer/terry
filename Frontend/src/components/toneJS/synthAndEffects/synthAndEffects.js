let Tone;

export class SynthAndEffects {

    constructor() {
        this.initialized = false;
        import('tone').then(module => {
            Tone = module.default;
            // Settings
            this.noteLengthOptions = ["64n", "32n", "16n", "8n", "4n", "2n", "1n"]
            this.waveforms = ["sine6", "triangle6"]
            this.noteLength = this.noteLengthOptions[2]


            // INSTRUMENT_CHAIN
            //Effects
            this.limiter = new Tone.Limiter(-1).toMaster()
            this.volume = new Tone.Volume(-5).connect(this.limiter);
            this.reverb = new Tone.Reverb(2).connect(this.volume)
            this.pan = new Tone.Panner(1).connect(this.reverb)
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
            this.reverb.generate() //reverb needs to be initialised
            this.reverb.wet.value = 0.1

            this.initialized = true;
        })
    }

    //SYNTH FUNCTIONS
    triggerSynth(note) {
        if(!this.initialized) return;
        this.polySynth.triggerAttackRelease([note, "G5", "E6"], this.noteLength);
    }

    setFilter(valueX, valueY) {
        if(!this.initialized) return;
        let calculatedFrequency = (this._normalizeRange(valueX) * 1300) + 200
        this.filter.frequency.value = calculatedFrequency
        // compensate volume when the filter opens up
        this.volume.volume.value = ((-1) * (this._normalizeRange(valueX)) * 5) - 5

    }

    setNoteLength(value) {
        if(!this.initialized) return;
        let numberOfLengthOptions = this.noteLengthOptions.length - 1
        let position = Math.round(((value + 1) / 2) * numberOfLengthOptions)
        this.noteLength = this.noteLengthOptions[position]

    }

    setSynthADSR(value) {
        if(!this.initialized) return;
        this.polySynth.set({
            "envelope": {
                "sustain": (this._normalizeRange(value) * 0.9) + 0.1,
                "attack": (this._normalizeRange(value) * 0.2)
            }
        });
    }

    setOscillatorType(value) {
        if(!this.initialized) return;
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


    // EFFECT FUNCTIONS
    //Panning
    setPanningEffect(valueX, valueY) {
        if(!this.initialized) return;
        this.panLfo.set("max", this._normalizeRange(valueX) * this._normalizeRange(valueX))
        this.panLfo.frequency.value = this._normalizeRange(valueY) * 8

    }

    //Delay
    setDelayFeedback(value) {
        if(!this.initialized) return;
        if (this.delayCounter % 35) {
            this.delay.feedback.value = (this._normalizeRange(value)) * 0.9
        }
        this.delayCounter++
    }

    setDelayWet(value) {
        if(!this.initialized) return;
        this.delay.wet.value = this._normalizeRange(value)
    }

    //Reverb
    setReverbWet(value) {
        if(!this.initialized) return;
        if (this.reverbCounter % 50) {
            this.reverb.wet.value = (this._normalizeRange(value)) * 0.9
        }
        this.reverbCounter++
    }


    //INTERNAL FUNCTIONS
    _normalizeRange(value) {
        return ((value + 1) / 2)
    }

}


