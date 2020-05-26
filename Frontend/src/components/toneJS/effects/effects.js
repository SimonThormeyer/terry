import Tone from "tone";

export class Effects {

    constructor() {

        this.limiter = new Tone.Limiter(-1).toMaster()
        this.volume = new Tone.Volume(-12).connect(this.limiter);
        this.delay = new Tone.PingPongDelay().connect(this.volume)
        this.start = new Tone.Volume(-12).connect(this.limiter);

    }

    setDelay(value) {
        this.delay = new Tone.PingPongDelay(8n).chain(this.volume)
        this.delay.wet.value = (value * 50) + 50
        //this.delay.set("wet",(value * 50) + 50)
        //console.log((value * 50) + 50)

        //console.log(this.delay)

        //this.delay.set('feedback', this.feebackValue);
        //this.delay.set('wet',value)

    }
}