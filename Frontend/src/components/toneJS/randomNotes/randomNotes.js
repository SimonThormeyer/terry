export class RandomNotes {

    constructor() {
        this.time = undefined;
        this.xAxis = 0;
        this.yAxis = 0;
        this._simulateCanvasClick = undefined;
        this.running = false;
        this.timeout = undefined;
    }

    toggleRandomNotes() {
        if (this.running === false) {
            this.running = true;
            this.playRandomNote();
        } else {
            this.running = false;
            clearTimeout(this.timeout);
        }
    }

    playRandomNote() {
        if (this.running === true) {
            let xAxis = Math.random();
            let yAxis = Math.random();
            if (this._simulateCanvasClick) {
                this._simulateCanvasClick([xAxis, yAxis]);
            }
            let time = Math.floor((Math.random() * 3000) + 50);
            this.timeout = setTimeout(() => this.playRandomNote(), time);
        }
        ;
    }
}