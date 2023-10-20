import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "./GymSchedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css"

const GymSchedule = () => {

    const navigate = useNavigate();
    
    const goBack = () =>{
        let path = "/my-account";
        navigate(path, {state:email})
    }

    const localizer = momentLocalizer(moment);

    let [email] = useState('');
    let [registrationChild, setRegistrationChild] = useState('')
    let [currentEvent] = useState('');


    const location = useLocation()
    email = location.state.email;
    registrationChild = location.state.value

    // console.log(email, registrationChild)

    // const handleChildChange = (e) =>{
    //     console.log("here")
    //     setRegistrationChild(e.target.value);
    //     console.log(registrationChild)
    // }


    // get relevant info from 'email'
    //JSON, needs to be dynamic (backend)

    // months index starting at 0 (october is 9, january is 0...)
    // dates are normal
    const gymEventsList = [
        {
            'title': 'example event',
            'description': "this is a description",
            'start': new Date(2023, 9 ,11, 12, 0, 0),
            'end': new Date(2023, 9 ,11, 14, 0, 0)
        },
        {
            'title': 'example event2',
            'description': "this is a description too",
            'start': new Date(2023, 9 ,12),
            'end': new Date(2023, 9 , 13)
        }
    ]

    const showDetails = (calEvent) =>{
        // alert(calEvent.description)
        currentEvent = calEvent
        openForm()
    }

    const openForm = () => {
        document.getElementById("myForm").style.display = "block";
        document.getElementById("eventTitle").innerHTML = currentEvent.title;
        document.getElementById("eventDescription").innerHTML = currentEvent.description;
        };

    const closeForm = () =>{
        document.getElementById("myForm").style.display = "none";
    }

    const registerForEvent = () =>{
        // add event to childs schedule (and probably family schedule)
        // kidsEvents[kidsEvents.length] = currentEvent;
        console.log(currentEvent);
        // close form
        document.getElementById("myForm").style.display = "none";
    }


    // names
    let children = [
        {
          'name': 'John Doe',
          'phone': '12345678',
          'birthday': 'day/month/year',
          'level': '999'
        },
        {
          'name': 'Another Name',
          'phone': '12345678',
          'birthday': 'day/month/year',
          'level': '999'
        },
        {
          'name': 'A third Name',
          'phone': '12345678',
          'birthday': 'day/month/year',
          'level': '999'
        },
        {
          'name': 'A fourth Name',
          'phone': '12345678',
          'birthday': 'day/month/year',
          'level': '999'
        },
        {
          'name': 'A third Name again',
          'phone': '12345678',
          'birthday': 'day/month/year',
          'level': '999'
        },
        {
          'name': 'John Don',
          'phone': '12345678',
          'birthday': 'day/month/year',
          'level': '999'
        },
    ]

    let renders = children.map(function (i) {
        // console.log(i.name, i.birthday, i.phone, i.level)
        return(
          <option value={i.name}>{i.name}</option>
        )
      })


    return(

        <div className="view-gym-schedule">
            <div className='gym-schedule-top-bar'>Gym Schedule
            <button className="gym-top-bar-button" onClick={goBack}>Back</button>

            {/* dropdown of children names (does nothing right now)*/}
            <select className='childDropDown'>{renders}</select>
            </div>

            <div className="">
            
                <div className="form-popup" id="myForm">
                    <form className="form-container">
                        <label for="title">
                            <b>Title</b>
                        </label>
                        <h5 id='eventTitle'></h5>

                        <label for="desc">
                        <b>Description</b>
                        </label>

                        <h5 id='eventDescription'></h5>

                        <button type="submit" className="btn" onClick={registerForEvent}>
                        Register
                        </button>
                        <button type="button" className="btn cancel" onClick={closeForm}>
                        Cancel
                        </button>
                    </form>
                </div>

                <Calendar
                    localizer={localizer}
                    events = {gymEventsList}
                    startAccessor="start"
                    defaultView="week"
                    endAccessor="end"
                    popup={false}
                    style={{ height: 700 }}
                    onSelectEvent={showDetails}
                ></Calendar>

            </div>

        </div>
        );
}
export default GymSchedule;