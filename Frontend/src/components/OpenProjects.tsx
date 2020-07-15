import React, { useState, useEffect, useCallback } from "react";
import { Looper } from './toneJS/Looper'
import axios from 'axios';
import { useGlobalState } from "../GlobalState"
import { Link } from "react-router-dom";
// import { Vector3 } from 'three'
// import { MusicCtrl } from '../components/toneJS/musicCtrl'

type Props = {
    user: string,
    projectName: string,
}

type Project = {
    canvases: any[]
    loopers: any[]
}

type ProjectData = {
    project_data: Project
    user_ID: string
    project_name: string
}

function OpenProject({ user, projectName }: Props) {

    //local
    const [loadedProjects, setLoadedProjects] = useState<ProjectData[]>();

    //global
    const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');
    const [canvases, setCanvases] = useGlobalState('canvases');
    const [, setNextLooperID] = useGlobalState('nextLooperId');
    // const [toneIsInitialized,] = useGlobalState('toneIsInitialized');
    // const [camera,] = useGlobalState('camera');
    // const [musicCtrl,] = useGlobalState('musicCtrl');
    const [,setLoadingProject] = useGlobalState('loadingProject');

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

    // this is to set correct musicCtrlParameters after project load also for others than the active canvas 
    // - Dot position must be projected, thus the camera and THREE.Vector3 is needed. 
    // Better would be to store and load relative coordinates not world coordinates

    // const setDotParameters = useCallback(() => {
    //     if (!toneIsInitialized) return;
    //     camera.updateMatrixWorld();
    //     for (let i = 0; i < canvases.length; i++) {

    //         let { xEffect, yEffect } = canvases[i].effectSphere;
    //         let pos = new Vector3(xEffect, yEffect, 0);
    //         pos.project(camera);
    //         (musicCtrl[i] as MusicCtrl).setParameterEffect(pos.x, pos.y);

    //         let { xSynth, ySynth } = canvases[i].synthSphere;
    //         pos = new Vector3(xSynth, ySynth, 0);
    //         pos.project(camera);
    //         (musicCtrl[i] as MusicCtrl).setParameterSynth(pos.x, pos.y);

    //         let { xMusic, yMusic } = canvases[i].musicSphere;
    //         pos = new Vector3(xMusic, yMusic, 0);
    //         pos.project(camera);
    //         (musicCtrl[i] as MusicCtrl).setParameterMusic(pos.x, pos.y);

    //     }
    // }, [camera, toneIsInitialized, canvases, musicCtrl])

    //open project and reconstruct loopers and canvases
    const openProjectFunction = useCallback((listIndex) => {
        if (!loadedProjects || !Array.isArray(loadedProjects)) return;
        setLoadingProject(true);
        let project = loadedProjects[listIndex].project_data;
        console.log(project)
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
        // setDotParameters();

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

    }, [canvases, loadedProjects, runningLoopers, setCanvases, setNextLooperID, setRunningLoopers, setLoadingProject])//, setDotParameters]);

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
    const preventSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        let key: number = e.charCode || e.keyCode || 0;
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
            {!loadedProjects || loadedProjects.length <= 0 ?
                // if the array is empty, display error message in <li> tag
                <li> {`No projects found`} {user && ` for user "${user}"`} {projectName && ` and project "${projectName}"`} </li> :
                // display the list only if it has more than 1 element
                loadedProjects.map((project, index) => {
                    let username = project.user_ID;
                    let projectname = project.project_name;
                    let listElement = username + " - " + projectname;
                    return (
                        <Link
                            key={`project__${index}`}
                            to='/'>
                            <li title={listElement}
                                onClick={() => {
                                    openProjectFunction(index);
                                }}>
                                {listElement}
                            </li>
                        </Link>
                    )
                })
            }
        </ul>
    </>
}

export default OpenProject;