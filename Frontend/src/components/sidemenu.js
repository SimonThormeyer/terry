import React, { useState } from 'react';
import { useGlobalState } from "../GlobalState"
import { Looper } from '../components/toneJS/Looper';
import { ReactComponent as SideMenuIcon } from '../img/sidemenu.svg';
import { ReactComponent as SaveIcon } from '../img/save.svg';
import { ReactComponent as Helpicon } from '../img/help.svg';
import { ReactComponent as OpenIcon } from '../img/open.svg';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';



function SideMenu(props) {


    const sideMenuOnOffFunction = () => {
        var sideMenuIcons = document.getElementById("sideMenuIcons");
        var closeSideMenuDiv = document.getElementById("closeSideMenuDiv");

        if (sideMenuIcons.style.display == "block") {
            sideMenuIcons.style.display = "none";
            closeSideMenuDiv.style.display = "none";

        } else {
            sideMenuIcons.style.display = "block";
            closeSideMenuDiv.style.display = "block";
        }
    }

    const openProjectOverlayFunction = () => {
        console.log("sidemenu open Project overlay function");
    }


    const saveProjectOverlayFunction = () => {

        var saveOverlay = document.getElementById("saveOverlay")
        var saveUnderlay = document.getElementById("saveUnderlay")


        if (saveOverlay.style.display == "block") {

            saveOverlay.style.display = "none";
            saveUnderlay.style.display = "none";
        }
        else {
            saveOverlay.style.display = "block";
            saveUnderlay.style.display = "block";
        }
    }

    const saveProjectFunction = () => {

    }

    const helpProjectFunction = () => {
        console.log("sidemenu help function");
    }



    return (
        <>
            <div id="closeSideMenuDiv" onClick={() => { sideMenuOnOffFunction() }}></div>

            <div id="sidemenu">
                <SideMenuIcon id="sideMenuIcon" onClick={() => { sideMenuOnOffFunction() }} />
            </div>

            <div id="sideMenuIcons">
                <OpenIcon id="openIcon" onClick={() => { sideMenuOnOffFunction(); openProjectOverlayFunction() }} />
                <SaveIcon id="saveIcon" onClick={() => { sideMenuOnOffFunction(); saveProjectOverlayFunction() }} />
                <Helpicon id="helpIcon" onClick={() => { sideMenuOnOffFunction(); helpProjectFunction() }} />
            </div>

            <div id="saveUnderlay"></div>
            <div id="saveOverlay">
                <ul>
                    <li>
                        <DeleteIcon id="closeSaveOverlay" onClick={() => { saveProjectOverlayFunction() }} />
                    </li>
                    <li id="headerSave">
                        <p>Save your Track?</p>
                    </li>
                    <li>
                        <form>
                            <label for="username" id="labelUsername">Username</label>
                            <input name="username" id="username" maxlength="255" required></input>
                            <label for="projectname" id="labelProjectname">Project name</label>
                            <input name="projectname" id="projectname" maxlength="255" required></input>
                            <button type="submit" id="saveButton" onClick={() => { saveProjectFunction() }}>Save</button>
                        </form>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default SideMenu;