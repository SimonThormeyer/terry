import React, { useState, useCallback } from 'react';
import { ReactComponent as RandomIcon } from '../img/random.svg';
import { ReactComponent as LooperIcon } from '../img/looper.svg';
import { ReactComponent as PauseIcon } from '../img/pause.svg';
import { ReactComponent as StopIcon } from '../img/stop.svg';
import { useGlobalState } from "../GlobalState"
import { Looper } from '../components/toneJS/Looper'
import useEventListener from "./../UseEventListener"

function Menu(props) {

    // Global state - see GlobalState.js for explanation, needed for functional logic of menu buttons 
    const [listeningLooper, setListeningLooper] = useGlobalState('listeningLooper')
    const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');
    const [overlayIsOpen,] = useGlobalState('overlayIsOpen');
    const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState('activeHelpDialogue');
    const [nextLooperID, setNextLooperID] = useGlobalState('nextLooperId');
    const [randomNotes,] = useGlobalState('randomNotes');
    const [randomNotesRunning, setRandomNotesRunning] = useGlobalState('randomNotesRunning');

    // state of Component (used for appearance of buttons)
    const [random, setRandom] = useState(true)
    const [loop, setLoop] = useState(true)



    const loopFunction = useCallback(
        (startLoop) => {
            if (startLoop) {
                setListeningLooper(new Looper());
            } else {
                listeningLooper.stopRecording(performance.now());
                setNextLooperID(nextLooperID + 1);
                runningLoopers.set(nextLooperID, listeningLooper);
                setRunningLoopers(new Map(runningLoopers));
                setListeningLooper(undefined)
            }
        }, [listeningLooper, nextLooperID, runningLoopers, setListeningLooper, setNextLooperID, setRunningLoopers])
    

    const randomFunction = () => {
        randomNotes.toggleRandomNotes();
        setRandomNotesRunning(!randomNotesRunning);
    }


    // KEY BINDINGS

    const handleSpaceKeyDown = useCallback(
        () => {
            loopFunction(loop);
            setLoop(!loop);
        }, [loop, loopFunction, setLoop]);

    const handleKeyDown = useCallback(
        (event) => {
            if(overlayIsOpen) return;
            // start/stop Looping with Space
            if (event.keyCode === 32) {
                if (activeHelpDialogue === "loop") { setActiveHelpDialogue("loopIcons") };
                event.preventDefault(); // don't scroll to bottom of page
                handleSpaceKeyDown();
            }
        },
        [handleSpaceKeyDown, overlayIsOpen, activeHelpDialogue, setActiveHelpDialogue]
    );

    useEventListener("keydown", handleKeyDown);
    
    return (
        <>
            <div id="menu">
                {loop ?
                    <LooperIcon id="loopbutton" title="record loop" onClick={() => { loopFunction(loop); setLoop(!loop); }} /> :
                    <StopIcon id="loopbutton" title="stop record loop" onClick={() => { loopFunction(loop); setLoop(!loop); if (activeHelpDialogue === "loop") { setActiveHelpDialogue("loopIcons") } }} />}
                {random ?
                    <RandomIcon id="randombutton" title="play random music" onClick={() => { setRandom(false); randomFunction(); if (activeHelpDialogue === "random") { setActiveHelpDialogue("record") } }} /> :
                    <PauseIcon id="randombutton" title="pause random music" onClick={() => { setRandom(true); randomFunction(); if (activeHelpDialogue === "random") { setActiveHelpDialogue("record") } }}/>}
            </div>

        </>
    );
}

export default Menu;