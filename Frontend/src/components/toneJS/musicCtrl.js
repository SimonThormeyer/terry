import {IsomorphicLayout} from "./scales/isomorphicLayout";
import {SynthAndEffects} from "./synthAndEffects/synthAndEffects";
import {Soundbed} from "./soundbed/soundbed";


/*
    IMPORT:
    import {MusicCtrl} from './musicCtrl';

    INSTANTIATE:
    let musicCtrl = new musicCtrl();

    CALL FUNCTION:
    */

export class MusicCtrl {
    soundBed;

    constructor() {
        this.isomorphicLayout = new IsomorphicLayout()
        this.synthAndEffects = new SynthAndEffects()
        this.soundBed = new Soundbed()
    }

    triggerSynth(valueX, valueY) {
        this.note = this.isomorphicLayout.coordinateToNote(valueX,valueY)
        this.synthAndEffects.triggerSynth(this.note);
    }

    startStopSoundbed(){
        this.soundBed.playPauseSoundbed()
    }

    setParameterSynth(valueX, valueY) {
        this.synthAndEffects.setFilter(valueX, valueY)
        this.synthAndEffects.setNoteLength(valueY)
        this.synthAndEffects.setOscillatorType(valueX)
        this.synthAndEffects.setSynthADSR(valueY)
    }

    setParameterEffect(valueX, valueY) {
        this.synthAndEffects.setDelayFeedback(valueX)
        this.synthAndEffects.setDelayWet(valueY)
        this.synthAndEffects.setReverbWet(valueX)
        this.synthAndEffects.setPanningEffect(valueX,valueY)
    }

    setParameterMusic(valueX, valueY) {
        //this.isomorphicLayout.set('detune',valueX)
    }




}