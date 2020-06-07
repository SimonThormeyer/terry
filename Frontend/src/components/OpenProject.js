import React, { useState, useEffect } from "react";
import axios from 'axios';


function OpenProject() {


    const [rows, setRows] = useState([]);



    const items = [];

    //get Request to get all Projects
    useEffect(() => {

        axios
            .get(`http://localhost:5000/projects/all`)
            .then(res => {
                console.log(res.statusText);
                setRows(res);
            })
            .catch(err => {
                err.response ? console.log(`error: ${err.response.data}`) : console.log(err.message);
            })

    }, [])


    var data = rows.data

    //loop to get username and projectname from database and save it in a list and create a hmtl li tag
    if (data !== undefined) {
        for (let index = 0; index < data.length; index++) {
            let username = data[index].user_ID;
            let projectname = data[index].project_name;
            let listElement = username + " - " + projectname;
            items.push(<li key={index} onClick={() => { openProjectFunction(index); openProjectOverlayOnOffFunction() }} >{listElement}</li>)
        }

    }

//close the overlay when open a project
    const openProjectOverlayOnOffFunction = () => {

        var openOverlay = document.getElementById("openOverlay");
        var openUnderlay = document.getElementById("saveUnderlay");


        if (openOverlay.style.display === "block") {

            openOverlay.style.display = "none";
            openUnderlay.style.display = "none";
        }
        else {
            openOverlay.style.display = "block";
            openUnderlay.style.display = "block";
        }
    }

    //open project and reconstruct to play music
    const openProjectFunction = (project_id) => {
        let project = data[project_id].project;

        console.log("open project Function")

    }

    return (
        <>
            {items}
        </>
    )

}

export default OpenProject;