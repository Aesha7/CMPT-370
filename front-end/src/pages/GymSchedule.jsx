import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "./GymSchedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css"


const server_URL = "http://127.0.0.1:5000/"; //URL to access server


const GymSchedule = () => {

    const [calEvents, setCalEvents] = useState([]);
    let tempEvents = [];
  
    let userID;
    let location = useLocation()
    userID = location.state;
    console.log(userID)
    const [staffLevel, setStaffLevel] = useState("");
  
    if (userID != null) {
      window.localStorage.setItem("_id", userID);
    }
  
    // setUserID(JSON.parse(window.localStorage.getItem('_id')));
    userID = window.localStorage.getItem("_id");

    const localizer = momentLocalizer(moment);
    const [currentEvent, setCurrentEvent] = useState('');
    const [users, setUsers] = useState([]);
    const [curUser, setCurUser] = useState([])
    let [filter, setFilter] = useState(-1);


const get_db_events = () =>{
    // getting the events
    try{
      fetch(server_URL + "retrieve_courses", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      }).then((response) =>{
        return response.text()
      }).then((text) => {
        const data = JSON.parse(text);
        data.forEach((event) => {
          let name = event.name;
          let desc = event.desc;
          let start = new Date(event.start.year, event.start.month, event.start.date, event.start.hour, event.start.minute, 0)
          let end = new Date(event.end.year, event.end.month, event.end.date, event.end.hour, event.end.minute, 0)
          let level = event.level

          let newEvent = {
            name: name,
            desc: desc,
            start: start,
            end: end,
            level: level
          }
          if(filter == "-1"){
            tempEvents.push(newEvent)
          }
          else if(filter == "0" && event.level == 0){
            tempEvents.push(newEvent)
          }
          else if(filter == "1" && event.level == 1){
            tempEvents.push(newEvent)
          }
          else if(filter == "2" && event.level == 2){
            tempEvents.push(newEvent)
          }
          console.log(newEvent)

          });
          setCalEvents(tempEvents)
        })
      } catch(exception){
      console.log(exception)
    }
  }

  const get_user_info = () =>{
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
          setUsers(data.users)
          setCurUser(data.users[0])
        });
    } catch (error) {
      console.log(error);
    }
  }

  const register_for_event = () =>{
    try{
      // alert(currentEvent.name)
      fetch(server_URL + "add_course_user", {
        method: "POST",
        body: JSON.stringify({ 
          _id : userID,
          user_name : curUser.name,
          event_name : currentEvent.name
         }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      }).then((response) =>{
        return response.text()
      }).then((text) =>{
        const data = text;
        console.log(data)
      })
    } catch(error){
      console.log(error)
    }
  }

    // getting data initially
    useEffect(() => {
      get_user_info()
      // getting the events
      get_db_events()
    }, []);
  
    const navigate = useNavigate();
    
    const goBack = () =>{
        let path = "/my-account";
        navigate(path, {state:userID})
    }

    const showDetails = (calEvent) =>{
        // alert(calEvent.description)
        console.log(calEvent)
        if(calEvent != currentEvent){
          setCurrentEvent(calEvent)
        }
        openForm()
    }

    const openForm = () => {
      // console.log(currentEvent)
        document.getElementById("myForm").style.display = "block";
        document.getElementById("eventTitle").innerHTML = currentEvent.title;
        // console.log(currentEvent.desc)
        if(currentEvent.desc != ""){
        document.getElementById("eventDescription").innerHTML = currentEvent.desc;
      }
      else{
        document.getElementById("eventDescription").innerHTML = "N/A"}
        };


    const closeForm = () =>{
        document.getElementById("myForm").style.display = "none";
    }

    const registerForEvent = (e) =>{
        // add event to childs schedule (and probably family schedule)
        // kidsEvents[kidsEvents.length] = currentEvent;
        // close form
        e.preventDefault()

        register_for_event();
        document.getElementById("myForm").style.display = "none";
    }

     const handleCurUser = (e) =>{
      setCurUser(users[e.target.value]);
     }

    let j = -1
    let nameDropDowns = users.map(function (i) {
        return(
          <option value={++j}>{i.name}</option>
        )
      })

      // handling the filter
      const handleFilter = (e) => {
        e.preventDefault();
        // setFilter(e.target.value)
        filter = e.target.value
        get_db_events()
      }


    return(
        <div className="view-gym-schedule">
            <div className='gym-schedule-top-bar'>Gym Schedule
            <button className="gym-top-bar-button" onClick={goBack}>Back</button>

            {/* dropdown of children names (does nothing right now)*/}
            <select className='childDropDown' id="childDropDown" onChange={handleCurUser}>{nameDropDowns}</select>

            <select className='childDropDown' id="levelDropDown" onChange={handleFilter}>
              <option value="-1">All</option>
              <option value="0">Level: 1-2</option>
              <option value="1">Level: 2-3</option>
              <option value="2">Level: 3-4</option>

            </select>
            
            </div>

            <div className="">
            
                <div className="form-popup" id="myForm">
                    <form className="form-container">
                      <h4>{curUser.name}</h4>
                        <label for="title">
                            <b>Title</b>
                        </label>
                        <h5 id='eventTitle'>{currentEvent.name}</h5>

                        <label for="desc">
                        <b>Description</b>
                        </label>

                        <h5 id='eventDescription'>{currentEvent.desc}</h5>

                        <button type="submit" className="btn" onClick={registerForEvent}>
                        Register
                        </button>
                        <button type="button" className="btn cancel" onClick={closeForm}>
                        Cancel
                        </button>
                    </form>
                </div>

<script>{
  console.log("immediately before: ", calEvents)
  }</script>
                <Calendar
                    localizer={localizer}
                    events = {calEvents}
                    startAccessor="start"
                    defaultView="week"
                    endAccessor="end"
                    popup={false}
                    style={{ height: 700 }}
                    onSelectEvent={showDetails}
                    min={new Date(0, 0, 0, 10, 0, 0)}
                    max={new Date(0, 0, 0, 22, 0, 0)}
                    eventPropGetter={
                      (event, start, end, isSelected) =>{
                        let newStyle ={
                          backgroundColor: "lightgrey",
                          color: 'black',
                          borderRadius: "0px",
                          border: "none"
                        }
          
                        if(event.level == 0){
                          newStyle.backgroundColor = "aquamarine"
                        }
                        else if(event.level == 1){
                          newStyle.backgroundColor = "darkslategrey"
                          newStyle.color = "white"
                        }
                        else if(event.level == 2){
                          newStyle.backgroundColor = "lightblue"
                        }
          
                        return{className:"",
                      style: newStyle}
                      }
                    }
                ></Calendar>

            </div>

        </div>
        );
}
export default GymSchedule;