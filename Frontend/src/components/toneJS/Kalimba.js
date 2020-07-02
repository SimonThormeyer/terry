import { MusicCtrl } from "./musicCtrl"
import {SynthAndEffects} from "./synthAndEffects/synthAndEffects";


export class Kalimba extends MusicCtrl {

    constructor() {
        super()
        this.synthAndEffects = new SynthAndEffects("Kalimba")

    }


    setParameterSynth(valueX, valueY) {
        this.synthAndEffects.setFilter(valueX, valueY)
    }
}