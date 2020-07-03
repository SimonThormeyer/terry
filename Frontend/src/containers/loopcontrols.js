import React from 'react';
import { useGlobalState } from "../GlobalState"
import Loopicon from '../components/loopicon';

//wrapper component for the Loopicon component
function Loopcontrols() {

    const [runningLoopers] = useGlobalState('runningLoopers');
    const [canvasId] = useGlobalState('canvasId');

    // build an array containing only the keys of the Loopers belonging to current track / canvas
    let displayedLoopersIDs = [];
    Array.from(runningLoopers.keys()).forEach((id) => {
        if(runningLoopers.get(id).canvasID === canvasId)
        displayedLoopersIDs.push(id);
    })

    return (
        < div className="loopcontrols" >
            {
               displayedLoopersIDs.map((id, index) => {
                    return <Loopicon id={id} positionOnScreen={index} key={`loop_${id}`}/>
                })
            }
        </div >
    );
}

export default Loopcontrols;

