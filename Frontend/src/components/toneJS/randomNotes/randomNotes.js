import Tone from "tone";

export class RandomNotes {

    constructor(){
        this.polySynth = Tone.PolySynth(8, Tone.FMSynth, {
            oscillator: {
                type: "sine",
            }
        });

        this.timeOut = 0;
    }

    
}