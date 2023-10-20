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


    

    const location = useLocation()
    email = location.state.email;
    registrationChild = location.state.value

    // console.log(email, registrationChild)

    const handleChildChange = (e) =>{
        console.log("here")
        setRegistrationChild(e.target.value);
        console.log(registrationChild)
    }


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
            {/* dropdown of children names */}
            <select className='childDropDown' onChange={handleChildChange}>{renders}</select>
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
export default GymSchedule;