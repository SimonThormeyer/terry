export class Looper {
    
    constructor(startTime, musicCtrl) {
        this.musicCtrl = musicCtrl;
        this.events = [];
        this.startTime = startTime;
        this.endTime = undefined;
        this.duration = undefined;
        this.intervals = []
    }

    addEvents(events) {
        this.events.push(events);
    }

    stopRecording(endTime) {
        this.endTime = endTime;
        this.duration = this.endTime - this.startTime;
    }

    play() {
        // register all events - TODO: evaluate precision of this method
        for(let event of this.events) {
            event.time = event.timestamp - this.startTime; 
            let action = (event.type === "canvasClick") ? 
                () => {this.musicCtrl.triggerSynth(event.x, event.y)} 
                : () => {console.log(`shiftDot by x: ${event.x}, y: ${event.y}`)};
            setTimeout(() => { 
                action();
                this.intervals.push(setInterval(() => {
                    action();
                }, this.duration));
            }, event.time);
        }
    }

    stop() {
        for(let interval of this.intervals) {
            clearInterval(interval);
        }
    }

}