import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "../style/UserLevelPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const UserLevelPage = () => {
    const location = useLocation();
    let [name, setName] = useState("John");

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

    const navigate = useNavigate();

    const goBack = () => {
      let path = "/my-account";
      navigate(path, { state: userID });
    };


  return (
    // <h1>test</h1>
    <div className="user-level-page"> My Progression
      <label className="ownerNLabel" htmlFor="name">Name:{" "}</label>
      <label className="ownerName" htmlFor="name" type="name" id="name">{userName}</label>
      <button className="buttonBack" onClick={goBack}> Back </button>
      <button className="buttonSave" onClick={null}> Save </button>
      <button className="buttonAddTip" onClick={null}> Add Tip </button>
      <label className="labelSkills"> Skills</label>
    </div> 
  
    );
};

export default UserLevelPage;
