import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "../style/ViewAccountPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const UserLevelPage = () => {
    const location = useLocation();

    let [ userID, setUserID ] = useState("");
    let [ userName, setUserName ] = useState("");
    userID = location.state._id;
    userName = location.state.curUserName;

    if (userID != null) {
        window.localStorage.setItem("_id", userID);
      }
      // getting it from local storage
      userID = window.localStorage.getItem("_id");

      
    useEffect(() =>{
        // console.log(userID, userName)
    }, [])


  return (
    <h1>test</h1>
  );
};

export default UserLevelPage;
