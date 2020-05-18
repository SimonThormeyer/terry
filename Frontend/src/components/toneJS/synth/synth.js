import Tone from "tone";

export class Synth {

    constructor() {
        this.limiter = new Tone.Limiter(-1).toMaster()
        this.volume = new Tone.Volume(-12).connect(this.limiter);
        this.delay = new Tone.PingPongDelay(0.2, 0.7).connect(this.volume)
        this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.delay);
        this.polySynth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.filter);
    }

    triggerSynth(note) {
        this.polySynth.triggerAttackRelease(note, "2n");
    }
}


