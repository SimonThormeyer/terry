import {IsomorphicLayout} from "./scales/isomorphicLayout";
import {Synth} from "./synth/synth";

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
        this.isomorphicLayout = new IsomorphicLayout()
        this.synth = new Synth()
    }

    triggerSynth(valueX, valueY) {
        this.note = this.isomorphicLayout.coordinateToNote(valueX,valueY)
        this.synth.triggerSynth(this.note);
    }



    setParameterSynth(valueX, valueY) {
        // hier passiert SYNTH
        //this.synth.set('detune',valueX)
    }

    setParameterEffect(valueX, valueY) {
        //this.synth.set('detune',valueX)
    }

    setParameterMusic(valueX, valueY) {
        //this.synth.set('detune',valueX)
    }


}
