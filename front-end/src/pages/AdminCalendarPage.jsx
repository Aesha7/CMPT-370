import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from "react-big-calendar";
import DatePicker from "react-datepicker";
import moment from "moment";
import "../style/AdminCalendarPage.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const AdminCalendarPage = () => {
  const localizer = momentLocalizer(moment);
  const location = useLocation();
  // for event
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [date, setDate] = useState();
  const [startTime, setStartTime] = useState();
  const [duration, setDuration] = useState();
  const [capacity, setCapacity] = useState();

  const [coach, setCoach] = useState("");
  const [user, setUser] = useState("");

  // the list of events
  const [calEvents, setCalEvents] = useState([]);

  // changes when you click on an event
  let currentEvent = null;

  // temporary variable to set calendar events
  let tempEvents = [];

  // getting user ID from previous page
  let userID;
  userID = location.state;
  const [staffLevel, setStaffLevel] = useState("");

  // saving the userID to local storage so it doesnt crash on page refresh
  if (userID != null) {
    window.localStorage.setItem("_id", userID);
  }

  // setUserID(JSON.parse(window.localStorage.getItem('_id')));
  userID = window.localStorage.getItem("_id");

  // getting the database events
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

            // creating the new event to use in the array
            let newEvent = {
              name: name,
              desc: desc,
              start: start,
              end: end,
              level: level,
              enrolled: enrolled,
              coach: coach
            };

            // adding to the array
            tempEvents.push(newEvent);
          });

          // setting the events
          setCalEvents(tempEvents);
        });
    } catch (exception) {
      console.log(exception);
    }
  };


  // getting the account details from the db using the userID
  const get_account_details = () => {
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
          setStaffLevel(data.staffLevel);
          setUser(data);
        });
    } catch (error) {
      console.log(error);
    }
  };


  // deleting an event from the database (goes through enrolled list too)
  const delete_event_call = () => {
    // removing for all enrolled members
    // this should work when the backend is fixed
    try {
      fetch(server_URL + "delete_course", {
        method: "POST",
        body: JSON.stringify({
          account_ID: userID,
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
          // getting the updated db events
          

        if(data == '"Error: account not found"'){
          alert("Account not found.")
        }
        else if(data == '"Error: you do not have permission to perform this action"'){
          alert("You do not have permission to perform this action.")
        }
        else if(data == '"Error: event not found"'){
          alert("Event not found.")
        }
        else{
          // updating the events list and closing popup
          get_db_events();
          closeAllForms();
        }
        });
    } catch (exception) {
      console.log(exception);
    }
  };

  // getting data initially
  useEffect(() => {
    get_account_details();
    get_db_events();
  }, []);

  const clickRef = useRef(null);
  let navigate = useNavigate();

  // going to previous page
  const goBack = () => {
    let path = "/my-account";
    navigate(path, { state: userID });
  };

  const onSelectEvent = (calEvent) => {
    // what happens when an event is clicked
    currentEvent = calEvent;
    // opens the info popup
    openEventInfoForm(calEvent);
  };

  // opens the create event popup
  const openEventCreateForm = () => {
    // opening the createEvent form
    document.getElementById("myForm-overlay").style.display = "block";
    document.getElementById("createEventForm").style.display = "block";
  };

  const openEventInfoForm = (calEvent) => {
    // setting html for event info & displaying the form

    document.getElementById("clickInformation").style.display = "block";
    document.getElementById("eventTitle").innerHTML = calEvent.name;
    document.getElementById("eventDescription").innerHTML = calEvent.desc;
    document.getElementById("eventEnroll").innerHTML = calEvent.enrolled.length;
  };

  // closes all popups
  const closeAllForms = () => {
    setTitle("");
    setDescription("");

    document.getElementById("createEventForm").style.display = "none";
    document.getElementById("clickInformation").style.display = "none";
    document.getElementById("myForm-overlay").style.display = "none";
  };

  // handles the title
  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  // handles the description
  const handleDesc = (e) => {
    setDescription(e.target.value);
  };

  // handles the level
  const handleLevel = (e) => {
    setLevel(e.target.value);
  };

    // handles the date
  const handleDate = (inputDate) => {
    // handles the datepicker event
    setDate(inputDate);
    let arr = inputDate.toString().split(" ");
    let months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    // parsing through the date to get relevent info
    setStartDate(arr[2]);
    setStartYear(arr[3]);
    // mapping string to the month value
    setStartMonth(months[arr[1]]);
  };

  // handles the coach
  const handleCoach = (e) => {
    setCoach(e.target.value);
  };

  // handles the start time
  const handleStartTime = (e) => {
    setStartTime(e.target.value);
  };

  // handles the duration of the event
  const handleDuration = (e) => {
    setDuration(e.target.value);
  };

  const handleCapacity=(e) =>{
    setCapacity(e.target.value)
  }

  // creating the event
  const submitEvent = (e) => {
    e.preventDefault();
    if (title == "") {
      alert("Please insert a title.");
    } else if (level == "") {
      alert("Please select a level.");
    } else if (coach == "") {
      alert("Please include a coach.");
    } else if (!validTime(startTime)) {
      alert("Please insert a valid start time.");
    } else if (startYear == "" || startMonth == "" || startDate == "") {
      alert("Pleaase select a valid date");
    } else if (!validTime(duration)) {
      alert("Please insert a valid duration.");
    } else if(capacity == "") {
      alert("Please input a valid capacity.");
    }
    else {
      // getting relevent info for start and end time
      let arr = startTime.split(":");
      let arr2 = duration.split(":");

      let event = {
        name: title,
        desc: description,
        start: {
          year: startYear,
          month: startMonth,
          date: startDate,
          hour: arr[0],
          minute: arr[1],
        },
        end: {
          year: startYear,
          month: startMonth,
          date: startDate,
          hour: parseInt(arr[0]) + parseInt(arr2[0]),
          minute: parseInt(arr[1]) + parseInt(arr2[1]),
        },
        level: level,
        coach_email: coach,
      };

      // sending to database
      try {
        fetch(server_URL + "add_course", {
          method: "POST",
          body: JSON.stringify({
            account_ID: userID,
            name: event.name,
            desc: event.desc,
            startYear: event.start.year,
            startMonth: event.start.month,
            startDate: event.start.date,
            startHour: event.start.hour,
            startMin: event.start.minute,
            endYear: event.end.year,
            endMonth: event.end.month,
            endDate: event.end.date,
            endHour: event.end.hour,
            endMin: event.end.minute,
            level: event.level,
            coach_email: coach,
            capacity: capacity,
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

            if(data == '"Error: event name already exists"'){
              alert("An event with this name already exists.")
            }
            else if(data == '"Error: you do not have permission to perform this action"'){
              alert("You do not have permission to add an event.")
            }
            else if(data == '"Error: target coach account is not a staff account"'){
              alert("The email you provided does not correspond to a coaches account.")
            }
            else if(data == '"Error: coach account not found"'){
              alert("The email you provided does not correspond to a coaches account.")
            }
            else {
              closeAllForms();
              get_db_events();
            }
          });
      } catch (exception) {
        console.log(exception);
      }
    }
  };

  // deleting an event from the db with a button
  const deleteEvent = (e) => {
    e.preventDefault();

    if (currentEvent.enrolled.length > 0) {
      alert("this event has enrolled members")
      // check
      delete_event_call();
      // display the confirmation form
    } else {
      delete_event_call();
    }
  };

  // checks to see if a time is a valid representation using a regular expression
  function validTime(time) {
    // Regular expression for a valid email address
    const timeRegex = /^(1[0-2]|0?[1-9]):([0-5]?[0-9])(●?[AP]M)?$/;

    return timeRegex.test(time);
  }

  // overlay if the user shouldnt be able to see the page
  if (staffLevel >= 3) {
    document.getElementById("overlay").style.display = "none";
  }

  return (
    <div className="admin-calendar">
      <div className="top-bar">
        Gym Schedule
        <div className="allButtons">
          <button className="top-bar-button" onClick={openEventCreateForm}>
            Add Event
          </button>
          <button className="top-bar-button" onClick={goBack}>
            Back
          </button>
        </div>
      </div>

      <div className="">
        <div className="form-popup" id="clickInformation">
          <form className="form-container">
            <label for="title">
              <b>Title</b>
            </label>
            <h5 id="eventTitle">{}</h5>

            <label for="desc">
              <b>Description</b>
            </label>

            <h5 id="eventDescription">{}</h5>

            <label for="enrolled">
              <b>Enrolled Count</b>
            </label>

            <h5 id="eventEnroll">{}</h5>

            <button type="button" className="btn cancel" onClick={deleteEvent}>
              Delete Event
            </button>

            <button
              type="button"
              className="btn cancel"
              onClick={closeAllForms}
            >
              Cancel
            </button>
          </form>
        </div>

        <div className="myForm-overlay" id="myForm-overlay"></div>
        
        <div className="add-course-popup" id="createEventForm">
          <form className="form-container">
            <h1>Add Event</h1>

            <label for="title">
              <b>Title *</b>
            </label>
            <input
              type="title"
              placeholder="Enter Title"
              name="title"
              onChange={handleTitle}
              required
            ></input>

            <label for="desc">
              <b>Description</b>
            </label>
            <input
              type="description"
              placeholder="Enter Description"
              name="desc"
              onChange={handleDesc}
              required
            ></input>

            <br></br>
            <label for="coach">
              <b>Coach Email * </b>
            </label>
            <input
              type="coach"
              placeholder="Enter the coach's email"
              name="coach"
              onChange={handleCoach}
              required
            ></input>

            <br></br>
            <label for="level">
              <b>Level *</b>
            </label>

            <select className="level-dropdown" onChange={handleLevel}>
              <option value="">Level</option>
              <option value="0">1-2</option>
              <option value="1">2-3</option>
              <option value="2">3-4</option>
            </select>

            <br></br>

            <label for="capacity">
              <b>Capacity *</b>
            </label>

            <input
              type="number"
              min="1" 
              max="100"
              placeholder="Please enter the Capacity"
              name="capacity"
              onChange={handleCapacity}
              required
            ></input>

            <DatePicker
              className="custom-datepicker"
              selected={date}
              onChange={handleDate}
              dateFormat="MM/dd/yyyy"
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date(2099, 11, 31)}
              showMonthDropdown={true}
              showYearDropdown={true}
              todayButton="Today"
              dropdownMode="select"
              placeholderText="Select a date"
            />
            <label><b>Start Time*</b></label>
            <input 
              placeholder="Hour:Minute"
              onChange={handleStartTime}
              type="startTime"
              name="startTime"
              required
             ></input>
            <label><b>Duration*</b></label>
            <input 
              placeholder="Hour:Minute" 
              onChange={handleDuration}
              type="duration"
              name="duration"
              required
            ></input>

            <button type="submit" className="btn" onClick={submitEvent}>
              Create Event
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={closeAllForms}
            >
              Cancel
            </button>
          </form>
        </div>

        <Calendar
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
              newStyle.backgroundColor = "#4e9b6f";
            } else if (event.level == 1) {
              newStyle.backgroundColor = "#f3c26e";
              newStyle.color = "white";
            } else if (event.level == 2) {
              newStyle.backgroundColor = "#75caef";
            }

            return { className: "", style: newStyle };
          }}
          // onDoubleClickEvent={onDoubleClickEvent}
        ></Calendar>
      </div>
      <div className="overlay" id="overlay">
        YOU DO NOT HAVE ACCESS TO THIS PAGE!
      </div>
    </div>
  );
};
export default AdminCalendarPage;
