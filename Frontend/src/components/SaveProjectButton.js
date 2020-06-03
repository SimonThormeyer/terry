import React from 'react';
import { useGlobalState } from "../GlobalState";
import {decycle} from "cycle";

function SaveProjectButton() {

    const [runningLoopers, ] = useGlobalState('runningLoopers');

    let userID = 1;
    let projectName = `projectName`;

    let getGlobalState = () => {
        let loopers = [];
        for(let looper of Array.from(runningLoopers.values())) {
            loopers.push(looper.getLooper());
        }
        return {
            loopers: loopers
        }
    }

    let saveProject = async () => {
        console.log((getGlobalState()));
        const response = await fetch(`/projects/user/${userID}/project/${projectName}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(getGlobalState()),
        })
        if(response.ok) {
            console.log(`successfully saved project to Database.`);
        } else {
            console.error(`${response.status} ${response.statusText}`);
        }
    }

    return (
            <button onClick={async () => saveProject() }>
                Save Project
            </button>
    )
}

export default SaveProjectButton;