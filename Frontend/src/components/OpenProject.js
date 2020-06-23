import React, { useState, useEffect } from "react";
import { Looper } from './toneJS/Looper'
import axios from 'axios';
import { useGlobalState } from "../GlobalState"



function OpenProject() {


    const [rows, setRows] = useState([]);
    const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');
    // const [globalFunctions,] = useGlobalState('globalFunctions');
    const [canvases, setCanvases] = useGlobalState('canvases');
    const [, setNextLooperID] = useGlobalState('nextLooperId');
    const [backendUrl,] = useGlobalState('backend_url');


    const items = [];
    

    //get Request to get all Projects of all users
    useEffect(() => {

        axios
            .get(`${backendUrl}/projects/all`)
            .then(res => {
                console.log(res.statusText);
                setRows(res);
            })
            .catch(err => {
                if (err.response) {
                    console.log(`error: ${err.response.data}`);
                    alert(err.response.data);
                } else {
                    console.log(err.message);
                }
            })

    }, [backendUrl])


    var data = rows.data

    //loop to get username and projectname from database and save it in a list and create a hmtl li tag
    if (data !== undefined) {
        for (let index = 0; index < data.length; index++) {
            let username = data[index].user_ID;
            let projectname = data[index].project_name;
            let listElement = username + " - " + projectname;
            items.push(<li key={index} onClick={() => {
                openProjectFunction(index);

            }} >{listElement}</li>)
        }

    }


    //open project and reconstruct loopers and canvases
    const openProjectFunction = (project_id) => {
        let project = data[project_id].project;
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
                console.log(loadedLooper);
                let looper = new Looper();
                looper.events = Array.from(loadedLooper.events);
                looper.startTime = loadedLooper.currentTime; // is this correct?
                looper.duration = loadedLooper.duration;
                looper.muted = loadedLooper.muted;
                looper.pauseTime = loadedLooper.pauseTime;
                looper.playStartTime = loadedLooper.playStartTime;
                looper.setCanvasId(loadedLooper.canvasId); 
                runningLoopers.set(i+1, looper);
                setRunningLoopers(new Map(runningLoopers))
                if (!loadedLooper.stopped) looper.play();
            }
            setNextLooperID(project.loopers.length);
        }



    }

    return (
        <>
            {items}
        </>
    )

}

export default OpenProject;