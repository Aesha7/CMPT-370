import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../style/GymSchedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const GymSchedule = () => {
  const [calEvents, setCalEvents] = useState([]);

  let tempEvents = [];

  let userID;
  let location = useLocation();
  userID = location.state._id;
  let curUserName = location.state.curUserName;

  const [staffLevel, setStaffLevel] = useState("");

  if (userID != null) {
    window.localStorage.setItem("_id", userID);
  }

  // setUserID(JSON.parse(window.localStorage.getItem('_id')));
  userID = window.localStorage.getItem("_id");

  const localizer = momentLocalizer(moment);
  let [currentEvent, setCurrentEvent] = useState("");
  const [users, setUsers] = useState([]);
  const [curUser, setCurUser] = useState([]);
  let [filter, setFilter] = useState(-1);

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
          data.forEach((event) => {
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

            let newEvent = {
              name: name,
              desc: desc,
              start: start,
              end: end,
              level: level,
              enrolled: enrolled,
            };
            if (filter == "-1") {
              tempEvents.push(newEvent);
            } else if (filter == "0" && event.level == 0) {
              tempEvents.push(newEvent);
            } else if (filter == "1" && event.level == 1) {
              tempEvents.push(newEvent);
            } else if (filter == "2" && event.level == 2) {
              tempEvents.push(newEvent);
            }
          });
          setCalEvents(tempEvents);
        });
    } catch (exception) {
      console.log(exception);
    }
  };

  const get_user_info = () => {
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
          setUsers(data.users);
          // set cur user to corresponding curUserName
          data.users.forEach(user =>{
            if(user.name == curUserName){
              setCurUser(user);
            }
          })
        });
    } catch (error) {
      console.log(error);
    }
  };

  const register_for_event = () => {
    try {
      fetch(server_URL + "add_course_user", {
        method: "POST",
        body: JSON.stringify({
          _id: userID,
          user_name: curUser.name,
          event_name: currentEvent.name,
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
        .then((text) => {
          const data = text;
          if (data == '"Error: event not found"') {
            alert("Event not found.");
          } else if (data == '"Error: user not found"') {
            alert("User not found.");
          } else if (data == '"Error: account not found"') {
            alert("Account not found.");
          } else if (data == '"Error: event already on user\'s event list"') {
            alert("You are already registered for this event.");
          } else if (data == '"Error: user level too low"') {
            alert("You are not a high enough level.");
          } else {
            alert("Course Registered!");
            get_db_events();
            closeForm();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const unregister = () => {
    try {
      fetch(server_URL + "remove_course_user", {
        method: "POST",
        body: JSON.stringify({
          _id: userID,
          user_name: curUser.name,
          event_name: currentEvent.name,
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
        .then((data) => {
          if (data == '"Error: event not on user\'s list"') {
            alert("There was an error with finding the event.");
          } else if (data == '"Error: account not found"') {
            alert("There was an error with getting your account.");
          } else if (data == '"Error: user not found"') {
            alert("There was an error with getting your account.");
          } else if (data == '"Error: event not found"') {
            alert("There was an error with finding the event.");
          } else {
            alert("Unregistration successful!");
            closeForm();
            closeConfirmation();
            get_db_events();
          }
        });
    } catch (exception) {
      console.log(exception);
    }
  };

  // getting data initially
  useEffect(() => {
    get_user_info();
    // getting the events
    get_db_events();
  }, []);

  const navigate = useNavigate();

  const goBack = () => {
    let path = "/my-account";
    navigate(path, { state: userID });
  };

  const showDetails = (calEvent) => {
    if (calEvent != currentEvent) {
      currentEvent = calEvent;
    }
    openForm();
  };

  const openForm = () => {
    document.getElementById("myForm-overlay").style.display = "block";
    let enrolledList = currentEvent.enrolled.map(a => a.name)


    document.getElementById("myForm").style.display = "block";
    document.getElementById("eventTitle").innerHTML = currentEvent.name;
    if (currentEvent.desc != "") {
      document.getElementById("eventDescription").innerHTML = currentEvent.desc;
    } else {
      document.getElementById("eventDescription").innerHTML = "N/A";
    }

    if (currentEvent.enrolled.find((user) => user.name == curUser.name)) {
      document.getElementById("registrationChecker").innerHTML =
        "You are registered for this event";
      document.getElementById("registrationButton").innerHTML = "Un-Register";
    } else {
      document.getElementById("registrationChecker").innerHTML =
        "You are not registered for this event";
      document.getElementById("registrationButton").innerHTML = "Register";
    }
  };

  const openConfirmationForm = () => {
    document.getElementById("confirmationForm").style.display = "block";
    document.getElementById("myForm-overlay").style.display = "block";
  };

  const closeConfirmation = () => {
    document.getElementById("confirmationForm").style.display = "none";
    document.getElementById("myForm-overlay").style.display = "none";
  };

  const closeForm = () => {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("myForm-overlay").style.display = "none";

    currentEvent = null;
  };

  const registerForEvent = (e) => {
    // add event to childs schedule (and probably family schedule)
    // kidsEvents[kidsEvents.length] = currentEvent;
    // close form
    e.preventDefault();

    if (currentEvent.enrolled.find((user) => user.name == curUser.name)) {
      // unregister();
      openConfirmationForm();
    } else {
      register_for_event();
      document.getElementById("myForm").style.display = "none";
    }

    // document.getElementById("myForm").style.display = "none";
  };

  const handleCurUser = (e) => {
    setCurUser(users[e.target.value]);
  };

  let j = -1;
  let nameDropDowns = users.map(function (i) {
    let render;
    if (i.name == curUserName) {
      render = (
        <option value={++j} selected>
          {i.name}
        </option>
      );
    } else {
      render = <option value={++j}>{i.name}</option>;
    }

    return render;
  });

  // handling the filter
  const handleFilter = (e) => {
    e.preventDefault();
    filter = e.target.value;
    get_db_events();
  };

  return (
    <div className="view-gym-schedule">
      <div className="top-bar">&nbsp;&nbsp;GYM SCHEDULE
        <div className="allButtons">
        {/* dropdown of children names*/}
        <select
          className="top-bar-buttons"
          id="childDropDown"
          onChange={handleCurUser}
        >
          {nameDropDowns}
        </select>
        <select
          className="top-bar-buttons"
          id="levelDropDown"
          onChange={handleFilter}
        >
          <option value="-1">All</option>
          <option value="0">Level: 1-2</option>
          <option value="1">Level: 2-3</option>
          <option value="2">Level: 3-4</option>
        </select>

        <button className="top-bar-button" onClick={goBack}>
            Back
        </button>
        </div>
      </div>

      <div className="form-popup" id="myForm">
        <form className="form-container">
          <div className="info-text-div">
            <h4 className="info-name-label">{curUser.name}</h4>
            <label for="title" className="event-info-label">
              <b>Title</b>
            </label>
            <h5 className="info-data-label" id="eventTitle">{currentEvent.name}</h5>

            <label for="desc" className="event-info-label">
              <b>Description</b>
            </label>

            <h5 className="info-data-label" id="eventDescription">{currentEvent.desc}</h5>

            <h5 className="info-data-label" id="registrationChecker" style={{color: "black"}}></h5>
          </div>

          <button
            type="submit"
            className="btn"
            onClick={registerForEvent}
            id="registrationButton"
          >
            Register
          </button>
          <button type="button" className="btn cancel" onClick={closeForm}>
            Cancel
          </button>
        </form>
      </div>

      <div className="myForm-overlay" id="myForm-overlay"></div>

      <div className="confirm-form-popup" id="confirmationForm">
        {/* <form className="form-container"> */}
        <h4>Are you sure you would like to un-enroll?</h4>
        <button type="submit" className="btn" onClick={unregister}>
          Un-enroll
        </button>

        <button
          type="button"
          className="btn cancel"
          onClick={closeConfirmation}
        >
          Cancel
        </button>
        {/* </form> */}
      </div>

      <div className="">
        <Calendar
          localizer={localizer}
          events={calEvents}
          startAccessor="start"
          defaultView="week"
          endAccessor="end"
          popup={false}
          views={["month", "week", "day"]}
          style={{ height: 700 }}
          onSelectEvent={showDetails}
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
      </div>
    </div>
  );
};
export default GymSchedule;
