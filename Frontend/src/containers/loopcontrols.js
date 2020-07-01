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

    let looperIDs = [];

    //----------- KEY-BINDINGS ------------
    const handleKeyDown = event => {
            if (overlayIsOpen) return;
            // start/stop muting with Number Keys
            let keyNumber = event.keyCode - 49;
            if (keyNumber < 10 && keyNumber < looperIDs.length) {
                if (runningLoopers.get(looperIDs[keyNumber])) {
                    runningLoopers.get(looperIDs[keyNumber]).toggleMute();
                    forceUpdate(!updated); // forces children to re-render and thus update their state (show that they are muted)
                }
            }
        }

    useEventListener("keydown", handleKeyDown);

    return (
        < div className="loopcontrols" >
            {
                Array.from(runningLoopers.keys()).map((id) => {
                    // hotkeys for muting only avaiable for current track
                   if(runningLoopers.get(id).canvasID === canvasId) looperIDs.push(id);
                    return <div key={`loopControl__${id}`}>
                        {/* show controls only for loopers of current canvas */}
                        {runningLoopers.get(id).canvasID === canvasId &&
                            <Loopicon id={id} muted={runningLoopers.get(id).muted} />}
                    </div>
                })
            }

        </div >
    );
}

export default Loopcontrols;

