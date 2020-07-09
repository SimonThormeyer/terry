import { IsomorphicLayout } from "./scales/isomorphicLayout";
import { SynthAndEffects } from "./synthAndEffects/synthAndEffects";
import {Recorder} from "./Recorder";


export class MusicCtrl {

    constructor(callbackAfterInit) {
        this.isomorphicLayout = new IsomorphicLayout()
        this.synthAndEffects = new SynthAndEffects()
        this.recorder = new Recorder()
    }

    initialize() {
        return new Promise((resolve, reject) => {
            this.synthAndEffects.initialize().then(() =>
                resolve()
            ).catch(e =>
                reject(e)
            )
            this.recorder.initialize().then(() =>
                resolve()
            ).catch(e =>
                reject(e)
            )

        })
    }

    triggerSynth(valueX, valueY) {
        this.note = this.isomorphicLayout.coordinateToNote(valueX, valueY)
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
        this.synthAndEffects.setPanningEffect(valueX, valueY)
    }

    setParameterMusic(valueX, valueY) {
        this.isomorphicLayout.changeScale(valueX);
        this.isomorphicLayout.changeOctave(valueY);
    }

    startStopRecorder() {
        this.recorder.startStopRecording()
    }

    saveRecording() {
        this.recorder.saveRecording()
    }

    setVolume(value){
        this.synthAndEffects.setcontrollableVolume(value)
    }

}