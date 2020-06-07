import React, { useState } from 'react';
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


function Menu(props) {

    // Global state - see GlobalState.js for explanation, needed for functional logic of menu buttons 
    const [listeningLooper, setListeningLooper] = useGlobalState('listeningLooper')
    const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');
    const [musicCtrl,] = useGlobalState('musicCtrl');

    // state of Component (used for appearance of buttons)
    const [nextLooperID, setNextLooperID] = useState(1); 
    const [play, setPlay] = useState(true)
    const [random, setRandom] = useState(true)
    const [loop, setLoop] = useState(true)
    const [record, setRecord] = useState(true)


    const loopFunction = (startLoop) => {
        if (startLoop) {
            setListeningLooper(new Looper(performance.now(), musicCtrl));
        } else {
            listeningLooper.stopRecording(performance.now());
            setNextLooperID(nextLooperID + 1);
            runningLoopers.set(nextLooperID, listeningLooper);
            setRunningLoopers(new Map(runningLoopers));
            setListeningLooper(undefined);
        }
    }

    const playFunction = () => {
        musicCtrl.startStopSoundbed()
        console.log("menu js play Function");
    }

    const randomFunction = () => {
        console.log("menu js random Function");
    }

    const recordFunction = () => {
        console.log("menu js record Function");
    }

    const downloadOverlayOnFunction = () => {
        console.log("menu js downlaodOverlayOn Function");
        var divOverlay = document.getElementById("overlay");

       
        divOverlay.style.display = "block";
        var underlay = document.getElementById("underlay");
        underlay.style.display = "block";

    }

    const downloadOverlayOffFunction = () => {
        console.log("menu js downlaodOOverlayOff Function");
        var divOverlay = document.getElementById("overlay");
        divOverlay.style.display = "none";

        var divUnderlay = document.getElementById("underlay");
        divUnderlay.style.display = "none";
    }

    const downloadFunction = () => {
        console.log("menu js download function");
        window.alert("Your download was successful!");
    }




    return (
        <>
            <ul id="menu">
                <li id="playbutton" onClick={() => { setPlay(!play); playFunction(); }}>
                    {play ?
                        <PlayIcon /> :
                        <PauseIcon />}
                </li>
                <li id="randombutton" onClick={() => { setRandom(!random); randomFunction() }}>
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
                        <StopIcon />}
                </li>
                <li id="recordbutton" onClick={() => { setRecord(!record); recordFunction() }}>
                    {record ?
                        <RecordIcon /> :
                        <StopIcon onClick={() => { downloadOverlayOnFunction() }} />}
                </li>
            </ul>
            <div id="underlay"></div>
            <div id="overlay">
                <ul>
                    <li>
                        <DeleteIcon id="closeOverlay" onClick={() => { downloadOverlayOffFunction() }} />
                    </li>
                    <li>
                        <LogoIcon id="logoIcon" />
                    </li>
                    <li>
                        <p>Download your Track?</p>
                    </li>
                    <li>
                        <DownloadIcon id="downloadbutton" onClick={() => { downloadFunction() }} />
                    </li>
                </ul>
            </div>
        </>
    );
    }


export default Menu;