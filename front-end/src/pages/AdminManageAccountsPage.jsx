import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import "../style/AdminManageAccountsPage.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const AdminManageAccountsPage = () => {
    const location = useLocation();
    let userID = location.state;
    const [staffLevel, setStaffLevel] = useState('')

    console.log(userID);
    let userEmail;

    /**
    * Modify coach account
    */
    const modifyAccountsStaff = () => {
      try {
        fetch(server_URL + "change_staff_level", {
          method: "POST",
          body: JSON.stringify({ admin_ID: userID, email: userEmail, level: 1 }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
        }).then((response) => {

          return response.text();
        }).then((text) => {
          // parse the text as JSON
          const data = JSON.parse(text);
          
          if (text == '"Error: admin account not found"') {
            alert('"Error: admin account not found"');
          }
          if (data == '"Error: user account not found"') {
            alert('"Error: user account not found"');
          }
          if (data == '"Error: you do not have permission to perform this action"') {
            alert('"Error: you do not have permission to perform this action"');
          }
          if (data == '"Error: target account\'s staff level is too high to change."') {
            alert('"Error: target account\'s staff level is too high to change."');
          }
        })
      }
      catch (exception){
        console.log(exception)
      }
    }

    if(userID != null){
        window.localStorage.setItem('_id', userID);
      }
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
            return response.text(); // get the response text
          })
          .then((text) => {
            // parse the text as JSON
            const data = JSON.parse(text);
            console.log(data)

            setStaffLevel(data.staffLevel)
            })
        } catch (error) {
          console.log(error);
        }
      }, []);

      let navigate = useNavigate();

    /**
    * Perform page routing
    */
    const goBack = () =>{
      let path = "/my-account";
      navigate(path, {state:userID})
    }

    /**
    * Unhide page if admin account
    */
    if(staffLevel >= 3){
        document.getElementById("overlay").style.display = "none";
    }

    return (
    <div className="admin-page">
      <div className="top-bar">
        Manage Accounts
        <div className="allButtons">
        <button className="top-bar-button" onClick={goBack}>Back</button>
        </div>
      </div>
        {/* display pop-up meesage for invalid user */}
        <div className="overlay" id="overlay">YOU DO NOT HAVE ACCESS TO THIS PAGE!</div>
    </div>
        );
};
export default AdminManageAccountsPage
