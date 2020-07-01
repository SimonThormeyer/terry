import React, { useState } from 'react';
import { useGlobalState } from "../GlobalState"
import Loopicon from '../components/loopicon';
import useEventListener from "./../UseEventListener";

//wrapper component for the Loopicon component
function Loopcontrols() {

    const [runningLoopers] = useGlobalState('runningLoopers');
    const [canvasId] = useGlobalState('canvasId');
    const [overlayIsOpen,] = useGlobalState('overlayIsOpen');
    const [updated, forceUpdate] = useState(true);

    // build an array containing only the keys of the Loopers belonging to current track / canvas
    let displayedLoopersIDs = [];
    Array.from(runningLoopers.keys()).forEach((id) => {
        if(runningLoopers.get(id).canvasID === canvasId)
        displayedLoopersIDs.push(id);
    })

    //----------- KEY-BINDINGS ------------
    const handleKeyDown = event => {
            if (overlayIsOpen) return;
            // start/stop muting with Number Keys
            let keyNumber = event.keyCode - 49;
            if (keyNumber < 10 && keyNumber < displayedLoopersIDs.length) {
                if (runningLoopers.get(displayedLoopersIDs[keyNumber])) {
                    runningLoopers.get(displayedLoopersIDs[keyNumber]).toggleMute();
                    forceUpdate(!updated); // forces children to re-render and thus update their state (show that they are muted)
                }
            }
        }

    useEventListener("keydown", handleKeyDown);

    return (
        < div className="loopcontrols" >
            {
               displayedLoopersIDs.map((id) => {
                    return <Loopicon id={id} key={`loop_${id}`} muted={runningLoopers.get(id).muted} />
                })
            }

        </div >
    );
}

export default Loopcontrols;

