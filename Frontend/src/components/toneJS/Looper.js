export class Looper {

    constructor(startTime, musicCtrl) {
        this.musicCtrl = musicCtrl;
        this.events = [];
        this.startTime = startTime;
        this.endTime = undefined;
        this.duration = undefined;
        this.intervals = [];
        this.timeouts = [];
        this.muted = false;
        this.stopped = true;
        this.nextEventId = 0;
    }

    addEvents(events) {
        this.events.push(events);
    }

    stopRecording(endTime) {
        this.endTime = endTime;
        this.duration = this.endTime - this.startTime;
    }

    play() {
        if (this.stopped) {
            // register all events - TODO: evaluate precision of this method
            console.log(`looper play() - duration: ${this.duration}, events #: ${this.events.length}`)
            for (let event of this.events) {
                if(!event.id) {
                    event.id = this.nextEventId;
                    this.nextEventId += 1;
                } 
                this._updateEvent(event);
                console.log(`event id: ${event.id} event time: ${event.time}`)
                this.timeouts.push(setTimeout(() => {
                    event.action()
                    this.intervals.push(setInterval(() => {
                        event.action();
                    }, this.duration));
                }, event.time));
            }
        }
        this.stopped = false;
    }

    stop() {
        if (!this.stopped) {
            for(let timeout of this.timeouts) {
                clearTimeout(timeout);
            }
            for (let interval of this.intervals) {
                clearInterval(interval);
            }
        }
        this.stopped = true;

    }

    toggleMute() {
        this.muted = !this.muted;
        for (let event of this.events) {
            this._updateEvent(event);
        }
    }

    pause() {
        if(!this.stopped) {
        this.stop()
        // 1. reorder event times - new starting point is now
        //current point of time in loop
        //let currentLoopTime = (Date.now() - this.startTime) % this.duration;
        console.log(`pause() currentLoopTime: ${this.currentLoopTime()}, duration: ${this.duration}`)
        for (let event of this.events) {
            
            let newTime = this.duration - this.currentLoopTime() + event.time;
            console.log(`event id:${event.id} old time: ${event.time}, new time: ${newTime}`)
            event.time = newTime;

        }
        }
    }

    currentLoopTime() {
        return (Date.now() - this.startTime) % this.duration;
    }

    //underscore methods are not meant to be used outside of this class

    _simulateCanvasClick(x, y) {
        this.musicCtrl.triggerSynth(x, y);
    }

    _updateEvent(event) {
        //inserts event.time and updates event.action
        event.time = event.time ? event.time : event.timestamp - this.startTime;
        let action = (event.type === "canvasClick") ?
            () => { // simulate a click on canvas
                if (!this.muted) { // do nothing on canvas if looper is muted
                    this._simulateCanvasClick(event.x, event.y)
                }
            } : //event.type == dotShift: simulate a shift of an effectDot 
            () => {
                if (!this.muted) {
                    console.log(`shiftDot by x: ${event.x}, y: ${event.y}`)
                }
            };
        event.action = action; //save action in event obj
    }

}