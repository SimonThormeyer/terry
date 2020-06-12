export class RandomNotes {

    constructor(){
        this.timeout = undefined;
        this._simulateCanvasClick = undefined;
        this.running = false;
    }

    toggleRandomNote () {
        if(!running) {
            this.timeout = setTimeout(loopRandomNote(),)
        } else {
            clearTimeout(this.timeout);
        }
    };
    
}