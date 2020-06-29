import React from 'react';
import { useGlobalState } from "../GlobalState.js"
import { ReactComponent as ArrowForward } from '../img/arrow_forward.svg';
import { ReactComponent as ArrowBack } from '../img/arrow_back.svg';


function MultitrackNav(props) {
    // global
    const [canvasId, setCanvasId] = useGlobalState('canvasId');
    const [canvases,] = useGlobalState('canvases');

    let synthesizerNames = ['lows', 'highs', 'mids', 'percussion']

    let invisible = {
        visibility: 'hidden'
    };

    return (
        <div id="multitrackingNav">
            {/* // if there is no previous canvas, the visibilty of the arrow is changed to hidden. thereby the synthesizer name stays in center and doesn't move */}
            <ArrowBack style={canvasId === 0 ? invisible : {}} id="arrowBack"
                onClick={() => setCanvasId(canvasId - 1)} />
            <span id="synthesizerName">{synthesizerNames[canvasId]}</span>
            <ArrowForward style={canvasId >= canvases.length - 1 ? invisible : {}} id="arrowForward"
                onClick={() => setCanvasId(canvasId + 1)} />
        </div>
    );
};


export default MultitrackNav;