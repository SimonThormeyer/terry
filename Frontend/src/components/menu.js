import React, { useState } from 'react';
import { ReactComponent as RandomIcon } from '../img/random.svg';
import { ReactComponent as LooperIcon } from '../img/looper.svg';
import { ReactComponent as PlayIcon } from '../img/play.svg';
import { ReactComponent as RecordIcon } from '../img/record.svg';
import { ReactComponent as PauseIcon } from '../img/pause.svg';
import { ReactComponent as StopIcon } from '../img/stop.svg';
import { useGlobalState } from "../GlobalState"
import { Looper } from '../components/toneJS/Looper'


function Menu(props) {
    
    // Global state - see GlobalState.js for explanation, needed for functional logic of menu buttons 
    const [listeningLooper, setListeningLooper] = useGlobalState('listeningLooper')
    const [nextLooperID, setNextLooperID] = useGlobalState('nextLooperID'); 
    const [runningLoopers, ] = useGlobalState('runningLoopers');
    const [musicCtrl, ] = useGlobalState('musicCtrl');
    
    // state of Component (used for appearance of buttons)
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
            setListeningLooper(undefined)
        }
    }

    const playFunction = () =>
    {
        musicCtrl.startStopSoundbed()
        console.log("menu js play Function");
    }

    const randomFunction = () =>
    {
        console.log("menu js random Function");
    }

    const recordFunction = () =>
    {
        console.log("menu js record Function");
    }

    return (
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
                    <StopIcon />}
            </li>
        </ul>
    );
}

export default Menu;
