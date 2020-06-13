import React, { useState } from 'react';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { useGlobalState } from "../GlobalState";


function HelpDialogue(clickEvent) {

    const [helpDialogue, setHelpDialogue] = useGlobalState('helpDialogue');
    const [activeHelpDialogue, setActiveHelpDialogue] = useState("canvas");


    let canvasClick = document.getElementById("");
    let loopIcon = document.getElementById("loopbutton");
    let backgroundMusicIcon = document.getElementById("playbutton");
    let recordIcon = document.getElementById("recordbutton");
    let randomMusicIcon = document.getElementById("randombutton");
    let saveIcon = document.getElementById("save");
    let openIcon = document.getElementById("open");



    return (
        <> {
            helpDialogue ?


                <div id="helpDialogue">


                    {activeHelpDialogue == "canvas" ?
                        <div id="clickCanvasDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setHelpDialogue(false)}}/>
                            <p>Click on the canvas to create music. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("effects") }}>Skip</div>
                        </div> :
                        ""
                    }

                    {activeHelpDialogue == "effects" ?
                        <div id="useEffects" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setHelpDialogue(false) }} />
                            <p>Move the sphere to change the sound. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("loop") }}>Skip</div>
                        </div> :
                        ""
                    }


                    {activeHelpDialogue == "loop" ?
                        <div id="loopDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setHelpDialogue(false) }} />
                            <p>Here you can loop your music. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("loopIcons") }}>Skip</div>
                        </div> :
                        ""}
                    

                    {activeHelpDialogue == "loopIcons" ?
                        <div id="loopIconsDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setHelpDialogue(false) }} />
                            <p>Here you can loop your music. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("soundBed") }}>Skip</div>
                        </div> :
                        ""}

                    {activeHelpDialogue == "soundBed" ?
                        <div id="soundbedDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setHelpDialogue(false) }} />
                            <p>Click here to turn on the background music. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("random") }}>Skip</div>
                        </div> :
                        ""}

                    {activeHelpDialogue == "random" ?
                        <div id="randomDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setHelpDialogue(false) }} />
                            <p>Click on the canvas to create music. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("record") }}>Skip</div>
                        </div> :
                        ""
                    }


                    {activeHelpDialogue == "record" ?
                        <div id="RecordDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setHelpDialogue(false) }} />
                            <p>Record your music to download your track. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("saveOpen") }}>Skip</div>
                        </div> :
                        ""}


                    {activeHelpDialogue == "saveOpen" ?
                        <div id="SaveOpenDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setHelpDialogue(false) }} />
                            <p>In this sidemenu you can save and open projects. Now you are ready to start!</p>
                            <div className="styleSkipButton" onClick={() => { setHelpDialogue(false) }}>Close</div>
                        </div> :
                        ""}
                </div> :
                ""
        }
        </>
    );
}
export default HelpDialogue;
