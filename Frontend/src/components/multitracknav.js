import React from 'react';
import { useGlobalState } from "../GlobalState.js"
import { ReactComponent as ArrowForward } from '../img/arrow_forward.svg';
import { ReactComponent as ArrowBack } from '../img/arrow_back.svg';


function MultitrackNav(props) {
    // global
    const [canvasId, setCanvasId] = useGlobalState('canvasId');
    const [canvases,] = useGlobalState('canvases');
    const [loading, ] = useGlobalState('loading');

    let synthesizerNames = ['lows', 'highs', 'mids', 'percussion']

    return (
        <div id="multitrackingNav">
            {!loading && canvasId > 0 && <ArrowBack id="arrowBack" onClick={() => {
                    setCanvasId(canvasId - 1);
            }} />}
            <span id="synthesizerName">{synthesizerNames[canvasId]}</span>
            {!loading && canvasId < canvases.length - 1 && <ArrowForward id="arrowForward"onClick={() => {
                    setCanvasId(canvasId + 1);
            }} />}
        </div>
    );
};


export default MultitrackNav;