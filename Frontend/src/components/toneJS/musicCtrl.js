import {IsomorphicLayout} from "./scales/isomorphicLayout";
import {SynthAndEffects} from "./synthAndEffects/synthAndEffects";
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
        this.synthAndEffects = new SynthAndEffects()
        this.soundBed = new Soundbed()
        this.effect = new Effects()

    }

    triggerSynth(valueX, valueY) {
        this.note = this.isomorphicLayout.coordinateToNote(valueX,valueY)
        this.synthAndEffects.triggerSynth(this.note);
    }

    startStopSoundbed(){
        this.soundBed.playPauseSoundbed()
    }

    setParameterSynth(valueX, valueY) {
        this.synthAndEffects.setFilter(valueX)
        this.synthAndEffects.setNoteLength(valueY)
    }

    setParameterEffect(valueX, valueY) {
        this.synthAndEffects.setDelay(valueX)

    }

    setParameterMusic(valueX, valueY) {
        //this.isomorphicLayout.set('detune',valueX)
    }




}