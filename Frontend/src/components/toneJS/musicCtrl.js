import {IsomorphicLayout} from "./scales/isomorphicLayout";
import {Synth} from "./synth/synth";
import {Soundbed} from "./soundbed/soundbed";
import {Effects} from "./effects/effects";



/*
    IMPORT:
    import {MusicCtrl} from './musicCtrl';

    INSTANTIATE:
    let musicCtrl = new musicCtrl();

    CALL FUNCTION:
    musicCtrl.triggerSynth(C4, "1n");
    */

export class MusicCtrl {
    soundBed;

    constructor() {
        this.isomorphicLayout = new IsomorphicLayout()
        this.synth = new Synth()
        this.soundBed = new Soundbed()
        this.effect = new Effects()

    }

    triggerSynth(valueX, valueY) {
        this.note = this.isomorphicLayout.coordinateToNote(valueX,valueY)
        this.synth.triggerSynth(this.note);
        this.setParameterEffect(1,0)

    }

    startStopSoundbed(){
        this.soundBed.playPauseSoundbed()
    }

    setParameterSynth(valueX, valueY) {
        this.synth.setSynthValues(valueX)
    }

    setParameterEffect(valueX, valueY) {
        this.effect.setDelay(valueX)

    }

    setParameterMusic(valueX, valueY) {
        //this.isomorphicLayout.set('detune',valueX)
    }




}