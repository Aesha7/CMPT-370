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

  // storing the userID in local storage so refreshing doesnt break the page
  if (userID != null) {
    window.localStorage.setItem("_id", userID);
  }
  userID = window.localStorage.getItem("_id");

  /**
   * getting the necessary user information from the backend
   */
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
   * getting the user events from the backend
   */
  const get_user_events = () => {
    if (curUser != "") {
      // parsing through each event in the userEvents
      curUser.courses.forEach((event) => {
        try {
          fetch(server_URL + "get_course", {
            method: "POST",
            body: JSON.stringify({
              name: event.name,
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

              // getting each event
              let event = JSON.parse(data);
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
              let newEvent = {
                name: name,
                desc: desc,
                start: start,
                end: end,
                level: level,
              };
              // adding event to array
              temp.push(newEvent);
            });
        } catch (exception) {
          console.log(exception);
        }
      });

      // setting the state
      setCalEvents(temp);
    }
  };

  /**
   * removing event from users course list  
   */
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

            // updating user events and closing the popup
            get_user_events();
            closeForm();
          }
        });
    } catch (exception) {
      console.log(exception);
    }
  };

  // updates with state changes
  useEffect(() => {
    get_account_info();
    get_user_events();
  }, [curUser]);

  /**
   * going back to previous page
   */
  const goBack = () => {
    let path = "/my-account";
    navigate(path, { state: userID });
  };

  /**
   * shows details of clicked on event
   * @param {*} calEvent the clicked on event
   */
  const showDetails = (calEvent) => {
    if (calEvent != currentEvent) {
      currentEvent = calEvent;
    }
    // opening the form
    openForm();
  };

  /**
   * displays event details
   */
  const openForm = () => {
    document.getElementById("myForm").style.display = "block";
    document.getElementById("eventTitle").innerHTML = currentEvent.name;
    if (currentEvent.desc != "") {
      document.getElementById("eventDescription").innerHTML = currentEvent.desc;
    } else {
      document.getElementById("eventDescription").innerHTML = "N/A";
    }
  };

  /**
   * closes the form
   */
  const closeForm = () => {
    document.getElementById("myForm").style.display = "none";
  };

  /**
   * handles the user dropdown
   * @param {} e 
   */
  const handleUserChange = (e) => {
    setCurUser(users[e.target.value]);
    get_user_events();
  };

  // rendering the user dropdown
  let j = -1;
  let nameDropDowns = users.map(function (i) {
    let element;
    element = (
      <option value={++j} key={i.name}>
        {i.name}
      </option>
    );
    return element;
  });

  return (
    <div className="view-family-schedule">
      <div className="top-bar">
        Family Schedule
        <div className="allButtons">
        <select className="top-bar-button" onChange={handleUserChange}>
          {nameDropDowns}
        </select>
        <button className="top-bar-button" onClick={goBack}>
          Back
        </button>
        </div>
      </div>

      <div className="form-popup" id="myForm">
        <form className="form-container">
          <label for="title">
            <b>Title</b>
          </label>
          <h5 id="eventTitle">{currentEvent.name}</h5>

          <label for="desc">
            <b>Description</b>
          </label>

          <h5 id="eventDescription">{currentEvent.desc}</h5>

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
            if (event.level == 0) {
              newStyle.backgroundColor = "#4e9b6f";
            } else if (event.level == 1) {
              newStyle.backgroundColor = "#f3c26e";
              newStyle.color = "white";
            } else if (event.level == 2) {
              newStyle.backgroundColor = "#75caef";
            }
            return { className: "", style: newStyle };
          }}
        ></Calendar>
      </div>
    </div>
  );
};
export default ViewFamilySchedule;
