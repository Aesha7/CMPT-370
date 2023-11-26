import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../style/CoachCalendarPage.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server


const CoachCalendarPage = () => {
  const location = useLocation();
  const localizer = momentLocalizer(moment);

  const [staffLevel, setStaffLevel] = useState("");
  const [coachName, setcoachName] = useState("");
  const [calEvents, setCalEvents] = useState([]);
  const [currentCalEvent, setCurrentCalEvent] = useState([]);
  const [updateDummy, forceUpdate] = useState(0);

  let [userID, setUserID] = useState("");
  userID = location.state;
  
  let navigate = useNavigate();

  const goBack = () =>{
    let path = "/my-account";
    navigate(path, {state:userID})
  }

  // prevent crash from undefined student array before selecting a class
  if(currentCalEvent.enrolled == undefined){
    currentCalEvent.enrolled = [];
  }
  if(currentCalEvent.attendance == undefined){
    currentCalEvent.attendance = [];
  }
  

  if(staffLevel >= 1){
    document.getElementById("overlay").style.display = "none";
  }


  const get_coach_name = () => {
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
          //// Parse the text as JSON
          const data = JSON.parse(text);
          setcoachName(data.users[0].name);
        });
    } catch (error) {
      console.log(error);
    }
  };

  let tempEvents = [];

  const get_db_events = () => {
    // getting the events
    try {
      fetch(server_URL + "retrieve_courses", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      })
        .then((response) => {
          return response.text();
        })
        .then((text) => {
          const data = JSON.parse(text);
          // parsing through each event in the db
          data.forEach((event) => {

            // getting the actual data
            if(event.coach == coachName){
              
              let name = event.name;
              let desc = event.desc;
              let start = new Date(
                event.start.year,
                event.start.month,
                event.start.date,
                event.start.hour,
                event.start.minute,
                0
              );
              let end = new Date(
                event.end.year,
                event.end.month,
                event.end.date,
                event.end.hour,
                event.end.minute,
                0
              );
              let level = event.level;
              let enrolled = event.enrolled;
              let coach = event.coach;
              let attendance
              try {
                attendance = event.attendance;
              } catch{
                attendance = [];
              }

              if(enrolled === undefined){
                enrolled = [];
              }
              

              //// creating the new event to use in the array
              let newEvent = {
                name: name,
                desc: desc,
                start: start,
                end: end,
                level: level,
                enrolled: enrolled,
                coach: coach,
                attendance: attendance
              };
              tempEvents.push(newEvent);
            }

          });

          /// setting the events
          setCalEvents(tempEvents);
        });
    } catch (exception) {
      console.log(exception);
    }
    forceUpdate(updateDummy + 1);
  };

  const onSelectEvent = (calEvent) => {
    /// handle no attendance data
    if(calEvent.attendance == undefined){
      calEvent.attendance = [];
    }
    if(calEvent.attendance.length == 0){
      calEvent.attendance.push({date: moment(), attendanceDate: []})
      
      calEvent.enrolled.forEach(enrolledStudent => calEvent.attendance[(calEvent.attendance).length-1].attendanceDate.push({name: enrolledStudent.name, present: false, feedback: ""}));
    }
    
    setCurrentCalEvent(calEvent);
  }

  const onCheckChange = (student) => (event) => {
    //update checkboxes
    currentCalEvent.attendance[(currentCalEvent.attendance).length-1].attendanceDate.find(currentStudent => currentStudent.name === student).present = event.target.checked;
    forceUpdate(updateDummy + 1);
  }

  const onFeedbackChange = (student) => (event) => {
    //read feedback
    currentCalEvent.attendance[(currentCalEvent.attendance).length-1].attendanceDate.find(currentStudent => currentStudent.name === student).feedback = event.target.value;
    forceUpdate(updateDummy + 1);
  }

  const saveAttendance = (event) => {
    //push attendance info to database
    try {
      fetch(server_URL + "edit_attendance", {
        method: "POST",
        body: JSON.stringify({
          account_ID: userID,
          name: currentCalEvent.name,
          attendance: currentCalEvent.attendance
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      })
        .then((response) => {
          return response.text();
        })
    } catch (exception) {
      console.log(exception);
    }
  }


  useEffect(() => {
    //inti calendar
    get_coach_name();
    get_db_events();
    forceUpdate(updateDummy + 1);
  }, [])

  return (

    <div className="coach-calendar">
    <div className="top-bar">
      &nbsp;&nbsp;GYM SCHEDULE
      <div className="allButtons">
      <button className="top-bar-button" onClick={goBack}>Back</button>
      </div>
    </div>
      <div>
        <Calendar
          className="coach-calendar-rbc"
          localizer={localizer}
          events={calEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={["month", "week", "day"]}
          popup={false}
          style={{ height: 700}}
          onSelectEvent={onSelectEvent}
          min={new Date(0, 0, 0, 10, 0, 0)}
          max={new Date(0, 0, 0, 22, 0, 0)}
          eventPropGetter={(event, start, end, isSelected) => {
            let newStyle = {
              backgroundColor: "lightgrey",
              color: "black",
              borderRadius: "0px",
              border: "none",
            };

            // setting event colours depending on level
            if (event.level == 0) {
              newStyle.backgroundColor = "#34624d";
              newStyle.color = "white";
            } else if (event.level == 1) {
              newStyle.backgroundColor = "#e7bf6a";
              newStyle.color = "white";
            } else if (event.level == 2) {
              newStyle.backgroundColor = "#4b7588";
              newStyle.color = "white";
            }

            return { className: "", style: newStyle };
          }}
        ></Calendar>
        <div className="student-list">
          Student Attendance
          <div>
            {"Course: " + currentCalEvent.name}
          </div>
          {currentCalEvent.enrolled.map(student => {
            return (
              <div>
                <div>
                  <input
                    type="checkbox"
                    checked={currentCalEvent.attendance[(currentCalEvent.attendance).length-1].attendanceDate.find(currentStudent => currentStudent.name === student.name).present}
                    onChange={onCheckChange(student.name)}
                  />
                  {student.name}
                </div>
                <div>
                  feedback
                  <input onChange={onFeedbackChange(student.name)} 
                  value={currentCalEvent.attendance[(currentCalEvent.attendance).length-1].attendanceDate.find(currentStudent => currentStudent.name === student.name).feedback}/>
                </div>
              </div>
            )
          })
        }
          <button onClick={saveAttendance}>
            Save Attendance/Feedback
          </button>
        </div>
      </div>
    </div>

  );
  
  };

export default CoachCalendarPage;