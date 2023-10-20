import React, { useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./AdminCalendarPage.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

// big calendar docs: https://jquense.github.io/react-big-calendar/examples/index.html?path=/docs/about-big-calendar--page

const AdminCalendarPage = () => {
  const localizer = momentLocalizer(moment);

  let [email] = useState("");
  const location = useLocation();
  email = location.state;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

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

  // get relevant info from 'email'
  //JSON, needs to be dynamic (backend)

  // months index starting at 0 (october is 9, january is 0...)
  // dates are normal
  let myEventsList = [
    {
      title: "example event",
      description: "description 1",
      start: new Date(2023, 9, 11, 12, 0, 0),
      end: new Date(2023, 9, 11, 14, 0, 0),
    },
    {
      title: "example event2",
      description: "description 2",
      start: new Date(2023, 9, 12),
      end: new Date(2023, 9, 13),
    },
  ];

  const clickRef = useRef(null)

  const onSelectEvent = (calEvent) => {
    // what happens when an event is clicked
    console.log(calEvent)
    alert(calEvent.description)
  }
    

  const openForm = () => {
    document.getElementById("myForm").style.display = "block";
  };

  const closeForm = () => {
    setTitle("");
    setDescription("");

    document.getElementById("myForm").style.display = "none";
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
    // setSubmitted(false);
  };

  const handleDesc = (e) => {
    setDescription(e.target.value);
    // setSubmitted(false);
  };

  const submitEvent = () => {
    if (title == "" || description == "" || startHr == "" || endHr == "") {
      // error pop up
      alert("This is not a valid event.");
    } else {
      // create a new event and add to list
      let fullStartDate = new Date(parseInt(startYear), parseInt(startMonth), parseInt(startDate), parseInt(startHr), parseInt(startMin), 0);

      let fullEndDate = new Date(parseInt(endYear), parseInt(endMonth), parseInt(endDate), parseInt(endHr), parseInt(endMin), 0);

      let event = {
        title: title,
        description: description,
        start: fullStartDate,
        end: fullEndDate,
      };
      console.log(event)
    }
  };

  const handleStartYear = (e) => {
    setStartYear(e.target.value)
  };

  const handleStartMonth = (e) => {
    setStartMonth(e.target.value)
  };

  const handleStartDate = (e) => {
    setStartDate(e.target.value)
  };

  const handleStartHr = (e) => {
    setStartHr(e.target.value)
  };

  const handleStartMin = (e) => {
    setStartMin(e.target.value)
  };

  const handleEndYear = (e) => {
    setEndYear(e.target.value)
  };

  const handleEndMonth = (e) => {
    setEndMonth(e.target.value)
  };

  const handleEndDate = (e) => {
    setEndDate(e.target.value)
  };

  const handleEndHr = (e) => {
    setEndHr(e.target.value)
  };

  const handleEndMin = (e) => {
    setEndMin(e.target.value)
  };



  return (
    <div className="admin-calendar">
      <div className="admin-schedule-top-bar">
        Gym Schedule
        <button className="add-event-button" onClick={openForm}>
          Add Event
        </button>
      </div>

      <div className="">
        <div className="form-popup" id="myForm">
          <form className="form-container">
            <h1>Add Event</h1>

            <label for="title">
              <b>Title</b>
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
            <div>
              <label for="start">
                <b>Start Time: </b>
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
                <b>End Time: </b>
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
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={['month', 'week', 'day']}
          popup={false}
          style={{ height: 700 }}
          onSelectEvent={onSelectEvent}
          // onDoubleClickEvent={onDoubleClickEvent}
        ></Calendar>
      </div>
    </div>
  );
};
export default AdminCalendarPage;
