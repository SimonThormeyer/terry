import { MusicCtrl } from "./musicCtrl"
import {SynthAndEffects} from "./synthAndEffects/synthAndEffects";


export class Marimba extends MusicCtrl {

    constructor() {
        super()
        this.synthAndEffects = new SynthAndEffects("Marimba")

        //this.synthAndEffects.changeMainSoundSource()
    }


    setParameterSynth(valueX, valueY) {
        this.synthAndEffects.setFilter(valueX, valueY)
    }
}