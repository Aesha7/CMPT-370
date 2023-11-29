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
  let [coachName, setcoachName] = useState("");
  const [calEvents, setCalEvents] = useState([]);
  const [currentCalEvent, setCurrentCalEvent] = useState([]);
  const [updateDummy, forceUpdate] = useState(0);

  let [userID, setUserID] = useState("");
  userID = location.state.userID;
  coachName = location.state.coachName;


  let navigate = useNavigate();

  const goBack = () => {
    let path = "/my-account";
    navigate(path, { state: userID });
  };

  const levelInfoRoute = (e) =>{
    let studentID = e.target.value
    let path = "/user-level";

    navigate(path, {state:{isCoach: true, coachName: coachName, coachID: userID, studentID: studentID}})

  }

  /// prevent crash from undefined student array before selecting a class
  if (currentCalEvent.enrolled == undefined) {
    currentCalEvent.enrolled = [];
  }
  if (currentCalEvent.attendance == undefined) {
    currentCalEvent.attendance = [];
  }

  if (staffLevel >= 1) {
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
            if (event.coach == coachName) {
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
              let attendance;
              try {
                attendance = event.attendance;
              } catch {
                attendance = [];
              }

              if (enrolled === undefined) {
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
                attendance: attendance,
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
    if (calEvent.attendance == undefined) {
      calEvent.attendance = [];
    }
    if (calEvent.attendance.find(day => day.date == moment().startOf("day").toString()) === undefined) {
      calEvent.attendance.push({ date: moment().startOf("day").toString(), attendanceDate: [] });
    }

    // populate attendance data with empty entries for each student
    for (var i = 0; i < calEvent.enrolled.length; i++) {
      if (calEvent.attendance[calEvent.attendance.length - 1].attendanceDate.find(
        attendanceStudent => attendanceStudent.name == calEvent.enrolled[i].name) == undefined) {
  
        calEvent.attendance[calEvent.attendance.length - 1].attendanceDate.push(
          { name: calEvent.enrolled[i].name, present: false, feedback: "" }
        )
      }
    }
    

    setCurrentCalEvent(calEvent);
    if (calEvent.enrolled.length != 0) {
      document.getElementById("save-feedback-button").style.display = "block";
    } else {
      document.getElementById("save-feedback-button").style.display = "none";
    }
  };

  const onCheckChange = (student) => (event) => {
    //update checkboxes
    currentCalEvent.attendance[
      currentCalEvent.attendance.length - 1
    ].attendanceDate.find(
      (currentStudent) => currentStudent.name === student
    ).present = event.target.checked;
    forceUpdate(updateDummy + 1);
  };

  const onFeedbackChange = (student) => (event) => {
    //read feedback
    currentCalEvent.attendance[
      currentCalEvent.attendance.length - 1
    ].attendanceDate.find(
      (currentStudent) => currentStudent.name === student
    ).feedback = event.target.value;
    forceUpdate(updateDummy + 1);
  };

  const saveAttendance = (event) => {
    //push attendance info to database
    try {
      fetch(server_URL + "edit_attendance", {
        method: "POST",
        body: JSON.stringify({
          account_ID: userID,
          name: currentCalEvent.name,
          attendance: currentCalEvent.attendance,
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      }).then((response) => {
        return response.text();

      }).then((data) =>{
        if(data == "\"Error: you do not have permission to perform this action\""){

          alert("Error: you do not have permission to perform this action")
        }
        else if(data == "\"Error: target coach account is not a staff account\""){
          alert("Error: target coach account is not a staff account")
        }
        else if(data == "\"Error: coach account not found\""){
          alert("Error: coach account not found")
        }
        else{
          alert("Attendance and feedback saved.")
        }
      });
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    get_db_events();
    forceUpdate(updateDummy + 1);
  }, []);

  // automatically increasing height

  function auto_height(e) {
    e.target.style.height = "1px";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }

  return (
    <div className="coach-calendar">
      <div className="top-bar">
        &nbsp;&nbsp;GYM SCHEDULE
        <div className="allButtons">
          <button className="top-bar-button" onClick={goBack}>
            Back
          </button>
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
          style={{ height: 700 }}
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
        <div>

          <div className="student-list">
            <div className="student-list-header">
              <label className="student-attendance-header">
                Student Attendance
              </label>
              <label className="coach-courseName-header">
                {"Course: " + currentCalEvent.name}

              </label>
            </div>

            {currentCalEvent.enrolled.map((student) => {
              return (
                <div className="student-feedback-div">
                  <div>
                    <input
                      type="checkbox"
                      className="attendance-checkbox"
                      checked={
                        currentCalEvent.attendance[
                          currentCalEvent.attendance.length - 1
                        ].attendanceDate.find(
                          (currentStudent) =>
                            currentStudent.name === student.name
                        ).present
                      }
                      onChange={onCheckChange(student.name)}
                    />

                    {student.name}
                  </div>
                  <div className="feedback-input-div">
                    <label className="feedback-label">feedback: </label>
                    <textarea
                      className="student-feedback"
                      onChange={onFeedbackChange(student.name)}
                      rows="40"
                      cols="4"
                      value={
                        currentCalEvent.attendance[
                          currentCalEvent.attendance.length - 1
                        ].attendanceDate.find(
                          (currentStudent) =>
                            currentStudent.name === student.name
                        ).feedback
                      }
                      onInput={auto_height}
                    />
                  </div>
                  <div>
                    {/* value is the students userID (NOT accountID) */}
                    <button className="coach-level-info-button" value={student._id["$oid"]} onClick={levelInfoRoute}>Level Info</button>
                  </div>
                </div>
              );
            })}
            <button
              className="save-feedback-button"
              onClick={saveAttendance}
              id="save-feedback-button"
            >
              Save Attendance/Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoachCalendarPage;
