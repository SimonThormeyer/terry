import Tone from "tone";
import {Effects} from "../effects/effects";

export class Synth {

    constructor() {
        this.effects = new Effects()
        this.filter = new Tone.Filter(400, 'lowpass', -12).chain(this.effects.start, Tone.Master)
        //this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.effects.delay);
        this.polySynth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.filter);

    }

    triggerSynth(note) {
        this.polySynth.triggerAttackRelease(note, "16n");
    }

    setDetune(value){
        this.polySynth.set("detune", (value+1) * 500)
    }
}


