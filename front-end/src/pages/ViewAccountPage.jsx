import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Route, Routes, useNavigate} from "react-router";
import "./ViewAccountPage.css";

const AccountView = () => {
  // use these variables to set proper data
  const [name] = useState("John Doe");
  const [phone] = useState("(306) 123-4567");
  const [email] = useState("abc123@domain.ca");
  const [birthday] = useState("month/day/year");


  let navigate = useNavigate();

  const addFamilyMemberRouteChange = () =>{
    let path = '/add-family';
    navigate(path)
   }

  const addFamilyMember = (e) =>{
    addFamilyMemberRouteChange();
  }

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
            <button className="schedule-button" onClick={addFamilyMember}>View Family Schedule</button>
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
