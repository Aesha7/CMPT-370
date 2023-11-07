import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import "../style/AdminPage.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server



const AdminPage = () => {
    const location = useLocation();
    let userID = location.state;
    const [staffLevel, setStaffLevel] = useState('')


    console.log(userID);


    if(userID != null){
        window.localStorage.setItem('_id', userID);
      }
        
      // setUserID(JSON.parse(window.localStorage.getItem('_id')));
      userID = window.localStorage.getItem('_id')
      
    
      // getting data initially
      useEffect(() => {
        try {
          fetch(server_URL + "get_account_info", {
            method: "POST",
            body: JSON.stringify({ _id: userID }),
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
          })
          .then((response) => {
            return response.text(); // Get the response text
          })
          .then((text) => {
            // Parse the text as JSON
            const data = JSON.parse(text);
            console.log(data)

            setStaffLevel(data.staffLevel)
            })
        } catch (error) {
          console.log(error);
        }
      }, []);



      let navigate = useNavigate()

    const adminScheduleRoute = () =>{
        let path = "/admin-schedule";
        navigate(path, {state:userID})

    }
      // uncovering the page if a valid account
    if(staffLevel >= 1){
        document.getElementById("overlay").style.display = "none";
    }
    return (
    <div className="admin-page">
        <div className="top-bar">
            Admin
            <button className="top-bar-button" onClick={adminScheduleRoute}>Gym Schedule</button>
        </div>
        <div className="overlay" id="overlay">YOU DO NOT HAVE ACCESS TO THIS PAGE</div>
    </div>
        );
};
export default AdminPage
