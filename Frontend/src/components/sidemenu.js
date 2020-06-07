import React, { useState } from 'react';
import { ReactComponent as SideMenuIcon } from '../img/sidemenu.svg';
import { ReactComponent as SaveIcon } from '../img/save.svg';
import { ReactComponent as Helpicon } from '../img/help.svg';
import { ReactComponent as OpenIcon } from '../img/open.svg';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import SaveProjectButton from '../components/SaveProjectButton';
import OpenProject from '../components/OpenProject';
import { useGlobalState } from "../GlobalState";




function SideMenu() {

    const [runningLoopers,] = useGlobalState('runningLoopers');

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


    const saveProjectOverlayOnOffFunction = () => {

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
        var username = document.getElementById("username").value;
        var projectname = document.getElementById("projectname").value;
        if (username === "" || projectname === "") {
           
    
        } else {

            SaveProjectButton(runningLoopers, username, projectname);
            alert("Project successfully saved!");
        }
    }

    const openProjectOverlayOnOffFunction = () => {

        var openOverlay = document.getElementById("openOverlay");
        var openUnderlay = document.getElementById("saveUnderlay");


        if (openOverlay.style.display == "block") {

            openOverlay.style.display = "none";
            openUnderlay.style.display = "none";
        }
        else {
            openOverlay.style.display = "block";
            openUnderlay.style.display = "block";
        }
    }

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



    const preventSubmit = function (e) {
        var key = e.charCode || e.keyCode || 0;
        if (key == 13) {
            e.preventDefault();
        }
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
                <OpenIcon id="openIcon" onClick={() => { sideMenuOnOffFunction(); openProjectOverlayOnOffFunction()}} />
                <SaveIcon id="saveIcon" onClick={() => { sideMenuOnOffFunction(); saveProjectOverlayOnOffFunction() }} />
                <Helpicon id="helpIcon" onClick={() => { sideMenuOnOffFunction(); helpProjectFunction() }} />
            </div>

            <div id="saveUnderlay"></div>
            <div id="saveOverlay">
                <ul>
                    <li>
                        <DeleteIcon id="closeSaveOverlay" onClick={() => { saveProjectOverlayOnOffFunction() }} />
                    </li>
                    <li id="headerSave">
                        <p>Save your Track?</p>
                    </li>
                    <li>
                        <form>
                            <label for="username" id="labelUsername">Username</label>
                            <input name="username" id="username" maxlength="5" required></input>
                            <label for="projectname" id="labelProjectname">Project name</label>
                            <input name="projectname" id="projectname" maxlength="255" required></input>  
                        </form>
                        <button id="saveButton" onClick={() => { saveProjectFunction() }}>Save</button>
                    </li>
                </ul>
            </div>

            <div id="openOverlay">

                <DeleteIcon id="closeOpenOverlay" onClick={() => { openProjectOverlayOnOffFunction() }} />

                <p id="headerOpen">Open a Track?</p>
                <form>
                    <label for="usernameProject" id="findProject">Find a project</label>
                    <input name="usernameProject" id="usernameProject" onKeyUp={findProject} onKeyPress={preventSubmit} ></input>
                </form>
                <ul id="databaseTable">
                    <OpenProject />
                </ul>

            </div>
        </>
    );
}

export default SideMenu;