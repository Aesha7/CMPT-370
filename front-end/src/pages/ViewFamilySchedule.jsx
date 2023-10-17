import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "./ViewFamilySchedule.css";
import "react-big-calendar/lib/css/react-big-calendar.css"

const ViewFamilySchedule = () => {

    const localizer = momentLocalizer(moment);
    

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


    return(

        <div className="view-family-schedule">
            <div className='family-schedule-top-bar'>Family Schedule
            {/* nothing in here? */}
            </div>

            <div className="">
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
export default ViewFamilySchedule;