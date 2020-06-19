import React, { useState, useCallback, useEffect } from 'react';
import { ReactComponent as RandomIcon } from '../img/random.svg';
import { ReactComponent as LooperIcon } from '../img/looper.svg';
import { ReactComponent as PlayIcon } from '../img/play.svg';
import { ReactComponent as RecordIcon } from '../img/record.svg';
import { ReactComponent as PauseIcon } from '../img/pause.svg';
import { ReactComponent as StopIcon } from '../img/stop.svg';
import { ReactComponent as DownloadIcon } from '../img/download.svg';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { ReactComponent as LogoIcon } from '../img/logo.svg';
import { useGlobalState } from "../GlobalState"
import { Looper } from '../components/toneJS/Looper'
import useEventListener from "./../UseEventListener"


function Menu(props) {

    // Global state - see GlobalState.js for explanation, needed for functional logic of menu buttons 
    const [listeningLooper, setListeningLooper] = useGlobalState('listeningLooper')
    const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [overlayIsOpen, setOverlayIsOpen] = useGlobalState('overlayIsOpen');
    const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState('activeHelpDialogue');
    const [nextLooperID, setNextLooperID] = useGlobalState('nextLooperId');


    // state of Component (used for appearance of buttons)
    const [play, setPlay] = useState(false)
    const [random, setRandom] = useState(true)
    const [loop, setLoop] = useState(true)
    const [record, setRecord] = useState(true)
    const [recordOverlay, setRecordOverlay] = useState(false)


    const loopFunction = useCallback(
        (startLoop) => {
            if (startLoop) {
                setListeningLooper(new Looper(performance.now(), musicCtrl));
            } else {
                listeningLooper.stopRecording(performance.now());
                setNextLooperID(nextLooperID + 1);
                runningLoopers.set(nextLooperID, listeningLooper);
                setRunningLoopers(new Map(runningLoopers));
                setListeningLooper(undefined)
            }
        }, [musicCtrl, listeningLooper, nextLooperID, runningLoopers, setListeningLooper, setNextLooperID, setRunningLoopers])
    

    // set the global state 'overlayIsOpen' to true if an overlay is open
    useEffect(() => {
        setOverlayIsOpen(recordOverlay);
    }, [recordOverlay, setOverlayIsOpen])

    const playFunction = () => {
        musicCtrl.startStopSoundbed()
        console.log("menu js play Function");
    }

    const randomFunction = () => {
        console.log("menu js random Function");
    }

    const recordFunction = () => {
        musicCtrl.startStopRecorder()
        console.log("menu js record Function");
    }

    const downloadFunction = () => {
        musicCtrl.saveRecording()
        console.log("menu js download function");
        window.alert("Your download was successful!");
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
                <li id="playbutton" onClick={() => { setPlay(!play); playFunction(); if (activeHelpDialogue === "soundBed") { setActiveHelpDialogue("random") }}}>
                    {play ?
                        <PlayIcon /> :
                        <PauseIcon />}
                </li>
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
                <li id="recordbutton" onClick={() => { setRecord(!record); recordFunction() }}>
                    {record ?
                        <RecordIcon /> :
                        <StopIcon onClick={() => { setRecordOverlay(true) }} />}
                </li>
            </ul>
            {recordOverlay ?
                <>
                    <div id="underlay"></div>
                    <div id="overlay">

                        <DeleteIcon id="closeOverlay" onClick={() => { setRecordOverlay(false); if (activeHelpDialogue === "record") { setActiveHelpDialogue("saveOpen") }}} />

                        <LogoIcon id="logoIcon" />

                        <p>Download your Track?</p>

                        <DownloadIcon id="downloadbutton" onClick={() => { downloadFunction(); if (activeHelpDialogue === "record") { setActiveHelpDialogue("saveOpen") } }} />

                    </div>
                </>
                :
                <> </>
            }

        </>
    );
}


export default Menu;