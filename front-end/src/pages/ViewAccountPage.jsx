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
  let [level] = useState("1");

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

  const goBackToLogin = () => {
    let path='/';
    navigate(path)
  }

  const unlockInfo = () =>{
    document.getElementById("edit-name").disabled = false;
    document.getElementById("edit-phone").disabled = false;
    document.getElementById("edit-birthday").disabled = false;
  }

  const saveInfo = () =>{
    document.getElementById("edit-name").disabled = true;
    document.getElementById("edit-phone").disabled = true;
    document.getElementById("edit-birthday").disabled = true;

    

  }

  // getting the email
  

  return (

    <div className="view-account-page">
      <div className="view-account-top-bar">
        My Account
        <button className="logout-button" onClick={goBackToLogin}>Logout</button>
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
            <label className="account-label" for="phone"> Phone: </label>
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
            <label className="heading" for="family">Family</label>
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

        <div className="view-user-info-3">

          <div className="edit-family-info">
          
          <div className="view-account-column-entry">
            <label className="heading" for="family">Current Family Member Info:</label>
          </div>

          {/* name */}
          <div className="view-account-column-entry">
            <label className="account-label" for="name"> Name: </label>
            <input className="edit-label" for="name" type="name" id="edit-name" disabled="true" placeholder={name}></input>
          </div>

          {/* phone */}
          <div className="view-account-column-entry">
            <label className="account-label" for="phone"> Phone: </label>
            <input className="edit-label" for="phone" type="phone" id="edit-phone" disabled="true" placeholder={phone}></input>
          </div>

          {/* birthday */}
          <div className="view-account-column-entry">
            <label className="account-label" for="birthday"> Birthday: </label>
            <input className="edit-label" for="email" type="email" id="edit-birthday" disabled="true" placeholder={birthday}></input>
          </div>

          {/* level */}
          <div className="view-account-column-entry">
            <label className="account-label" for="level"> Level: </label>
            <input className="edit-label" for="level" type="level" id="level" disabled="true" placeholder="1"></input>
          </div>
          {/* edit the routers !!! */}
          <div className="family-info">
            <button className="edit-button" onClick={unlockInfo}>Edit</button>
            <button className="save-button" onClick={saveInfo}>Save</button>
          </div>

        </div>

        <div className="email-list">

          <div className="view-account-column-entry">
            <label className="heading" for="email" type="emailList">Email List:</label>

            
          <label class="checklist">Newsletter
  <input type="checkbox"/>
  <span class="checkmark"></span>
</label>

<label class="checklist">Promotions
  <input type="checkbox"/>
  <span class="checkmark"></span>
</label>

          </div>


          {/* <form action="/action_page.php">
          
          <div className="email-list-row">    

          <input type="checkbox" id="option1" name="option1" value="newsletter"/>
          
          <label for="option1"> Newsletter</label>
                    
          <input type="checkbox" id="option2" name="option2" value="promotions"/>
          
          <label for="option2"> Promotions</label>
        
          </div>

          </form> */}





        </div>

        </div>


      </div>

    </div>
  );
};

export default AccountView;
