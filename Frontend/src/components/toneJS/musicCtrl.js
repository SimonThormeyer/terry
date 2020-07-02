import {IsomorphicLayout} from "./scales/isomorphicLayout";
import {SynthAndEffects} from "./synthAndEffects/synthAndEffects";


export class MusicCtrl {

    constructor() {
        this.isomorphicLayout = new IsomorphicLayout()
        this.synthAndEffects = new SynthAndEffects()
    }

    triggerSynth(valueX, valueY) {
        this.note = this.isomorphicLayout.coordinateToNote(valueX,valueY)
        this.synthAndEffects.triggerSynth(this.note);
    }

    setParameterSynth(valueX, valueY) {
        this.synthAndEffects.setFilter(valueX, valueY)
        this.synthAndEffects.setNoteLength(valueY)
        // this.synthAndEffects.setOscillatorType(valueX)
        this.synthAndEffects.setADSR(valueY)
    }

    setParameterEffect(valueX, valueY) {
        this.synthAndEffects.setDelayFeedback(valueX)
        this.synthAndEffects.setDelayWet(valueY)
        this.synthAndEffects.setReverbWet(valueX)
        this.synthAndEffects.setPanningEffect(valueX,valueY)
    }

    setParameterMusic(valueX, valueY) {
        this.isomorphicLayout.changeScale(valueX);
        this.isomorphicLayout.changeOctave(valueY);
    }

    startStopRecorder(){
        this.synthAndEffects.startStopRecording()
    }

    saveRecording(){
        this.synthAndEffects.saveRecording()
    }

}