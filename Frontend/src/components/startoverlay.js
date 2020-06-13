import React, { useState, useEffect } from 'react';
import { useGlobalState } from "../GlobalState";
import { ReactComponent as LogoIcon } from '../img/logo.svg';




function StartOverlay() {

    const [startOverlay, setStartOverlay] = useState(true);
    const [, setOverlayIsOpen] = useGlobalState('overlayIsOpen');
    const [musicCtrl,] = useGlobalState('musicCtrl');


    useEffect(() => {
        setOverlayIsOpen(startOverlay);
    }, [startOverlay, setOverlayIsOpen])

    const playFunction = () => {
        musicCtrl.startStopSoundbed()
    }

    var isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    return (

        <>
            {
                startOverlay ?
                    <>
                    <div id="startUnderlay"></div>
                    <div id="startOverlay">
                        <LogoIcon id="startLogo" />
                        <p>Music Playground Terry is a web app to simply create beautiful soundscapes. {
                            isChromeBrowser ? "" : "For the best music experience we recommend the use of Google Chrome."
                        }
                        </p>

                        <p id="credits">Created by: Chantal, Freddy, Luca, Malte, Maluna, Niklas, Simon.</p>
                        
                            <button id="startButton" onClick={() => { setStartOverlay(false); playFunction() }}>Let's play music!</button>
                        </div>

                    </> :
                ""
            }
        </>
        
             
    );
};


export default StartOverlay;
