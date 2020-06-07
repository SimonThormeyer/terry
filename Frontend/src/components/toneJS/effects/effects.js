import Tone from "tone";

export class Effects {

    constructor() {
        this.limiter = new Tone.Limiter(-1).toMaster()
        this.volume = new Tone.Volume(-12).connect(this.limiter);
        this.delay = new Tone.PingPongDelay(0.2, 0.7).connect(this.volume)
        this.filter = new Tone.Filter(400, 'lowpass', -12).connect(this.delay);

    }

    setDelay(value) {
        //setting value to 0.9 to avoid extreme feedbacking
        this.feebackValue = value*0.9
        console.log(this.feebackValue)
        console.log(this.delay)
        this.delay.set('feedback', this.feebackValue);
        this.delay.set('wet',value)

    }
}