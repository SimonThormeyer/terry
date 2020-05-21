import { createGlobalState } from 'react-hooks-global-state';
import { MusicCtrl } from './components/toneJS/musicCtrl';

/*
 USED LIKE THIS IN ANY FUNCTIONAL COMPONENT:
 ============================================================
 import { useGlobalState } from "../GlobalState"
 [variableName, setVariable] = useGlobalState('variableName')
 ============================================================
 now you can access the state content unter variableName and update it with setVariable(newValue)
 important: all components using the state (like shown above) will be listerners to this variable and re-render on update!
 Functions that should be available globally can be part of the GlobalState as well.
*/

const initialState = {
    // looper that is currently recording actions
    listeningLooper: undefined,
    nextLooperID: 1, // can't just use 'runningLoopers.size' because of duplicate IDs when not deleting highest number loop first
    // containing all loopers that currently playback recorded actions (or are paused)
    runningLoopers: new Map(),
    musicCtrl: new MusicCtrl(),
};

export const { useGlobalState } = createGlobalState(initialState);