import Tone from "tone";

export class Synth {

    constructor() {
        this.volume = new Tone.Volume(-8).toMaster();
        this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.volume);
        this.polySynth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.filter);
    }

    triggerSynth(note) {
        console.log('NOTE:' + note)
        this.polySynth.triggerAttackRelease(note, "8n");
    }
}


