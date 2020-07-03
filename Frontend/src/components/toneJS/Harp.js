import { MusicCtrl } from "./musicCtrl"
import {SynthAndEffects} from "./synthAndEffects/synthAndEffects";


export class Harp extends MusicCtrl {

    constructor() {
        super()
        this.synthAndEffects = new SynthAndEffects("Harp")

    }


    setParameterSynth(valueX, valueY) {
        this.synthAndEffects.setFilter(valueX, valueY)
    }
}