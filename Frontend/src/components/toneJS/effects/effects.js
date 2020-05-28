import Tone from "tone";

export class Effects {

    constructor() {

        this.limiter = new Tone.Limiter(-1).toMaster()
        this.volume = new Tone.Volume(-12).connect(this.limiter);
        this.delay = new Tone.PingPongDelay(0.1,0.8).connect(this.volume)
        this.start = new Tone.Volume(-12).connect(this.delay);

    }

    setDelay(value) {
        this.delay.wet.value = ((value + 1)/2)
        console.log(this.delay.wet.value)

        //this.delay.set('feedback', this.feebackValue);
        //this.delay.set('wet',value)

    }
}