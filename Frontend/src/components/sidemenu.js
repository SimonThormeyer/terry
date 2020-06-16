import React, { useState, useEffect } from 'react';
import { ReactComponent as SideMenuIcon } from '../img/sidemenu.svg';
import { ReactComponent as SaveIcon } from '../img/save.svg';
import { ReactComponent as Helpicon } from '../img/help.svg';
import { ReactComponent as OpenIcon } from '../img/open.svg';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import SaveProjectForm from './SaveProjectForm';
import OpenProject from '../components/OpenProject';
import { useGlobalState } from "../GlobalState";





function SideMenu() {

    //global 
    const [, setOverlayIsOpen] = useGlobalState('overlayIsOpen');
    const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState('activeHelpDialogue');


    //local
    const [sideMenu, setSideMenu] = useState(false);
    const [saveOverlay, setSaveOverlay] = useState(false);
    const [openOverlay, setOpenOverlay] = useState(false);

    // set the global state 'overlayIsOpen' to true if an overlay is open
    useEffect(() => {
        setOverlayIsOpen(saveOverlay || openOverlay);
    }, [saveOverlay, openOverlay, setOverlayIsOpen])



    //we search in the array (array includes the data from database) while typing and show the matching result
    const findProject = () => {
        var input, filter, ul, li, projectLi, i, txtValue;
        input = document.getElementById('usernameProject');

        filter = input.value.toUpperCase();
        ul = document.getElementById("databaseTable");
        li = ul.getElementsByTagName('li');

        for (i = 0; i < li.length; i++) {
            projectLi = li[i];
            txtValue = projectLi.textContent || projectLi.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }


    //prevent the data entered in a text field from being entered in the URL line by clicking Enter
    const preventSubmit = function (e) {
        var key = e.charCode || e.keyCode || 0;
        if (key === 13) {
            e.preventDefault();
        }
    }


    const helpProjectFunction = () => {
        setActiveHelpDialogue("canvas");
    }



    return (
        <>
            {sideMenu &&
                <>
                    <div id="closeSideMenuDiv" onClick={() => { setSideMenu(false) }}></div>
                    <div id="sideMenuIcons">
                        <OpenIcon id="openIcon" onClick={() => { setSideMenu(false); setOpenOverlay(true) }} />
                        <SaveIcon id="saveIcon" onClick={() => { setSideMenu(false); setSaveOverlay(true) }} />
                        <Helpicon id="helpIcon" onClick={() => { setSideMenu(false); helpProjectFunction() }} />
                    </div>
                </>
            }

            {
                saveOverlay &&
                <>
                    <div className="saveOpenUnderlay"></div>
                    <div id="saveOverlay">

                        <DeleteIcon id="closeSaveOverlay" onClick={() => { setSaveOverlay(false) }} />
                        <p id="headerSave">Save your Track?</p>
                        <SaveProjectForm />

                    </div>
                </>

            }

            {
                openOverlay &&
                <>
                    <div className="saveOpenUnderlay"></div>
                    <div id="openOverlay">
                        <DeleteIcon id="closeOpenOverlay" onClick={() => { setOpenOverlay(false) }} />

                        <p id="headerOpen">Open a Track?</p>
                        <form>
                            <label id="findProject">Find a project</label>
                            <input name="usernameProject" id="usernameProject" onKeyUp={findProject} onKeyPress={preventSubmit} ></input>
                        </form>
                        <ul id="databaseTable">
                            <OpenProject />
                        </ul>
                    </div>
                </>
            }

            <div id="sidemenu">
                <SideMenuIcon id="sideMenuIcon" onClick={() => { setSideMenu(!sideMenu); if (activeHelpDialogue === "saveOpen") { setActiveHelpDialogue("") } }} />
            </div>
        </>
    );
}

export default SideMenu;