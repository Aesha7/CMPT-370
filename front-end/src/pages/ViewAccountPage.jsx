import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import "./ViewAccountPage.css";

const AccountView = () => {

  const location = useLocation();

  // use these variables to set proper data
  let [name] = useState("John Doe");
  let [phone] = useState("(306) 123-4567");
  let [email] = useState('email@domain.com');
  let [birthday] = useState("month/day/year");

  console.log(location.state)
  email = location.state;

  // use email to look up other info on db and modify varaibles (also to get kids)

  /**
   phone = ___;
   birthday = ___;
   name = ___;
   */
  let navigate = useNavigate();

  const addFamilyMemberRouteChange = () =>{
    let path = '/add-family';
    navigate(path, {state:email})
   }

  const viewFamilyScheduleRouteChange = () =>{
    let path = '/family-schedule';
    navigate(path, {state:email})
  }

  const addFamilyMember = (e) =>{
    addFamilyMemberRouteChange();
  }



  // getting the email
  

  return (

    <div className="view-account-page">
      <div className="view-account-top-bar">
        My Account
        <button className="view-account-settingsButton">&#x26ED;</button>
      </div>

      <div className="view-account-container">

        <div className="view-user-info-1">
          {/* name */}
          <div className="view-account-column-entry">
            <label className="account-label" for="name"> Name: </label>
            <label className="info-label" for="name" type="name" id="name"> {name} </label>
          </div>

          {/* email */}
          <div className="view-account-column-entry">
            <label className="account-label" for="email"> Email: </label>
            <label
              className="info-label" for="email" type="email" id="email"> {email} </label>
          </div>

          {/* phone */}
          <div className="view-account-column-entry">
            <label className="account-label" for="Phone"> Phone: </label>
            <label className="info-label" for="phone" type="phone" id="phone"> {phone} </label>
          </div>

          {/* birthday */}
          <div className="view-account-column-entry">
            <label className="account-label" for="birthday"> Birthday: </label>
            <label className="info-label" for="email" type="email" id="email"> {birthday} </label>
          </div>
        </div>

        <div className="view-user-info-2">

        <div className="view-account-column-entry">
          
          <div className="family-bar">
            <label className="family-label" for="family">Family</label>
            <button className="family-button" onClick={addFamilyMember}>Add Family Member</button>
          </div>

            {/* have to loop through children? */}
            <div className="family-member-row">    
              <label className="family-member-name" for="family"> John Doe </label>        
              <button className="register-button" type="button">Register</button>          
              <button className="info-button" type="button">Info</button>
            </div>

            <div className="family-member-row">    
              <label className="family-member-name" for="family"> John Jr. </label>        
              <button className="register-button" type="button">Register</button>          
              <button className="info-button" type="button">Info</button>
            </div>

            <div className="family-member-row">    
              <label className="family-member-name" for="family"> James </label>        
              <button className="register-button" type="button">Register</button>          
              <button className="info-button" type="button">Info</button>
            </div>

            <div className="family-member-row">    
              <label className="family-member-name" for="family"> Stacey </label>        
              <button className="register-button" type="button">Register</button>          
              <button className="info-button" type="button">Info</button>
            </div>
      
          <div className="family-schedule">
            <button className="schedule-button" onClick={viewFamilyScheduleRouteChange}>View Family Schedule</button>
          </div>

        </div>


        </div>

        <div className="view-user-info">
          
          <p>hello world</p>

        </div>


      </div>





    </div>
  );
};

export default AccountView;
