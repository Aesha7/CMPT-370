import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../style/CoachCalendarPage.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server


const CoachCalendarPage = () => {

  let userID;
  const [staffLevel, setStaffLevel] = useState("");
  
  let navigate = useNavigate();

  const goBack = () =>{
    let path = "/my-account";
    navigate(path, {state:userID})
  }

  if(staffLevel >= 1){
    document.getElementById("overlay").style.display = "none";
  }

  return (

    <div className="coach-calendar">
    <div className="top-bar">
      Gym Schedule
      <div className="allButtons">
      <button className="top-bar-button" onClick={goBack}>Back</button>
      </div>
    </div>
      <div className="overlay" id="overlay">YOU DO NOT HAVE ACCESS TO THIS PAGE!</div>
    </div>

  );
  
  };

export default CoachCalendarPage;