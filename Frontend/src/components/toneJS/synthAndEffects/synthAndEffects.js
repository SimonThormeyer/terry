import Tone from "tone";
import {Effects} from "../effects/effects";

export class SynthAndEffects {

    constructor() {

        // Settings
        this.noteLengthOptions = ["32n","16n","8n","4n","2n","1n"]
        this.waveforms = ["sine","saw","pulse"]
        this.noteLength = this.noteLengthOptions[2]

        // INSTRUMENT_CHAIN
        //Effects
        this.limiter = new Tone.Limiter(-1).toMaster()
        this.volume = new Tone.Volume(-12).connect(this.limiter);
        this.delay = new Tone.PingPongDelay(0.1,0).connect(this.volume)

        //Synth
        this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.delay)
        this.polySynth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.filter);

    }


    //SYNTH FUNCTIONS
    triggerSynth(note) {
        this.polySynth.triggerAttackRelease(note, this.noteLength);
    }

    setFilter(value){
        let calculatedFrequency = (value+1)/2 * 5000
        // console.log("BEFORE: " + this.filter.frequency.value)
        this.filter.frequency.value = calculatedFrequency
        // console.log("AFTER: " + this.filter.frequency.value)
    }

    setNoteLength(value){
        let numberOfLengthOptions = this.noteLengthOptions.length-1
        let position = Math.round(((value+1)/2)*numberOfLengthOptions)
        this.noteLength = this.noteLengthOptions[position]
        // console.log("Notelength: " + position)
    }


    // EFFECT FUNCTIONS
    setDelay(value) {
        console.log(this.delayCounter)
        let valueIntoNormalRange = (((value + 1) / 2))
        // console.log("value: " + valueIntoNormalRange)
        this.delay.feedback.value = valueIntoNormalRange
        // console.log("FEEDBACK: " + this.delay.wet.value)


    }



}


