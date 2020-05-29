import Tone from "tone";

export class Effects {

    constructor() {

        this.limiter = new Tone.Limiter(-1).toMaster()
        this.volume = new Tone.Volume(-12).connect(this.limiter);

        this.delay = new Tone.PingPongDelay(0.1,0).connect(this.volume)

        this.delayCounter = 0

    }

    setDelay(value) {
        console.log(this.delayCounter)
        let valueIntoNormalRange = (((value + 1) / 2))
        console.log("value: " + valueIntoNormalRange)
        this.delay.feedback.value = valueIntoNormalRange
        console.log("FEEDBACK: " + this.delay.wet.value)


        //this.delay.set('feedback', this.feebackValue);
        //this.delay.set('wet',value)

    }
}