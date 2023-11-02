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
    const [staffLevel, setStaffLevel] = useState("");
  
    if (userID != null) {
      window.localStorage.setItem("_id", userID);
    }
  
    // setUserID(JSON.parse(window.localStorage.getItem('_id')));
    userID = window.localStorage.getItem("_id");
  
    const localizer = momentLocalizer(moment);

    let [email] = useState('');
    let [registrationChild, setRegistrationChild] = useState('')
    const [currentEvent, setCurrentEvent] = useState('');
    const [users, setUsers] = useState([]);
    const [curUser, setCurUser] = useState([])

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
            setUsers(data.users)
            setCurUser(data.users[0])
          });
      } catch (error) {
        console.log(error);
      }
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
          // let tempEvents = [];
          data.forEach((event) => {
            let name = event.name;
            let desc = event.description;
            let start = new Date(event.start.year, event.start.month, event.start.date, event.start.hour, event.start.minute, 0)
            let end = new Date(event.end.year, event.end.month, event.end.date, event.end.hour, event.end.minute, 0)
  
            let newEvent = {
              name: name,
              desc: desc,
              start: start,
              end: end
            }
  
            tempEvents.push(newEvent)
            });
            setCalEvents(tempEvents)
            // console.log(tempEvents)
          })
        } catch(exception){
        console.log(exception)
      }
    }, []);
  
    const navigate = useNavigate();
    
    const goBack = () =>{
        let path = "/my-account";
        navigate(path, {state:userID})
    }

    registrationChild = location.state.value

    const showDetails = (calEvent) =>{
        // alert(calEvent.description)
        setCurrentEvent(calEvent)
        openForm()
    }

    const openForm = () => {
        document.getElementById("myForm").style.display = "block";
        document.getElementById("eventTitle").innerHTML = currentEvent.title;
        document.getElementById("eventDescription").innerHTML = currentEvent.description;
        };

    const closeForm = () =>{
        document.getElementById("myForm").style.display = "none";
    }

    const registerForEvent = () =>{
        // add event to childs schedule (and probably family schedule)
        // kidsEvents[kidsEvents.length] = currentEvent;
        // close form
        document.getElementById("myForm").style.display = "none";
    }

     const handleCurUser = (e) =>{
      setCurUser(users[e.target.value]);
     }

    let j = -1
    let renders = users.map(function (i) {
        return(
          <option value={++j}>{i.name}</option>
        )
      })

    return(
        <div className="view-gym-schedule">
            <div className='gym-schedule-top-bar'>Gym Schedule
            <button className="gym-top-bar-button" onClick={goBack}>Back</button>

            {/* dropdown of children names (does nothing right now)*/}
            <select className='childDropDown' onChange={handleCurUser}>{renders}</select>
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
                ></Calendar>

            </div>

        </div>
        );
}
export default GymSchedule;