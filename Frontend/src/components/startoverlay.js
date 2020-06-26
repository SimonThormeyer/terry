import React, { useState, useEffect } from 'react';
import { useGlobalState } from "../GlobalState";
import { MusicCtrl } from "../components/toneJS/musicCtrl"
import { ReactComponent as LogoIcon } from '../img/logo.svg';
import {Marimba} from "./toneJS/Marimba";

function StartOverlay() {

    const [startOverlay, setStartOverlay] = useState(true);
    const [, setOverlayIsOpen] = useGlobalState('overlayIsOpen');
    const [, setMusicCtrl] = useGlobalState('musicCtrl');
    const [, setActiveHelpDialogue] = useGlobalState('activeHelpDialogue');


    useEffect(() => {
        setOverlayIsOpen(startOverlay);
    }, [startOverlay, setOverlayIsOpen])

    const playFunction = () => {
        setMusicCtrl([new Marimba(), new MusicCtrl(), new MusicCtrl()]);
    }

    const helpFunction = () => {
        setMusicCtrl(new MusicCtrl());
        setActiveHelpDialogue("canvas");
    }

    let isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    return (

        <>
            {
                startOverlay &&
                    <>
                    <div id="startUnderlay"></div>
                    <div id="startOverlay">
                        <LogoIcon id="startLogo" />
                        <p>Terry is a playground to create and share beautiful soundscapes without effort. {
                            isChromeBrowser || "For the best music experience we recommend the use of Google Chrome."
                        }
                        </p>

                        <p id="credits">Created by: Chantal, Freddy, Luca, Malte, Maluna, Niklas, Simon.</p>
                        <div id="outerButton">
                        <button id="startButton" onClick={() => { setStartOverlay(false); playFunction() }}>Let's play music!</button>
                            <button id="startHelpButton" onClick={() => { setStartOverlay(false); helpFunction() }}>Start with tutorial!</button>
                        </div>
                        </div>

                    </> 
                
            }
        </>
        
             
    );
};


export default StartOverlay;
