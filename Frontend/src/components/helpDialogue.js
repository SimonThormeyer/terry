import React from 'react';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { useGlobalState } from "../GlobalState";


function HelpDialogue(clickEvent) {

    const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState("activeHelpDialogue");
    const [sideMenu, setSideMenu] = useGlobalState('sideMenu');





    return (
        <>


            {activeHelpDialogue === "canvas" ?
                <div id="clickCanvasDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Click on the canvas to play notes. Try it!<br />Try it!</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("effects") }}>Next</div>
                </div> :
                ""
            }

            {activeHelpDialogue === "effects" ?
                <div id="useEffects" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Move the spheres to change the sound of the played notes. Give it a shot!</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("loop") }}>Next</div>
                </div> :
                ""
            }


            {activeHelpDialogue === "loop" ?
                <div id="loopDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>This button loops the played notes. Click once to start and again after putting in notes!</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("loopIcons") }}>Next</div>
                </div> :
                ""}


            {activeHelpDialogue === "loopIcons" ?
                <div id="loopIconsDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Mute, pause or delete your loops here. Keys 1-5 also do the job for one loop respectively!</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("random") }}>Next</div>
                </div> :
                ""}


            {activeHelpDialogue === "random" ?
                <div id="randomDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Click here to let the computer play some notes and sphere movements for you. Check it out!</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("multiTrack")}}>Next</div>
                </div> :
                ""
            }
            {activeHelpDialogue === "multiTrack" ?
                <div id="mutlitTrackDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); setSideMenu(false)}} />
                    <p>Click on the arrows to switch to a different track with another instrument and all the features mentioned before.</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("record"); setSideMenu(true)}}>Next</div>
                </div> :
                ""}
        

            {activeHelpDialogue === "record" ?
                <div id="RecordDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); setSideMenu(false) }} />
                    <p>Record your music to download your track. Try it!</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("mixer")}}>Next</div>
                </div> :
                ""}
            
            {activeHelpDialogue === "mixer" ?
                <div id="mixerDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue(""); setSideMenu(false) }} />
                    <p>Here you can change the volume of every track.</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("openProject") }}>Next</div>
                </div> :
                ""}
            
            {activeHelpDialogue === "openProject" ?
                <div id="openDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>Here you can search for your or other projects. </p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("saveProject") }}>Next</div>
                </div> :
                ""}
            
            {activeHelpDialogue === "saveProject" ?
                <div id="SavenDialogue" className="dialogueStyle">
                    <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                    <p>You can save projects in a public cloud and share your track with your friends. </p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue(""); setSideMenu(false)}}>Done</div>
                </div> :
                ""}




        </>
    );
}
export default HelpDialogue;
