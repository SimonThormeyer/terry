import React, { useState, useEffect } from "react";
import axios from 'axios';



function OpenProject() {


    const [rows, setRows] = useState([])

    let backendUrl = `http://localhost:5000`;

    const items = [];
    

    useEffect(() => {
        axios
            // // Anfang Test GET
            .get(`${backendUrl}/projects/all`)
            .then(res => {
                console.log(res.statusText);
                setRows(res);
            })
            // //Ende Test-Get

            .catch(err => {
                err.response ? console.log(`error: ${err.response.data}`) : console.log(err.message);
            })
    
    }, [])
/*
    function getAll() {
        try {
            const response = axios.get(`${backendUrl}/projects/all`);
            return response;
        } catch (err) {
            err.response ? console.log(`error: ${err.response.data}`) : console.log(err.message);
        }
    }

    console.log(getAll())
    let database = getAll()
    console.log(database);

*/
   /* useEffect(() => {
        // Fetch the data when the component is mounted
        axios
            .get(`url here`)
            .then(res => {
                // Store the response (the rows) in the state variable.
                setRows(res)
            })
    }, [])

    /*
     * On the initial mount nothing will be rendered, when the rows variable
     * is updated a re-render will be triggered and your rows can be rendered.
     */
  /*  return (
        <div>
            {rows.map(row => <tr>A row!</tr>)}
        </div>
    );
} */

 
    var data = rows.data
    console.log(data)

    if (data != undefined) {
        for (let index = 0; index < data.length; index++) {
            let username = data[index].user_ID;
            let projectname = data[index].project_name;
            let listElement = username + " - " + projectname;
            items.push(<li >{listElement}</li>)
        }
        console.log(items);

    }

    return (
        <>
           {items}
        </>
    )



}


export default OpenProject;