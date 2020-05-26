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
        this.nextEventId = 1;
        this.pauseTime = 0;
        this.playStartTime = undefined;
        this.mainLoopTimeout = undefined;
    }

    addEvents(events) {
        this.events.push(events);
    }

    stopRecording(endTime) {
        this.endTime = endTime;
        this.duration = this.endTime - this.startTime;
        this.play();
    }

    getCurrentTime() {
        if (this.stopped) {
            return this.pauseTime;
        }
        return (performance.now() - this.playStartTime) % this.duration;
    }

    play() {
        if (this.stopped) {
            this.playStartTime = performance.now();
            // register all events - TODO: evaluate precision of this method
            console.log(`looper play() - duration: ${this.duration}, events #: ${this.events.length}`)
            for (let event of this.events) {
                if (!event.id) {
                    event.id = this.nextEventId;
                    this.nextEventId += 1;
                }
                this._updateEvent(event);
                console.log(`event id: ${event.id} event time: ${event.time}`);
            }
            this.stopped = false;
            this._repeatLoop();
        } 
    }


    _repeatLoop() {
        console.log(`DURATION: ${this.duration}`)
        this.timeouts = [];
        for (let event of this.events) {
            this.timeouts.push(
                setTimeout(() => {
                event.action();
            }, event.time)
            );
        }
        this.mainLoopTimeout = setTimeout(() => this._repeatLoop(), this.duration);
    }
 

    stop() {
        if (!this.stopped) {
            for (let timeout of this.timeouts) {
                clearTimeout(timeout);
            }
            clearTimeout(this.mainLoopTimeout);
            for (let interval of this.intervals) {
                clearInterval(interval);
            }
            this.stopped = true;
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        for (let event of this.events) {
            this._updateEvent(event);
        }
    }

    pause() {
        if (!this.stopped) {
            this.stop()
            // calculate new event times - new starting point is now
            this.pauseTime = (performance.now() - this.playStartTime) % this.duration;
            for (let event of this.events) {
                if (event.time >= this.pauseTime) {
                    event.time = event.time - this.pauseTime;
                } else {
                    event.time = event.time + this.duration - this.pauseTime;
                }
            }
        }
    }



    //underscore methods are not meant to be used outside of this class

    _simulateCanvasClick(x, y) {
        this.musicCtrl.triggerSynth(x, y);
    }

    _updateEvent(event) {
        //inserts event.time and updates event.action: if looper is muted, do nothing!
        // event.time = event.time >= 0 ? event.time : event.timestamp - this.startTime;
        if (!(event.time >= 0)) {
            console.log(`inserting event time`)
            event.time = event.timestamp - this.startTime;
        }
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