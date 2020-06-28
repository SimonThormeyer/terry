import React from 'react';
import { useGlobalState } from "../GlobalState.js"
import { ReactComponent as ArrowForward } from '../img/arrow_forward.svg';
import { ReactComponent as ArrowBack } from '../img/arrow_back.svg';


function MultitrackNav(props) {
    // global
    const [canvasId, setCanvasId] = useGlobalState('canvasId');
    const [canvases,] = useGlobalState('canvases');

    let synthesizerNames = ['Marimba', 'Synth1', 'mids', 'percussion']

    let visibility = {
        visibility: 'hidden'
    };

    return (
        <div id="multitrackingNav">
            {canvasId > 0 ? // if there is no previous canvas, the visibilty of the arrow is changed to hidden. thereby the synthesizer name stays in center and doesn't move
                <ArrowBack id="arrowBack" onClick={() => setCanvasId(canvasId - 1)} /> :
                <ArrowBack style={visibility} id="arrowBack" onClick={() => setCanvasId(canvasId - 1)} />
            }
            <span id="synthesizerName">{synthesizerNames[canvasId]}</span>
            {canvasId < canvases.length - 1 ?
                <ArrowForward id="arrowForward" onClick={() => setCanvasId(canvasId + 1)} /> :
                <ArrowForward style={visibility} id="arrowForward" onClick={() => setCanvasId(canvasId + 1)} />
            }
        </div>
    );
};


export default MultitrackNav;