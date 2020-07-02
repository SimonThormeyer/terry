import React, { useState, useEffect } from 'react';
import { useGlobalState } from "../GlobalState";
import { ReactComponent as LogoIcon } from '../img/logo.svg';
import MusicCtrlWrapper from "../containers/MusicCtrlWrapper"

function StartOverlay() {

    // global
    const [, setOverlayIsOpen] = useGlobalState('overlayIsOpen');
    const [, setActiveHelpDialogue] = useGlobalState('activeHelpDialogue');
    const [toneIsInitialized,] = useGlobalState("toneIsInitialized")

    // local 
    const [startOverlay, setStartOverlay] = useState(true);
    const [startApp, setStartApp] = useState(false)


    useEffect(() => {
        setOverlayIsOpen(startOverlay);
    }, [startOverlay, setOverlayIsOpen])

    const playFunction = () => {
        setStartApp(true);
    }

    const helpFunction = () => {
        playFunction();
        setActiveHelpDialogue("canvas");
    }

    let isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

    return (

        <>
            {startApp && <MusicCtrlWrapper />}
            {
                // show overlay when enabled or when toneJS has not yet been initialized.
                (startOverlay || !toneIsInitialized) &&
                <>
                    <div id="startUnderlay"></div>
                    <div id="startOverlay">
                        <LogoIcon id="startLogo" />
                        <p>Terry is a playground to create and share beautiful soundscapes without effort. {
                            isChromeBrowser || "For the best music experience we recommend the use of Google Chrome."
                        }
                        </p>

                        <p id="credits">Created by: Chantal, Freddy, Luca, Malte, Maluna, Niklas, Simon.</p>
                        {/* display loading text when overlay should be disabled already but toneJS has not yet been initialized */}
                        {startOverlay ?
                            <div id="outerButton">
                                <button id="startButton" onClick={() => { setStartOverlay(false); playFunction() }}>
                                    Let's play music!
                                </button>
                                <button id="startHelpButton" onClick={() => { setStartOverlay(false); helpFunction() }}>
                                    Start with tutorial!
                                </button>
                            </div> :
                            <p>Loading...</p>}
                    </div>

                </>

            }
        </>


    );
};


export default StartOverlay;
