import React, { useState } from 'react';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { useGlobalState } from "../GlobalState";


function HelpDialogue(clickEvent) {

    const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState("activeHelpDialogue");


    


    return (
        <> 


                    {activeHelpDialogue === "canvas" ?
                        <div id="clickCanvasDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("")}}/>
                            <p>Click on the canvas to create music.<br />Try it!</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("effects")}}>Skip</div>
                        </div> :
                        ""
                    }

                    {activeHelpDialogue === "effects" ?
                        <div id="useEffects" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                            <p>Move the spheres to change the sound, effects and keys and click again.</p>
                    <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("loop")}}>Skip</div>
                        </div> :
                        ""
                    }


                    {activeHelpDialogue === "loop" ?
                        <div id="loopDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                            <p>Here you can loop your music. You can also use the space key. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("loopIcons") }}>Skip</div>
                        </div> :
                        ""}
                    

                    {activeHelpDialogue === "loopIcons" ?
                        <div id="loopIconsDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                            <p>(Un)Mute, delete or pause the loops. Keys 1 to 5 also mute the loops.</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("soundBed") }}>Skip</div>
                        </div> :
                        ""}

                    {activeHelpDialogue === "soundBed" ?
                        <div id="soundbedDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                            <p>Click here to turn on and off the background music. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("random") }}>Skip</div>
                        </div> :
                        ""}

                    {activeHelpDialogue === "random" ?
                        <div id="randomDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                            <p>Click on the random button to play random notes.</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("record") }}>Skip</div>
                        </div> :
                        ""
                    }


                    {activeHelpDialogue === "record" ?
                        <div id="RecordDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                            <p>Record your music to download your track. Try it!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("saveOpen") }}>Skip</div>
                        </div> :
                        ""}


                    {activeHelpDialogue === "saveOpen" ?
                        <div id="SaveOpenDialogue" className="dialogueStyle">
                            <DeleteIcon className="closeDialogue" onClick={() => { setActiveHelpDialogue("") }} />
                            <p>In this sidemenu you can save and open projects. Now you are ready to start!</p>
                            <div className="styleSkipButton" onClick={() => { setActiveHelpDialogue("") }}>Close</div>
                        </div> :
                        ""}
               
        </>
    );
}
export default HelpDialogue;
