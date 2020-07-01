import React from 'react';
import { useGlobalState } from "../GlobalState"
import Loopicon from '../components/loopicon';

//wrapper component for the Loopicon component
function Loopcontrols() {

    const [runningLoopers] = useGlobalState('runningLoopers');
    const [canvasId] = useGlobalState('canvasId');

    return (
        < div className="loopcontrols" >
            {
                Array.from(runningLoopers.keys()).map((id) => {
                    return <div key={`loopControl__${id}`}>
                        {/* show controls only for loopers of current canvas */}
                        {runningLoopers.get(id).canvasID === canvasId &&
                            <Loopicon id={id}/>}
                    </div>
                })
            }

        </div >
    );
}

export default Loopcontrols;

