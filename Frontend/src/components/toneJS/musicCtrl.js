import {IsomorphicLayout} from "./scales/isomorphicLayout";
import {SynthAndEffects} from "./synthAndEffects/synthAndEffects";
import {Soundbed} from "./soundbed/soundbed";


export class MusicCtrl {
    soundBed;
    adcStarted = false

    constructor() {
        this.isomorphicLayout = new IsomorphicLayout()
        this.synthAndEffects = new SynthAndEffects()
        this.soundBed = new Soundbed()
    }

    //UTILITY
    startAudioContext(){
        this.synthAndEffects = new SynthAndEffects()
        this.adcStarted = true
    }

    //SYNTH
    triggerSynth(valueX, valueY) {
        this.note = this.isomorphicLayout.coordinateToNote(valueX,valueY)
        this.synthAndEffects.triggerSynth(this.note);
    }

    startStopSoundbed(){
        this.synthAndEffects.startStopRecording()
        //this.soundBed.playPauseSoundbed()
    }

    setParameterSynth(valueX, valueY) {
        this.synthAndEffects.setFilter(valueX)
        this.synthAndEffects.setNoteLength(valueY)
        //this.synthAndEffects.setOscillatorType(valueX)
        this.synthAndEffects.setSynthADSR(valueY)
    }

    setParameterEffect(valueX, valueY) {
        this.synthAndEffects.setDelayFeedback(valueX)
        this.synthAndEffects.setDelayWet(valueY)
        //this.synthAndEffects.setReverbWet(valueX)
        this.synthAndEffects.setPanningEffect(valueX,valueY)
    }

    setParameterMusic(valueX, valueY) {
        this.isomorphicLayout.changeScale(valueX);
        this.isomorphicLayout.changeOctave(valueY);
    }

    startRecording(){
        if (this.adcStarted) {
            this.synthAndEffects.startRecording()
        }
    }





}