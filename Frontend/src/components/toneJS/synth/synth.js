import Tone from "tone";
import {Effects} from "../effects/effects";

export class Synth {

    constructor() {
        this.effects = new Effects()
        this.polySynth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.effects.filter);
    }

    triggerSynth(note) {
        this.polySynth.triggerAttackRelease(note, "2n");
    }
}


