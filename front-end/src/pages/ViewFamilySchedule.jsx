import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "./ViewFamilySchedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css"

const ViewFamilySchedule = () => {

    const navigate = useNavigate();
    
    const goBack = () =>{
        let path = "/my-account";
        navigate(path, {state:email})
    }

    const localizer = momentLocalizer(moment);

    let [email] = useState('');
    const location = useLocation()
    email = location.state;


    // get relevant info from 'email'
    //JSON, needs to be dynamic (backend)

    // months index starting at 0 (october is 9, january is 0...)
    // dates are normal
    const myEventsList = [
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
        alert(calEvent.description)
    }


    return(

        <div className="view-family-schedule">
            <div className='top-bar'>Family Schedule
                <button className="top-bar-button" onClick={goBack}>Back</button>
            </div>

            <div className="">
                <Calendar
                    localizer={localizer}
                    events = {myEventsList}
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
export default ViewFamilySchedule;