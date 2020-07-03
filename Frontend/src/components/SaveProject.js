import axios from 'axios';
import React from 'react';
import {
  useGlobalState
} from "../GlobalState";

function SaveProjectForm(props) {

  const [runningLoopers, ] = useGlobalState('runningLoopers');
  const [canvases, ] = useGlobalState('canvases');

  // needs to have suffix of REACT_APP_...
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  let getGlobalState = () => {
    let loopers = [];
    for (let looper of Array.from(runningLoopers.values())) {
      loopers.push(looper.getLooper());
    }
    return {
      loopers: loopers,
      canvases: canvases
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
        alert("Saved successfully");
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

    return (
        <>
            <p id="headerSave">Save your Track?</p>
            <form id="saveForm">
                <label id="labelUsername">Username</label>
                <input name="username" id="username" maxLength="5" required></input>
                <label id="labelProjectname">Project name</label>
                <input name="projectname" id="projectname" maxLength="255" required></input>
            </form>
            <button id="saveButton" onClick={() => { handleSaveButtonClick() }}>Save</button>

    </>
  )
}


export default SaveProjectForm;