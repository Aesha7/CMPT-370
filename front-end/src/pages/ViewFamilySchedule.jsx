import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "./ViewFamilySchedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css"

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const ViewFamilySchedule = () => {

    const navigate = useNavigate();
    const localizer = momentLocalizer(moment);

    const location = useLocation()
    const [users, setUsers] = useState([])
    let [curUser, setCurUser] = useState();
    const [calEvents, setCalEvents] = useState([])
    let temp = [];

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
                if(data == '"Error: account not found"'){
                  alert("User not found")
                }
                else {
                setUsers(data.users)
                curUser = data.users[0]
                setCurUser(data.users[0])
                console.log("curUser", curUser)
                get_user_events();
        }});
          } catch (error) {
            console.log(error);
          }
    }

    const get_user_events = () =>{
        try {
            fetch(server_URL + "retrieve_user_courses", {
              method: "POST",
              body: JSON.stringify({ 
                _id: userID, 
                name: curUser.name }),
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
                
                data.forEach((event) =>{
                  // getting the event info
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
                        }).then((response2) =>{
                            return response2.text()
                        }).then((text2)=>{
                          let data2 = text2
                          if(data2 == '"Error: event not found"'){
                            alert("Event not found")
                          } else {
                            let event = JSON.parse(data2)
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
                          console.log(newEvent)
                            temp.push(newEvent)
                    }})
                    } catch(exception) {
                        console.log(exception)
                    }
                })
                console.log(temp)
                setCalEvents(temp);
              });
          } catch (error) {
            console.log(error);
          }
    }

    useEffect(() =>{
        get_account_info();
    },[])

    const goBack = () =>{
        let path = "/my-account";
        navigate(path, {state:userID})
    }

    const showDetails = (calEvent) =>{
        alert(calEvent.description)
    }

    let j = -1
    let nameDropDowns = users.map(function (i) {
        return(
          <option value={++j}>{i.name}</option>
        )
      })

    return(
        <div className="view-family-schedule">
            <div className='top-bar'>Family Schedule
                <select className="childDropDown">{nameDropDowns}</select>
                <button className="top-bar-button" onClick={goBack}>Back</button>
            </div>

            <div className="">
            <Calendar
                    localizer={localizer}
                    events = {temp}
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
export default ViewFamilySchedule;