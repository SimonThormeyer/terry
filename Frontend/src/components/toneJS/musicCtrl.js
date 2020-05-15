import Tone from "tone";

/*

    IMPORT:
    import {MusicCtrl} from './musicCtrl';

    INSTANTIATE:
    let musicCtrl = new musicCtrl();

    CALL FUNCTION:
    musicCtrl.triggerSynth(C4, "1n");

    */

export class MusicCtrl {

    constructor() {
        this.volume = new Tone.Volume(-8).toMaster();
        this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.volume);
        this.synth = new Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        }).connect(this.filter);
    }

    triggerSynth(valueX, valueY) {
        console.log(valueX,valueY)
        this.synth.triggerAttackRelease(['C4'], "1n");
    }


    setVolume(value) {
        this.volume.set('volume',value)
    }

    setParameterSynth(valueX, valueY) {
        this.synth.set('detune',valueX)
    }

    setParameterEffect(valueX, valueY) {
        this.synth.set('detune',valueX)
    }

    setParameterMusic(valueX, valueY) {
        this.synth.set('detune',valueX)
    }


}