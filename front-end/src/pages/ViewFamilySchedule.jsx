import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "../style/ViewFamilySchedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css"


const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const ViewFamilySchedule = () => {
    const navigate = useNavigate();
    const localizer = momentLocalizer(moment);
    const location = useLocation()
    const [users, setUsers] = useState([])
    let [curUser, setCurUser] = useState();
    const [calEvents, setCalEvents] = useState([])
    let temp = []

    let [currentEvent, setCurrentEvent] = useState('');



    let [userID, setUserID] = useState("")
    userID = location.state;

    if (userID != null) {
      window.localStorage.setItem("_id", userID);
    }
  
    // setUserID(JSON.parse(window.localStorage.getItem('_id')));
    userID = window.localStorage.getItem("_id");

    const get_account_info = () =>{
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
                if(curUser == null){
                  curUser = data.users[0]
                }
                get_user_events()
              });
          } catch (error) {
            console.log(error);
          }
    }

    const get_user_events = () =>{
       curUser.courses.forEach((event) =>{
        try{
            fetch(server_URL + "get_course", {
                method: "POST",
                body: JSON.stringify({ 
                    name: event.name
                }),
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                },
            }).then((response) =>{
                return response.text()
            }).then((data)=>{
              
              let event = JSON.parse(data)
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
              temp.push(newEvent)
            })
        } catch(exception) {
            console.log(exception)
        }
    })
    setCalEvents(temp);
    }

    useEffect(() =>{
        get_account_info();
    },[])


    const goBack = () =>{
        let path = "/my-account";
        navigate(path, {state:userID})
    }



    const showDetails = (calEvent) =>{
        // alert(calEvent.description)
        // console.log(calEvent)
        if(calEvent != currentEvent){
          // setCurrentEvent(calEvent)
          currentEvent = calEvent
        }
        console.log(currentEvent.title)


        openForm()    
      }

      const openForm = () => {
        // console.log(currentEvent)
          document.getElementById("myForm").style.display = "block";
          document.getElementById("eventTitle").innerHTML = currentEvent.name;
          // console.log(currentEvent.desc)
          if(currentEvent.desc != ""){
          document.getElementById("eventDescription").innerHTML = currentEvent.desc;
        }
        else{
          document.getElementById("eventDescription").innerHTML = "N/A"
        }
          };


      const unregister = (e) =>{
        e.preventDefault()

        console.log(currentEvent)

      }
  
  
      const closeForm = () =>{
          document.getElementById("myForm").style.display = "none";
      }

    const handleUserChange = (e) =>{
      // e.preventDefault()
      curUser = users[e.target.value]
      get_user_events();
    }

    let j = -1
    let nameDropDowns = users.map(function (i) {
        return(
          <option value={++j} key={i.name}>{i.name}</option>
        )
      })

    return(
        <div className="view-family-schedule">
            <div className='top-bar'>Family Schedule
                <select className="childDropDown" onChange={handleUserChange}>{nameDropDowns}</select>
                <button className="top-bar-button" onClick={goBack}>Back</button>
            </div>

            <div className="form-popup" id="myForm">
                    <form className="form-container">
                      {/* <h4>{curUser.name}</h4> */}
                        <label for="title">
                            <b>Title</b>
                        </label>
                        <h5 id='eventTitle'>{currentEvent.name}</h5>

                        <label for="desc">
                        <b>Description</b>
                        </label>

                        <h5 id='eventDescription'>{currentEvent.desc}</h5>

                        <button type="submit" className="btn" onClick={unregister}>
                        Un-Register
                        </button>
                        <button type="button" className="btn cancel" onClick={closeForm}>
                        Close
                        </button>
                    </form>
                </div>


            <div className="">
            <Calendar
                    localizer={localizer}
                    events = {calEvents}
                    startAccessor="start"
                    defaultView="week"
                    endAccessor="end"
                    popup={false}
                    views={["month", "week", "day"]}
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
export default ViewFamilySchedule;
