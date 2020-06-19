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

const initialState = {
    // looper that is currently recording actions
    listeningLooper: undefined,
    // containing all loopers that currently playback recorded actions (or are paused)
    runningLoopers: new Map(),
    musicCtrl: undefined,
    overlayIsOpen: false,
    globalFunctions: {},
    nextLooperId: 1,
    activeHelpDialogue : "",
    randomNotes: new RandomNotes(),
    backend_url: "http://localhost:5000",
    // backend_url:"https://terry.beuth-media.de/db",  
};

export const { useGlobalState } = createGlobalState(initialState)