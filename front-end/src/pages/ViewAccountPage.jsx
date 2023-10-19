import React, { useState } from "react";
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

  let [currentName, setCurrentName] = useState(''); 
  let [currentPhone, setCurrentPhone] = useState(''); 
  let [currentLevel, setCurrentLevel] = useState(''); 
  let [currentBirthday, setCurrentBirthday] = useState(''); 


  email = location.state;

  // use email to look up other info on db and modify varaibles (also to get kids)

  /**
   phone = ___;
   birthday = ___;
   name = ___;
   */
  let navigate = useNavigate();

  // const displayChildren = () =>{

  // }

  // the children that are listed

  const registerChild = (e) =>{
    let path = '/class-registration'
    navigate(path, {state: {email: email, child: e.target.value}})
  }

  const displayInfo = (e) =>{
    setCurrentName(e.target.value);
    console.log(e.target.value)
  }


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
    console.log(i)
    return(
      <div className="family-member-row">    
        <label className="family-member-name" for="family"> {i.name} </label>        
        <button className="register-button" value={i.name} type="button" onClick={registerChild} >Register</button>          
        <button className="info-button" value={i.name} type="button" onClick={displayInfo}>Info</button>
      </div>
    )
  })

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
            {/* looping through children*/}
              {renders}
              
      
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
            <input className="edit-label" for="name" type="name" id="edit-name" disabled="true" placeholder={currentName}></input>
          </div>

          {/* phone */}
          <div className="view-account-column-entry">
            <label className="account-label" for="phone"> Phone: </label>
            <input className="edit-label" for="phone" type="phone" id="edit-phone" disabled="true" placeholder={currentPhone}></input>
          </div>

          {/* birthday */}
          <div className="view-account-column-entry">
            <label className="account-label" for="birthday"> Birthday: </label>
            <input className="edit-label" for="email" type="email" id="edit-birthday" disabled="true" placeholder={currentBirthday}></input>
          </div>

          {/* level */}
          <div className="view-account-column-entry">
            <label className="account-label" for="level"> Level: </label>
            <input className="edit-label" for="level" type="level" id="level" disabled="true" placeholder={currentLevel}></input>
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
