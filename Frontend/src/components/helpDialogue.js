import React from 'react';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { useGlobalState } from "../GlobalState";


function HelpDialogue(clickEvent) {

    //global
    const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState("activeHelpDialogue");
    const [sideMenu, setSideMenu] = useGlobalState('sideMenu');
    const [, setOpenSaveHelpIcon] = useGlobalState("openSaveHelpIcon");
    const [, setSideMenuUnderlay] = useGlobalState("sideMenuUnderlay");
    const [record, ] = useGlobalState("record");




    //setFocus of the button in the dialogue
    const focusHelp = (id) => {
        setTimeout(() => {
            var element = document.getElementById(id);
            element.classList.add("activeFocus");
        }, 50);
    }


    const unfocusHelp = (id) => {
        setTimeout(() => {
        var element = document.getElementById(id);
                element.classList.remove("activeFocus")
        }, 50);
    }




    return (
        <>


            {activeHelpDialogue === "canvas" ?
                <div id="clickCanvasDialogue" className="dialogueStyle">

                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Click everywhere on the canvas to play notes. Take your time and try out different positions.</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("effects") }}>Next</div>
                </div> :
                ""
            }

            {activeHelpDialogue === "effects" ?
                <div id="useEffects" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Move the spheres to change the sound of the played notes. Can you already hear a difference? </p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("loop"); focusHelp("loopbutton") }}>Next</div>
                </div> :
                ""
            }


            {activeHelpDialogue === "loop" ?
                <div id="loopDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); unfocusHelp("loopbutton") }} />
                    <p>This button loops the played notes. Click once to start and again after putting in notes.</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("loopIcons"); unfocusHelp("loopbutton"); }}>Next</div>
                </div> :
                ""}


            {activeHelpDialogue === "loopIcons" ?
                <div id="loopIconsDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Mute, pause or delete your loops here. Keys 1-5 also do the job for one loop respectively!</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("random"); focusHelp("randombutton") }}>Next</div>
                </div> :
                ""}


            {activeHelpDialogue === "random" ?
                <div id="randomDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); unfocusHelp("randombutton") }} />
                    <p>Already tired of clicking? Press here to let us play some notes and move the spheres around.</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("multiTrack"); unfocusHelp("randombutton") }}>Next</div>
                </div> :
                ""
            }
            {activeHelpDialogue === "multiTrack" ?
                <div id="mutlitTrackDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); setSideMenu(false) }} />
                    <p>Now it's time to layer more sounds. Click on the arrows to switch to a different instrument.</p>
                    <div className="styleSkipButton" onClick={() => { setSideMenu(true); if (record) { focusHelp("recordbutton") }; setActiveHelpDialogue("record"); }}>Next</div>
                </div> :
                ""}


            {activeHelpDialogue === "record" ?
                <div id="RecordDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); }} />
                    <p>In the sidemenu you can record and download your composition...</p>
                    <div className="styleSkipButton" onClick={() => {    
                        if (record) {
                            setSideMenu(true); setOpenSaveHelpIcon(true); setSideMenuUnderlay(true); setActiveHelpDialogue("mixer"); if (sideMenu) { unfocusHelp("recordbutton") }; focusHelp("mixerIcon")
                        } else {alert("Please stop record to continue.")}
                    }}>Next</div>
                </div> :
                ""}

            {activeHelpDialogue === "mixer" ?
                <div id="mixerDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); if (sideMenu) { unfocusHelp("mixerIcon") }}} />
                    <p>adjust the volume of your instruments...</p>
                    <div className="styleSkipButton" onClick={() => {
                        if (record) {
                            setSideMenu(true); setActiveHelpDialogue("openProject"); if (sideMenu) { unfocusHelp("mixerIcon") }; focusHelp("openIcon")
                        } else { alert("Please stop record to continue.") }
                    }}>Next</div>
                </div> :
                ""}

            {activeHelpDialogue === "openProject" ?
                <div id="openDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); if (sideMenu && record) { unfocusHelp("openIcon") } }} />
                    <p>find projects of others...</p>
                    <div className="styleSkipButton" onClick={() => {
                        if (record) {
                            setSideMenu(true); setActiveHelpDialogue("saveProject"); if (sideMenu) { unfocusHelp("openIcon") }; focusHelp("saveIcon")
                        } else { alert("Please stop record to continue.") }
                    }}>Next</div>
                </div> :
                ""}

            {activeHelpDialogue === "saveProject" ?
                <div id="SavenDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); if (sideMenu && record) { unfocusHelp("saveIcon") } }} />
                    <p>and share your work with others and your friends!</p>
                    <div className="styleSkipButton" onClick={() => {
                        if (record) {
                            setActiveHelpDialogue("doneTutorial"); if (sideMenu) { unfocusHelp("saveIcon") }
                        } else { alert("Please stop record to continue.") }
                    }}>Next</div>
                </div> :
                ""}

            {activeHelpDialogue === "doneTutorial" ?
                <div id="doneTutorialDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Now you can create your own piece of music. Have fun!</p>
                    <div className="styleSkipButton" onClick={() => {
                        if (record) {
                            setActiveHelpDialogue(""); setSideMenu(false)
                        } else { alert("Please stop record to continue.") }
                        }}>Done</div>
                </div> :
                ""}



        </>
    );
}
export default HelpDialogue;
