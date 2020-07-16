import axios from 'axios';
import React, { useState } from "react";
import { useGlobalState } from "../GlobalState";
import { ReactComponent as CopyLinkIcon } from '../img/copyLink.svg';

function SaveProjectForm(props) {

    const [runningLoopers,] = useGlobalState('runningLoopers');
    const [canvases,] = useGlobalState('canvases');
    const [trackVolumes,] = useGlobalState('trackVolumes');
    const [randomNotesRunning,] = useGlobalState('randomNotesRunning');

    const [showShareLink, setShowShareLink] = useState(false);


    // needs to have suffix of REACT_APP_...
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    const frontendURL = process.env.REACT_APP_PUBLIC_URL || "http://localhost:3000";

    let getGlobalState = () => {
        let loopers = [];
        for (let looper of Array.from(runningLoopers.values())) {
            loopers.push(looper.getLooper());
        }
        return {
            loopers: loopers,
            canvases: canvases,
            randomNotesRunning: randomNotesRunning,
            trackVolumes: trackVolumes
        }
    }

  

    const handleSaveButtonClick = () => {
       let userName = document.getElementById("username").value;
       let projectName = document.getElementById("projectname").value;
        let saveForm = document.getElementById("saveForm");
        if (userName === "" || projectName === "") {
            alert("please enter a name for user and project")
        } else {
            postProject();
            saveForm.reset();
        }
    }

    let postProject = () => {
        let username = document.getElementById("username").value;
        let projectName = document.getElementById("projectname").value;
        axios

            // Anfang POST
            .post(`${backendUrl}/projects/user/${username}/project/${projectName}`, getGlobalState())
            .then(res => {
                console.log(`successful: ${res.statusText}`);
                setShowShareLink(true);
                createShareLink(username, projectName); 
            })
            // Ende Post

            .catch(err => {
                if (err.response) {
                    console.log(`error: ${err.response.data}`);
                    alert(err.response.data);
                } else {
                    console.log(err.message);
                }
            })
    }

    const copyText = () => {
        var copyTextContent = document.getElementById("shareLink");
        copyTextContent.select();
        copyTextContent.setSelectionRange(0, 99999)
        document.execCommand("copy");
    }

   const createShareLink = (username, projectName) => { 
       let shareLink = `${frontendURL}/share/${username}/${projectName}`;
        let linkContainer = document.getElementById("shareLink");
        linkContainer.value = shareLink;
    }

  

    return (
        showShareLink ? <>
            <p id="headerShare">Saved successfully!</p>
            <p id="headerSave"> Share your project?</p>
            <div id="shareLinkContainer">
            <input readOnly type="text" id="shareLink"></input>
                <CopyLinkIcon id="copyLinkIcon" onClick={() => { copyText() }} ></CopyLinkIcon>
            </div>

        </> :
            <>
                <p id="headerSave">Save your track?</p>
                <form id="saveForm">
                    <label id="labelUsername">Username</label>

                    <input name="username" id="username" maxLength="15" required autoFocus></input>
                    <label id="labelProjectname">Project name</label>
                    <input name="projectname" id="projectname" maxLength="255" required></input>
                </form>
                <button id="saveButton" onClick={() => { handleSaveButtonClick() }}>Save</button>
            </>
    )
}


export default SaveProjectForm;