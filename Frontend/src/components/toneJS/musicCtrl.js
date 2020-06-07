import {IsomorphicLayout} from "./scales/isomorphicLayout";
import {SynthAndEffects} from "./synthAndEffects/synthAndEffects";
import {Soundbed} from "./soundbed/soundbed";
import {Recorder} from "./recorder/recorder";


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
        this.recorder = new Recorder()
    }

    triggerSynth(valueX, valueY) {
        this.note = this.isomorphicLayout.coordinateToNote(valueX,valueY)
        this.synthAndEffects.triggerSynth(this.note);
    }

    startStopSoundbed(){
        this.recorder.startRecording()
        this.soundBed.playPauseSoundbed()
    }

    setParameterSynth(valueX, valueY) {
        this.synthAndEffects.setFilter(valueX)
        this.synthAndEffects.setNoteLength(valueY)
    }

    setParameterEffect(valueX, valueY) {
        this.synthAndEffects.setDelayFeedback(valueX)
        this.synthAndEffects.setDelayWet(valueY)
    }

    setParameterMusic(valueX, valueY) {
        this.recorder.stopRecording()
        //this.isomorphicLayout.set('detune',valueX)
    }

    startRecording(){
        this.recorder.startRecording()
    }

    stopRecording(){
        this.recorder.stopRecording()
    }



}