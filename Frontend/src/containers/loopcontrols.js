import React from 'react';
import { useGlobalState } from "../GlobalState"
import Loopicon from '../components/loopicon';

//wrapper component for the Loopicon component
function Loopcontrols() {

    const [runningLoopers] = useGlobalState('runningLoopers');

    return (
        < div className="loopcontrols" >
            {
                Array.from(runningLoopers.keys()).map((id) => {
                return (

                    <Loopicon id={id} key={`loop_${id}`} />

                )
            })
            }

        </div >
    );
}

export default Loopcontrols;

