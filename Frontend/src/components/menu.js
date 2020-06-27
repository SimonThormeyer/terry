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
            <ul id="menu">
                <li id="randombutton" onClick={() => { setRandom(!random); randomFunction(); if (activeHelpDialogue === "random") { setActiveHelpDialogue("record") }}}>
                    {random ?
                        <RandomIcon /> :
                        <PauseIcon />}
                </li>
                <li id="loopbutton" onClick={() => {
                    loopFunction(loop);
                    setLoop(!loop);
                }}>
                    {loop ?
                        <LooperIcon /> :
                        <StopIcon onClick={() => { if (activeHelpDialogue === "loop") { setActiveHelpDialogue("loopIcons") }}}  />}
                </li>
            </ul>

        </>
    );
}

export default Menu;