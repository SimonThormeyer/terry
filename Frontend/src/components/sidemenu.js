import React, { useState, useEffect } from 'react';
import { ReactComponent as SideMenuIcon } from '../img/sidemenu.svg';
import { ReactComponent as SaveIcon } from '../img/save.svg';
import { ReactComponent as Helpicon } from '../img/help.svg';
import { ReactComponent as RecordStopIcon } from '../img/recordStop.svg';
import { ReactComponent as OpenIcon } from '../img/open.svg';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { ReactComponent as RecordIcon } from '../img/record.svg';
import { ReactComponent as DownloadIcon } from '../img/download.svg';
import { ReactComponent as LogoIcon } from '../img/logo.svg';
import SaveProjectForm from './SaveProjectForm';
import OpenProject from '../components/OpenProject';
import { useGlobalState } from "../GlobalState";




function SideMenu() {

    //global 
    const [, setOverlayIsOpen] = useGlobalState('overlayIsOpen');
    const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState('activeHelpDialogue');
    const [musicCtrl,] = useGlobalState('musicCtrl');

    //local
    const [sideMenu, setSideMenu] = useState(false);
    const [saveOverlay, setSaveOverlay] = useState(false);
    const [openOverlay, setOpenOverlay] = useState(false);
    const [record, setRecord] = useState(true);
    const [recordOverlay, setRecordOverlay] = useState(false);
    const [sideMenuUnderlay, setSideMenuUnderlay] = useState(true);
    const [sideMenuIcon, setSideMenuIcon] = useState(true);
    const [openSaveHelpIcon, setOpenSaveHelpIcon] = useState(true);

    


    // set the global state 'overlayIsOpen' to true if an overlay is open
    useEffect(() => {
        setOverlayIsOpen(saveOverlay || openOverlay || recordOverlay);
    }, [saveOverlay, openOverlay, recordOverlay, setOverlayIsOpen])



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

    //fade out side menu icons (open, save, help) when record is active
    const fadeOpenSaveHelp = () => {
        let open = document.getElementById("openIcon");
        let save = document.getElementById("saveIcon");
        let help = document.getElementById("helpIcon");
        open.style.opacity = 0;
        save.style.opacity = 0;
        help.style.opacity = 0;
        setTimeout(() => {
            setOpenSaveHelpIcon(false);
        }, 500);
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

    const recordFunction = () => {
        musicCtrl[0].startStopRecorder()
    }

    const downloadFunction = () => {
        musicCtrl[0].saveRecording()
    }



    return (
        <>
            {sideMenu &&
                <>
                {/* if record is active, the side menu may not be closed, so the stop record button is always reachable. */}
                {sideMenuUnderlay &&
                    <div id="closeSideMenuDiv" onClick={() => { setSideMenu(false) }}></div>
                }
                <div id="sideMenuIcons">
                    {record ?
                        <RecordIcon id="recordbutton" title="record" onClick={() => { setSideMenuUnderlay(false); setRecord(false); fadeOpenSaveHelp(); recordFunction(); setSideMenuIcon(false) }} /> :
                        <RecordStopIcon id="stoprecordbutton" title="stop record"onClick={() => { setSideMenu(false); setRecordOverlay(true); setRecord(true); setSideMenuIcon(true); recordFunction() }} />}
                    {/* if record is active, the other side menu buttons fade out. code below prevents click actions during outfade */}
                        {openSaveHelpIcon && !record ?
                        <>
                            <OpenIcon id="openIcon" title="open project"/>
                            <SaveIcon id="saveIcon" title="save project"/>
                            <Helpicon id="helpIcon" title="help dialogue"/>
                        </> :
                        openSaveHelpIcon && <>
                            <OpenIcon id="openIcon" title="open project" onClick={() => { setSideMenu(false); setOpenOverlay(true) }} />
                            <SaveIcon id="saveIcon" title="save project" onClick={() => { setSideMenu(false); setSaveOverlay(true) }} />
                            <Helpicon id="helpIcon" title="help dialogue" onClick={() => { setSideMenu(false); helpProjectFunction() }} />
                        </>}

                    </div>
                </>
            }
            <div id="sidemenu">
                {/* if record is active, the side menu may not be closed, so the stop record button is always reachable. */}
                {sideMenuIcon ?
                    <SideMenuIcon id="sideMenuIcon" title="side menu" onClick={() => { setOpenSaveHelpIcon(true); setSideMenuUnderlay(true); setSideMenu(!sideMenu); if (activeHelpDialogue === "saveOpen") { setActiveHelpDialogue("") } }} /> :
                    <SideMenuIcon id="sideMenuIcon" title="side menu" />
                }
            </div>

            {recordOverlay &&
                <>
                    <div id="underlay"></div>
                    <div id="overlay">

                    <DeleteIcon id="closeOverlay" title="close overlay" onClick={() => { setRecordOverlay(false); if (activeHelpDialogue === "record") { setActiveHelpDialogue("saveOpen") } }} />
                        <LogoIcon id="logoIcon" />
                        <p>Download your Track?</p>
                    <DownloadIcon id="downloadbutton" title="download your track" onClick={() => { downloadFunction(); if (activeHelpDialogue === "record") { setActiveHelpDialogue("saveOpen") } }} />

                    </div>
                </>
            }

            {
                saveOverlay &&
                <>
                    <div className="saveOpenUnderlay"></div>
                    <div id="saveOverlay">

                        <DeleteIcon id="closeSaveOverlay" title="close overlay" onClick={() => { setSaveOverlay(false) }} />
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
                        <DeleteIcon id="closeOpenOverlay" title="close overlay" onClick={() => { setOpenOverlay(false) }} />

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

            
        </>
    );
}

export default SideMenu;