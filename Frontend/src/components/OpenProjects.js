import React, { useState, useEffect, useCallback } from "react";
import { Looper } from './toneJS/Looper'
import axios from 'axios';
import { useGlobalState } from "../GlobalState"



function OpenProject({ user, projectName }) {

    const [loadedProjects, setLoadedProjects] = useState([]);
    const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');
    const [canvases, setCanvases] = useGlobalState('canvases');
    const [, setNextLooperID] = useGlobalState('nextLooperId');

    const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    //get Request
    useEffect(() => {
        let url = `${backendUrl}/projects/all`;
        if (user) {
            url = `${backendUrl}/projects/user/${user}/allprojects`;
        }
        if (projectName) {
            url = `${backendUrl}/projects/user/${user}/project/${projectName}`;
        }

        axios
            .get(url)
            .then(res => {
                Array.isArray(res.data.items) ? setLoadedProjects(res.data.items) : setLoadedProjects([res.data.items])
            })
            .catch(err => {
                if (err.response) {
                    console.log(`error: ${err.response.data}`);
                } else {
                    console.log(err.message);
                }
            })

    }, [backendUrl, user, projectName])


    //open project and reconstruct loopers and canvases
    const openProjectFunction = useCallback((listIndex) => {
        let project = loadedProjects[listIndex].project_data;
        for (let id of Array.from(runningLoopers.keys())) {
            runningLoopers.get(id).stop()
            runningLoopers.delete(id);
        }
        setRunningLoopers(new Map());

        // rehydrate canvases
        if (project.canvases && project.canvases.length > 0) {
            let canvasesCopy = Array.from(canvases);
            for (let i = 0; i < project.canvases.length; i++) {
                let loadedCanvas = project.canvases[i];
                canvasesCopy[i] = loadedCanvas;
            }
            setCanvases(canvasesCopy);
        }

        // rehydrate loopers
        if (project.loopers && project.loopers.length > 0) {
            for (let i = 0; i < project.loopers.length; i++) {
                let loadedLooper = project.loopers[i];
                let looper = new Looper();
                looper.events = Array.from(loadedLooper.events);
                looper.startTime = loadedLooper.currentTime;
                looper.duration = loadedLooper.duration;
                looper.muted = loadedLooper.muted;
                looper.pauseTime = loadedLooper.pauseTime;
                looper.playStartTime = loadedLooper.playStartTime;
                looper.setCanvasId(loadedLooper.canvasId);
                runningLoopers.set(i + 1, looper);
                setRunningLoopers(new Map(runningLoopers))
                if (!loadedLooper.stopped) looper.play();
            }
            setNextLooperID(project.loopers.length);
        }
    }, [canvases, loadedProjects, runningLoopers, setCanvases, setNextLooperID, setRunningLoopers])

    //we search in the array (array includes the data from database) while typing and show the matching result
    const findProject = () => {
        let input, filter, ul, li, projectLi, i, txtValue;
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

    return <>
        <p id="headerOpen">Open a track?</p>
        <form>
            <label id="findProject">Find a project</label>
            <input name="usernameProject" id="usernameProject" onKeyUp={findProject} onKeyPress={preventSubmit} ></input>
        </form>
        <ul id="databaseTable">
            {loadedProjects.length <= 0 ?
                // if the array is empty, display error message in <li> tag
                <li> {`No projects found`} {user && ` for user "${user}"`} {projectName && ` and project "${projectName}"`} </li> :
                loadedProjects.map((project, index) => {
                    let username = project.user_ID;
                    let projectname = project.project_name;
                    let listElement = username + " - " + projectname;
                    return (
                        <li key={`project__${index}`}
                            onClick={() => {
                                openProjectFunction(index);
                            }}>
                            {listElement}
                        </li>
                    )
                })
            }
        </ul>
    </>;

}

export default OpenProject;