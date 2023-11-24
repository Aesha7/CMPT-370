import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../style/ViewFamilySchedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const ViewFamilySchedule = () => {
  const navigate = useNavigate();
  const localizer = momentLocalizer(moment);
  const location = useLocation();
  const [users, setUsers] = useState([]);
  let [curUser, setCurUser] = useState("");
  const [calEvents, setCalEvents] = useState([]);
  let temp = [];

  let [currentEvent, setCurrentEvent] = useState("");

  let [userID, setUserID] = useState("");
  userID = location.state;

  if (userID != null) {
    window.localStorage.setItem("_id", userID);
  }

  // setUserID(JSON.parse(window.localStorage.getItem('_id')));
  userID = window.localStorage.getItem("_id");

  const get_account_info = () => {
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
          if (curUser == "") {
            curUser = data.users[0];
            setCurUser(data.users[0]);
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * gets list of all events and filters the ones where
   * the current username is included in the enrolled list
   */
  const get_user_events = () => {
    // getting the events
    console.log(curUser.name);
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
          let tempEvents = [];
          data.forEach((event) => {
            let enrolledList = event.enrolled.map((a) => a.name);
            if (enrolledList.includes(curUser.name)) {
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

              tempEvents.push(newEvent);
            }
          });
          setCalEvents(tempEvents);
        });
    } catch (exception) {
      console.log(exception);
    }
  };

  const unregister = (e) => {
    e.preventDefault();

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
            get_user_events();
            closeConfirmation();
            closeForm();
          }
        });
    } catch (exception) {
      console.log(exception);
    }
  };

  useEffect(() => {
    get_account_info();
    get_user_events();
  }, []);

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
    document.getElementById("myForm").style.display = "block";
    document.getElementById("myForm-overlay").style.display = "block";
    document.getElementById("eventTitle").innerHTML = currentEvent.name;
    if (currentEvent.desc != "") {
      document.getElementById("eventDescription").innerHTML = currentEvent.desc;
    } else {
      document.getElementById("eventDescription").innerHTML = "N/A";
    }
  };

  const closeForm = () => {
    document.getElementById("myForm").style.display = "none";
    document.getElementById("myForm-overlay").style.display = "none";
  };

  const openConfirmationForm = (e) => {
    e.preventDefault();
    document.getElementById("confirmationForm").style.display = "block";
    document.getElementById("myForm-overlay").style.display = "block";
  };

  const closeConfirmation = () => {
    document.getElementById("confirmationForm").style.display = "none";
    document.getElementById("myForm-overlay").style.display = "none";
  };

  const handleUserChange = (e) => {
    curUser = users[e.target.value];
    setCurUser(users[e.target.value]);
    get_user_events();
  };

  let j = -1;
  let nameDropDowns = users.map(function (i) {
    let element;
    if (curUser == i) {
      element = (
        <option value={++j} key={i.name} selected>
          {i.name}
        </option>
      );
    } else {
      element = (
        <option value={++j} key={i.name}>
          {i.name}
        </option>
      );
    }

    return element;
  });

  return (
    <div className="view-family-schedule">
      <div className="top-bar">
        &nbsp;&nbsp;FAMILY SCHEDULE
        <div className="allButtons">
          <select className="top-bar-buttons" onChange={handleUserChange}>
            {nameDropDowns}
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
            <label for="title">
              <b>Title</b>
            </label>
            <h5 className="info-data-label" id="eventTitle">
              {currentEvent.name}
            </h5>

            <label for="desc">
              <b>Description</b>
            </label>

            <h5 className="info-data-label" id="eventDescription">
              {currentEvent.desc}
            </h5>
          </div>

          <button type="submit" className="btn" onClick={openConfirmationForm}>
            Un-Register
          </button>
          <button type="button" className="btn cancel" onClick={closeForm}>
            Close
          </button>
        </form>
      </div>

      <div className="myForm-overlay" id="myForm-overlay"></div>

      <div className="confirm-form-popup" id="confirmationForm">
        <h4 className="confirm-form-popup-header">
          Are you sure you would like to un-enroll?
        </h4>
        <button type="" className="btn" onClick={unregister}>
          Un-enroll
        </button>
        <button
          type="button"
          className="btn cancel"
          onClick={closeConfirmation}
        >
          Cancel
        </button>
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
export default ViewFamilySchedule;
