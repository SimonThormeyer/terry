export class Looper {

    constructor() {
        this.events = [];
        this.startTime = performance.now();
        this.duration = undefined;
        this.timeouts = [];
        this.muted = false;
        this.stopped = true;
        this.nextEventId = 1;
        this.pauseTime = 0;
        this.playStartTime = undefined;
        this.mainLoopTimeout = undefined;
        this._simulateCanvasClick = undefined;
        this.canvasID = 0;
    }

    addEvents(events) {
        this.events.push(events);
    }

    stopRecording() {
        this.duration = performance.now() - this.startTime;
        this.play();
    }

    getCurrentTime() {
        if (this.stopped) {
            return this.pauseTime;
        }
        return (performance.now() - this.playStartTime) % this.duration;
    }

    /** 
    * Start looping the added events.
    */
    play() {
        const _repeatLoop = () => {
            this.timeouts = [];
            for (let event of this.events) {
                if (event.action) {
                    this.timeouts.push(
                        setTimeout(() => {
                            event.action();
                        }, event.time)
                    );
                }
            }

            this.mainLoopTimeout = setTimeout(() => _repeatLoop(), this.duration);
        }

        if (this.stopped) {
            this.playStartTime = performance.now();
            for (let event of this.events) {
                if (!event.id) {
                    event.id = this.nextEventId;
                    this.nextEventId += 1;
                }
                this._updateEvent(event);
            }
            this.stopped = false;
            _repeatLoop();
        }
    }

    /** 
    * Stop the looper by clearing all running Timeouts.
    */
    stop() {
        if (!this.stopped) {
            for (let timeout of this.timeouts) {
                clearTimeout(timeout);
            }
            clearTimeout(this.mainLoopTimeout);
            this.stopped = true;
        }
    }

    /** 
    * Mute the looper.
    */
    toggleMute() {
        this.muted = !this.muted;
        for (let event of this.events) {
            this._updateEvent(event);
        }
    }

    /** 
    * Stops the looper at current time.
    */
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

    /** 
    * Set the ID of the canvas the looper belongs to. This should be done by the canvas.
    * @param {number} id - the canvas ID
    */
    setCanvasId(id) {
        this.canvasID = id;
    }

    /** 
    * returns all information that is needed for persistence of the looper.
    * @return {JSON} canvasId, duration, muted, stopped, playStartTime, pauseTime, currentTime, events.
    */
    getLooper() {
        let exportedEvents = []
        // calculate new event times - new starting point is now
        let currentTime = this.getCurrentTime();
        for (let event of this.events) {
            let exportedEvent = JSON.parse(JSON.stringify(event));
            if (event.time >= currentTime) {
                exportedEvent.time = event.time - currentTime;
            } else {
                exportedEvent.time = event.time + this.duration - currentTime;
            }
            exportedEvents.push(exportedEvent);
        }
        return {
            'canvasId': this.canvasID,
            'duration': this.duration,
            'muted': this.muted,
            'stopped': this.stopped,
            'playStartTime': this.playStartTime,
            'pauseTime': this.pauseTime,
            'currentTime': currentTime,
            'events': exportedEvents
        }
    }

    /** 
    * Do not use outside of Looper class
    */
    _updateEvent(event) {
        //inserts event.time and updates event.action: if looper is muted, do nothing!
        event.time = event.time >= 0 ? event.time : event.timestamp - this.startTime;
        // if (!(event.time >= 0)) {
        //     event.time = event.timestamp - this.startTime;
        // }
        let action = (event.type === "canvasClick") ?
            () => { // simulate a click on canvas
                if (!this.muted) { // do nothing on canvas if looper is muted
                    this._simulateCanvasClick([event.x, event.y])
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