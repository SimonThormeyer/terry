import Tone from "tone";




export class Synth {

    constructor() {
        this.volume = new Tone.Volume(-8).toMaster();
        this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.volume);
        this.synth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.filter);
    }

    setVolume(value) {
        console.log(value)
        this.volume.set('volume',value)
    }

    setParameter1(value) {
        console.log(value)
        this.synth.set('detune',value)
    }

    trigger(note, length) {
        console.log(`SYNTH SPIELT ${note}`)
        this.synth.triggerAttackRelease([note], "1n");

    }


}