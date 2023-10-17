import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "./AdminCalendarPage.css";
import "react-big-calendar/lib/css/react-big-calendar.css"


const AdminCalendarPage = () => {

    const localizer = momentLocalizer(moment);

    let [email] = useState('');
    const location = useLocation()
    email = location.state;

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [startTime, setStartTime] = useState('')
    const [endTime, setEndTime] = useState('')

    // get relevant info from 'email'
    //JSON, needs to be dynamic (backend)

    // months index starting at 0 (october is 9, january is 0...)
    // dates are normal
    const myEventsList = [
        {
            'title': 'example event',
            'start': new Date(2023, 9 ,11, 12, 0, 0),
            'end': new Date(2023, 9 ,11, 14, 0, 0)
        },
        {
            'title': 'example event2',
            'start': new Date(2023, 9 ,12),
            'end': new Date(2023, 9 , 13)
        }
    ]

    const openForm = () => {
        document.getElementById("myForm").style.display = "block";
      }
      
    const closeForm = () => {
        setTitle('')
        setDescription('')
        setEndTime('')
        setStartTime('')
        
        document.getElementById("myForm").style.display = "none";
      }

    const handleTitle = (e) =>{
            setTitle(e.target.value);
            // setSubmitted(false);
        };

    const handleDesc = (e) =>{
        setDescription(e.target.value);
        // setSubmitted(false);
    };
    const handleStart = (e) =>{
        setStartTime(e.target.value);
        // setSubmitted(false);
    };
    const handleEnd = (e) =>{
        setEndTime(e.target.value);
        // setSubmitted(false);
    };
    
    const submitEvent = () => {
        if(title == '' || description == '' || startTime == '' || endTime == ''){
            // error pop up
        }
        else{
            // create a new event and add to list
            // close pop-up
            // re render calendar if necessary
        }

    }
    
    return(

        <div className="admin-calendar">
            <div className='admin-schedule-top-bar'>Gym Schedule
                <button className="add-event-button" onClick={openForm}>Add Event</button>
            </div>

            <div className="">
                <div class="form-popup" id="myForm">
                    <form action="/action_page.php" class="form-container">
                        <h1>|Add Event</h1>

                        <label for="title"><b>Title</b></label>
                        <input type="title" placeholder="Enter Title" name="title" onChange={handleTitle} required></input>

                        <label for="desc"><b>Description</b></label>
                        <input type="description" placeholder="Enter Description" name="desc" onChange={handleDesc} required></input>

                        <label for="start"><b>Start Time</b></label>
                        <input type="startTime" placeholder="date/month/year  hour/minute"  name="strt" onChange={handleStart} required></input>

                        <label for="end"><b>End Time</b></label>
                        <input type="endTime" placeholder="date/month/year  hour/minute" name="end" onChange={handleEnd} required></input>

                        <button type="submit" class="btn" onClick={submitEvent}>Create Event</button>
                        <button type="button" class="btn cancel" onclick={closeForm}>Cancel</button>
                    </form>
                </div>

                <Calendar
                    localizer={localizer}
                    events = {myEventsList}
                    startAccessor="start"
                    endAccessor="end"
                    popup={false}
                    style={{ height: 700 }}
                ></Calendar>

            </div>

        </div>
        );
}
export default AdminCalendarPage;