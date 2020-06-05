import React from 'react';
import axios from 'axios';
import { useGlobalState } from "../GlobalState";

function SaveProjectButton() {

    const [runningLoopers,] = useGlobalState('runningLoopers');

    let userID = 1;
    let projectName = `projectName`;
    let backendUrl = `http://localhost:5000`;

    let getGlobalState = () => {
        let loopers = [];
        for (let looper of Array.from(runningLoopers.values())) {
            loopers.push(looper.getLooper());
        }
        return {
            loopers: loopers
        }
    }

    let saveProject = () => {
        axios

            // // Anfang Test GET
            // .get(`${backendUrl}/projects/test`)
            // .then(res =>{
            //     console.log(res.statusText);
            // }) 
            // //Ende Test-Get

            // Anfang POST
            .post(`${backendUrl}/projects/user/${userID}/project/${projectName}`, getGlobalState())
            .then(res => {
                console.log(`successful: ${res.statusText}`)
            }) 
            // Ende Post

            .catch(err => {
                err.response ? console.log(`error: ${err.response.data}`) : console.log(err.message);
            })

    }


    return (
        <button onClick={() => saveProject()}>
            Save Project
        </button>
    )
}

export default SaveProjectButton;