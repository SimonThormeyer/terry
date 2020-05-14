import Tone from "tone";

/*

    IMPORT:
    import {Synth} from './synth';

    INSTANTIATE:
    let synth = new Synth();

    CALL FUNCTION:
    synth.trigger(C4, "1n");

    */

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
        this.volume.set('volume',value)
    }

    setParameter1(value) {
        this.synth.set('detune',value)
    }

    trigger(note, length) {
        this.synth.triggerAttackRelease([note], "1n");

    }

}