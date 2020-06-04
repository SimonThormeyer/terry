import Tone from "tone";

export class SynthAndEffects {

    constructor() {

        // Settings
        this.noteLengthOptions = ["64n", "32n", "16n", "8n", "4n", "2n", "1n"]
        this.waveforms = ["sine", "triangle"]
        this.noteLength = this.noteLengthOptions[2]


        // INSTRUMENT_CHAIN
        //Effects
        this.limiter = new Tone.Limiter(-1).toMaster()
        this.volume = new Tone.Volume(-12).connect(this.limiter);
        this.reverb = new Tone.Reverb(2).connect(this.volume)
        this.delay = new Tone.PingPongDelay(0.1, 0).connect(this.reverb)

        //Synth
        this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.delay)
        this.polySynth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.filter);

        //UTILITY
        this.delayCounter = 0
        this.reverbCounter = 0

        // INITIALISING
        this.reverb.generate() //reverb needs to be initialised
        this.reverb.wet.value = 0.1
    }

    //SYNTH FUNCTIONS
    triggerSynth(note) {
        this.polySynth.triggerAttackRelease(note, this.noteLength);
    }

    setFilter(value) {
        let calculatedFrequency = (value + 1) / 2 * 1500
        // console.log("BEFORE: " + this.filter.frequency.value)
        this.filter.frequency.value = calculatedFrequency
        this.volume.volume.value = 1 - this._normalizeRange(value)


        // console.log("AFTER: " + this.filter.frequency.value)
    }

    setNoteLength(value) {
        let numberOfLengthOptions = this.noteLengthOptions.length - 1
        let position = Math.round(((value + 1) / 2) * numberOfLengthOptions)
        this.noteLength = this.noteLengthOptions[position]

    }

    setSynthADSR(value){
        this.polySynth.set({
            "envelope" : {
                "sustain" : this._normalizeRange(value),
                "attack" : (this._normalizeRange(value) * this._normalizeRange(value)) * 0.4
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


    // EFFECT FUNCTIONS
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
        if (this.reverbCounter % 35) {
            this.reverb.wet.value = (this._normalizeRange(value)) * 0.9
        }
        this.reverbCounter++
    }


    //INTERNAL FUNCTIONS
    _normalizeRange(value) {
        return ((value + 1) / 2)
    }

}


