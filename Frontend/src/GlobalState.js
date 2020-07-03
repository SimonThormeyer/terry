import { createGlobalState } from 'react-hooks-global-state';
import { RandomNotes } from './components/toneJS/randomNotes/randomNotes';

/*
 USED LIKE THIS IN ANY FUNCTIONAL COMPONENT:
 ============================================================
 import { useGlobalState } from "../GlobalState"
 const [variableName, setVariable] = useGlobalState('variableName')
 ============================================================
 now you can access the state content unter variableName and update it with setVariable(newValue)
 important: all components using the state (like shown above) will be listerners to this variable and re-render on update!
 Functions that should be available globally can be part of the GlobalState as well.
*/

const initialCanvas = {
    'effectSphere': {
        'x': 10,
        'y': 0,
    },
    'synthSphere': {
        'x': 0, 
        'y': 0
    },
    'musicSphere': {
        'x': -10,
        'y': 0
    }
}

const initialState = {
    // looper that is currently recording actions
    listeningLooper: undefined,
    // containing all loopers that currently playback recorded actions (or are paused)
    runningLoopers: new Map(),
    musicCtrl: [],
    overlayIsOpen: false,
    canvases: [
        Object.assign(initialCanvas),
        Object.assign(initialCanvas),
        Object.assign(initialCanvas),
        // Object.assign(initialCanvas)
    ],
    canvasId: 0,
    loading: true, // used to enable or disable certain elements while canvas is loading
    nextLooperId: 1,
    activeHelpDialogue : "",
    randomNotes: new RandomNotes(),
    toneIsInitialized: false,
};

export const { useGlobalState } = createGlobalState(initialState)