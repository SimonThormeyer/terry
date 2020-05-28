import Tone from "tone";

export class Synth {

    constructor() {
        this.filter = new Tone.Filter(400, 'lowpass', -12).toMaster()
        this.polySynth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.filter);

    }

    triggerSynth(note) {
        this.polySynth.triggerAttackRelease(note, "16n");
    }

    setSynthValues(value){
        let calculatedFrequency = (value+1) * 5000
        console.log("BEFORE: " + this.filter.frequency.value)
        //this.polySynth.set("detune", (value+1) * 500)
        this.filter.frequency.value = calculatedFrequency
        console.log("AFTER: " + this.filter.frequency.value)
    }
}


