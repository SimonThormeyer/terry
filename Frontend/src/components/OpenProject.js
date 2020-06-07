import React, { useState, useEffect } from "react";
import axios from 'axios';



function OpenProject() {


    const [rows, setRows] = useState([]);



    const items = [];

    //get Request to get all Projects of all users
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
            items.push(<li key={index} onClick={() => { openProjectFunction(index)}} >{listElement}</li>)
        }

    }


    //open project and reconstruct loopers to play music
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