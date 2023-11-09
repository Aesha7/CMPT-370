import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../style/AdminCalendarPage.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

// big calendar docs: https://jquense.github.io/react-big-calendar/examples/index.html?path=/docs/about-big-calendar--page

const server_URL = "http://127.0.0.1:5000/"; //URL to access server


const AdminCalendarPage = () => {
  const localizer = momentLocalizer(moment);
  const location = useLocation();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");

  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startHr, setStartHr] = useState("");
  const [startMin, setStartMin] = useState("");

  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endHr, setEndHr] = useState("");
  const [endMin, setEndMin] = useState("");

  const [coach, setCoach] = useState("");

  const [user, setUser] = useState("")

  // get relevant info from 'email'
  //JSON, needs to be dynamic (backend)

  const [calEvents, setCalEvents] = useState([]);
  let currentEvent = null;
  let tempEvents = [];

  let userID;
  userID = location.state;
  const [staffLevel, setStaffLevel] = useState("");


  if (userID != null) {
    window.localStorage.setItem("_id", userID);
  }

  // setUserID(JSON.parse(window.localStorage.getItem('_id')));
  userID = window.localStorage.getItem("_id");
  
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
        // let tempEvents = [];
        data.forEach((event) => {
          let name = event.name;
          let desc = event.desc;
          let start = new Date(event.start.year, event.start.month, event.start.date, event.start.hour, event.start.minute, 0)
          let end = new Date(event.end.year, event.end.month, event.end.date, event.end.hour, event.end.minute, 0)
          let level = event.level
          let enrolled = event.enrolled;

          let newEvent = {
            name: name,
            desc: desc,
            start: start,
            end: end,
            level: level,
            enrolled: enrolled
          }

          tempEvents.push(newEvent)
          });
          setCalEvents(tempEvents)
          // console.log(tempEvents)
        })
      } catch(exception){
      console.log(exception)
    }
  }

  const get_account_details = () =>{
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
          setUser(data)
        });
    } catch (error) {
      console.log(error);
    }
  }

  const delete_event_call = () =>{
    // removing for all enrolled members
    console.log(currentEvent.enrolled)
    currentEvent.enrolled.forEach((member) =>{
      try{
        fetch(server_URL + "admin_remove_course_user", {
          method: "POST",
          body: JSON.stringify({ admin_ID: userID,
                                email: user.email,
                                event_name: currentEvent.name,
                                user_name: member.name
           }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
      }).then((response) =>{
        return response.text()
      }).then((data) =>{
        console.log(data)
      })
    }catch(exception){
      console.log(exception)
    }
  })
  
}
   

  // getting data initially
  useEffect(() => {
    get_account_details()
    get_db_events()
  }, []);

  // months index starting at 0 (october is 9, january is 0...)
  // dates are normal


  
  const clickRef = useRef(null);
  let navigate = useNavigate();

  const goBack = () =>{
    let path = "/my-account";
    navigate(path, {state:userID})
  }

  const onSelectEvent = (calEvent) => {
    // what happens when an event is clicked
    currentEvent = calEvent;
    openInfoForm(calEvent);
    // alert('Title: ' + calEvent.name + '\nDescription: ' + calEvent.desc + '\nLevel: ' + (parseInt(calEvent.level) + 1) + '/' + (parseInt(calEvent.level) + 2));

  };

  const openForm = () => {
    document.getElementById("createEventForm").style.display = "block";
  };

  const openInfoForm = (calEvent) =>{
    console.log(calEvent)


    document.getElementById("clickInformation").style.display = "block";

    document.getElementById("eventTitle").innerHTML = calEvent.name;
    document.getElementById("eventDescription").innerHTML = calEvent.desc;

    document.getElementById("eventEnroll").innerHTML = calEvent.enrolled.length;


  }

  const closeForm = () => {
    setTitle("");
    setDescription("");

    document.getElementById("createEventForm").style.display = "none";
    document.getElementById("clickInformation").style.display = "none";

  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
    // setSubmitted(false);
  };

  const handleDesc = (e) => {
    setDescription(e.target.value);
    // setSubmitted(false);
  };

  const handleLevel = (e) => {
    setLevel(e.target.value);
    // setSubmitted(false);
  };

  const submitEvent = (e) => {
    e.preventDefault()
    if (title == "" || level == "" || startHr == "" || endHr == "") {
      // error pop up
      alert("This is not a valid event.");
    } else {
      let event = {
        name: title,
        desc: description,
        start: {
          year: startYear,
          month: startMonth,
          date: startDate,
          hour: startHr,
          minute: startMin
        },
        end: {
          year: endYear,
          month: endMonth,
          date: endDate,
          hour: endHr,
          minute: endMin
        },
        level: level,
        coach_email: coach
      };

      try{
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
            coach_email: coach
          }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
        }).then((response) =>{
          return response.text()
        }).then((data) => {
          // console.log(data)
          if(data != ""){
            alert("There is alread an event with this name.")
          }
          else{
            closeForm();
            get_db_events();
            // window.location.reload(false);
          }
        })
      } catch(exception){
        console.log(exception)
      }
      // reloading
    }
  };

  const deleteEvent = (e) =>{
    e.preventDefault()

    if(currentEvent.enrolled.length > 0){
      // alert("this event has enrolled members")
      // check 
      delete_event_call()
      // display the confirmation form
    }
    else{
      delete_event_call()
    }
  }
  
  const handleStartYear = (e) => {
    setStartYear(e.target.value);
  };

  const handleStartMonth = (e) => {
    setStartMonth(e.target.value);
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value);
  };

  const handleStartHr = (e) => {
    setStartHr(e.target.value);
  };

  const handleStartMin = (e) => {
    setStartMin(e.target.value);
  };

  const handleEndYear = (e) => {
    setEndYear(e.target.value);
  };

  const handleEndMonth = (e) => {
    setEndMonth(e.target.value);
  };

  const handleEndDate = (e) => {
    setEndDate(e.target.value);
  };

  const handleEndHr = (e) => {
    setEndHr(e.target.value);
  };

  const handleEndMin = (e) => {
    setEndMin(e.target.value);
  };

  const handleCoach = (e) => {
    setCoach(e.target.value)
  }

  if(staffLevel >= 1){
    document.getElementById("overlay").style.display = "none";
  }

  return (
    <div className="admin-calendar">
      <div className="top-bar">
        Gym Schedule
        <div className="allButtons">
        <button className="top-bar-button" onClick={openForm}>Add Event</button>
        <button className="top-bar-button" onClick={goBack}>Back</button>
        </div>
      </div>

      <div className="">

        <div className="form-popup" id="clickInformation">
                    <form className="form-container">
                        <label for="title">
                            <b>Title</b>
                        </label>
                        <h5 id='eventTitle'>{}</h5>

                        <label for="desc">
                        <b>Description</b>
                        </label>

                        <h5 id='eventDescription'>{}</h5>


                        <label for="enrolled">
                        <b>Enrolled Count</b>
                        </label>

                        <h5 id='eventEnroll'>{}</h5>

                        <button type="button" className="btn cancel" onClick={deleteEvent}>
                        Delete Event
                        </button>

                        <button type="button" className="btn cancel" onClick={closeForm}>
                        Cancel
                        </button>
                    </form>
                </div>

        <div className="form-popup" id="createEventForm">
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
<           label for="coach">
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
            <div>
              <label for="start">
                <b>Start Time * </b>
              </label>
              <div className="timeDrop">
                <select onChange={handleStartYear}>
                  <option value="">Year</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <select onChange={handleStartMonth}>
                  <option value="">Month</option>
                  <option value="0">Jan</option>
                  <option value="1">Feb</option>
                  <option value="2">Mar</option>
                  <option value="3">Apr</option>
                  <option value="4">May</option>
                  <option value="5">Jun</option>
                  <option value="6">Jul</option>
                  <option value="7">Aug</option>
                  <option value="8">Sept</option>
                  <option value="9">Oct</option>
                  <option value="10">Nov</option>
                  <option value="11">Dec</option>
                </select>
                <select onChange={handleStartDate}>
                  <option value="">Date</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                  <option value="24">24</option>
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                </select>
                <select onChange={handleStartHr}>
                  <option value="">hr</option>
                  <option value="10">10am</option>
                  <option value="11">11am</option>
                  <option value="12">12pm</option>
                  <option value="13">1pm</option>
                  <option value="14">2pm</option>
                  <option value="15">3pm</option>
                  <option value="16">4pm</option>
                  <option value="17">5pm</option>
                  <option value="18">6pm</option>
                  <option value="19">7pm</option>
                  <option value="20">8pm</option>
                  <option value="21">9pm</option>
                </select>
                <select onChange={handleStartMin}>
                  <option value="0">min</option>
                  <option value="0">:00</option>
                  <option value="5">:05</option>
                  <option value="10">:10</option>
                  <option value="15">:15</option>
                  <option value="20">:20</option>
                  <option value="25">:25</option>
                  <option value="30">:30</option>
                  <option value="35">:35</option>
                  <option value="40">:40</option>
                  <option value="45">:45</option>
                  <option value="50">:50</option>
                  <option value="55">:55</option>
                </select>
              </div>
            </div>

            <div>
              <label for="end">
                <b>End Time *</b>
              </label>
              <div className="timeDrop">
                <select onChange={handleEndYear}>
                  <option value="">Year</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <select onChange={handleEndMonth}>
                  <option value="">Month</option>
                  <option value="0">Jan</option>
                  <option value="1">Feb</option>
                  <option value="2">Mar</option>
                  <option value="3">Apr</option>
                  <option value="4">May</option>
                  <option value="5">Jun</option>
                  <option value="6">Jul</option>
                  <option value="7">Aug</option>
                  <option value="8">Sept</option>
                  <option value="9">Oct</option>
                  <option value="10">Nov</option>
                  <option value="11">Dec</option>
                </select>
                <select onChange={handleEndDate}>
                  <option value="">Date</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="6">6</option>
                  <option value="7">7</option>
                  <option value="8">8</option>
                  <option value="9">9</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                  <option value="13">13</option>
                  <option value="14">14</option>
                  <option value="15">15</option>
                  <option value="16">16</option>
                  <option value="17">17</option>
                  <option value="18">18</option>
                  <option value="19">19</option>
                  <option value="20">20</option>
                  <option value="21">21</option>
                  <option value="22">22</option>
                  <option value="23">23</option>
                  <option value="24">24</option>
                  <option value="25">25</option>
                  <option value="26">26</option>
                  <option value="27">27</option>
                  <option value="28">28</option>
                  <option value="29">29</option>
                  <option value="30">30</option>
                  <option value="31">31</option>
                </select>
                <select onChange={handleEndHr}>
                  <option value="">hr</option>
                  <option value="10">10am</option>
                  <option value="11">11am</option>
                  <option value="12">12pm</option>
                  <option value="13">1pm</option>
                  <option value="14">2pm</option>
                  <option value="15">3pm</option>
                  <option value="16">4pm</option>
                  <option value="17">5pm</option>
                  <option value="18">6pm</option>
                  <option value="19">7pm</option>
                  <option value="20">8pm</option>
                  <option value="21">9pm</option>
                </select>
                <select onChange={handleEndMin}>
                  <option value="0">min</option>
                  <option value="0">:00</option>
                  <option value="5">:05</option>
                  <option value="10">:10</option>
                  <option value="15">:15</option>
                  <option value="20">:20</option>
                  <option value="25">:25</option>
                  <option value="30">:30</option>
                  <option value="35">:35</option>
                  <option value="40">:40</option>
                  <option value="45">:45</option>
                  <option value="50">:50</option>
                  <option value="55">:55</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn" onClick={submitEvent}>
              Create Event
            </button>
            <button type="button" className="btn cancel" onClick={closeForm}>
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
          eventPropGetter={
            (event, start, end, isSelected) =>{
              let newStyle ={
                backgroundColor: "lightgrey",
                color: 'black',
                borderRadius: "0px",
                border: "none"
              }

              if (event.level == 0) {
                newStyle.backgroundColor = "#4e9b6f";
              } else if (event.level == 1) {
                newStyle.backgroundColor = "#f3c26e";
                newStyle.color = "white";
              } else if (event.level == 2) {
                newStyle.backgroundColor = "#75caef";
              }

              return{className:"",
            style: newStyle}
            }
          }
          // onDoubleClickEvent={onDoubleClickEvent}
        ></Calendar>
      </div>
      <div className="overlay" id="overlay">YOU DO NOT HAVE ACCESS TO THIS PAGE!</div>
    </div>
  );
};
export default AdminCalendarPage;
