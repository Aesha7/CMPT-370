import React, { useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import "./ViewAccountPage.css";

const server_URL = "http://127.0.0.1:5000/" //URL to access server

const AccountView = () => {
  const location = useLocation();

  // use these variables to set proper data
  let [name] = useState("John Doe");
  let [phone] = useState("(306) 123-4567");
  let [email] = useState("email@domain.com");
  let [birthday] = useState("month/day/year");
  let [level] = useState("1");
  let [userID] = useState('');
  

  let [currentName, setCurrentName] = useState("");
  let [currentPhone, setCurrentPhone] = useState("");
  let [currentLevel, setCurrentLevel] = useState("");
  let [currentBirthday, setCurrentBirthday] = useState("");

  let [newName, setNewName] = useState('')
  let [newPhone, setNewPhone] = useState('')
  let [newBirthday, setNewBirthday] = useState('')


  userID = location.state;  

  try{
    fetch((server_URL+"/retrieve_account"), {
      method: "POST", 
      body: JSON.stringify({_id: userID}),
      headers: {
        "Content-Type": "application/json",
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
    },
  }).then((response) => {
    response.json()}
  ).then(data => {
    console.log(data)
    return data
  })
}catch (error){
console.log(error)
}

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

  const registerChild = (e) => {
    let path = "/class-registration";
    navigate(path, { state: { email: email, child: e.target.value } });
  };

  const displayInfo = (e) => {
    setCurrentName(e.target.value);
    console.log(e.target.value);
  };


  // GET CHILDREN FROM DB
  let children = [
    {
      name: "John Doe",
      phone: "12345678",
      birthday: "day/month/year",
      level: "999",
    },
    {
      name: "Another Name",
      phone: "12345678",
      birthday: "day/month/year",
      level: "999",
    },
    {
      name: "A third Name",
      phone: "12345678",
      birthday: "day/month/year",
      level: "999",
    },
    {
      name: "A fourth Name",
      phone: "12345678",
      birthday: "day/month/year",
      level: "999",
    },
    {
      name: "A third Name again",
      phone: "12345678",
      birthday: "day/month/year",
      level: "999",
    },
    {
      name: "John Don",
      phone: "12345678",
      birthday: "day/month/year",
      level: "999",
    },
  ];

  let renders = children.map(function (i) {
    // console.log(i);
    return (
      <div className="family-member-row">
        <label className="family-member-name" for="family">
          {" "}
          {i.name}{" "}
        </label>
        <button
          className="register-button"
          value={i.name}
          type="button"
          onClick={registerChild}
        >
          Register
        </button>
        <button
          className="info-button"
          value={i.name}
          type="button"
          onClick={displayInfo}
        >
          Info
        </button>
      </div>
    );
  });

  // const addFamilyMemberRouteChange = () =>{
  //   let path = '/add-family';
  //   navigate(path, {state:email})
  //  }

  const viewFamilyScheduleRouteChange = () => {
    let path = "/family-schedule";
    navigate(path, { state: email });
  };


  const goBackToLogin = () => {
    let path = "/";
    navigate(path);
  };

  const unlockInfo = () => {
    document.getElementById("edit-name").disabled = false;
    document.getElementById("edit-phone").disabled = false;
    document.getElementById("edit-birthday").disabled = false;
  };

  const saveInfo = () => {
    document.getElementById("edit-name").disabled = true;
    document.getElementById("edit-phone").disabled = true;
    document.getElementById("edit-birthday").disabled = true;
  };


  const addFamilyMemberPopup = (e) => {
    document.getElementById("myForm").style.display = "block";
  };

  const submitFamilyMember = () =>{
    // get values for family member here

    if(newName == '' || newPhone == '' || newBirthday == ''){
      alert("Please input all of the information")
    }
    else{
      // new child using newName, newPhone, newBirthday, level = 1
      document.getElementById("myForm").style.display = "none";
  }
  }

  const closeForm = () =>{
    console.log("clicked")
    document.getElementById("myForm").style.display = "none";
  }

  const handleNewName = (e) =>{
    setNewName(e.target.value);
  }

  const handleNewPhone = (e) =>{
    setNewPhone(e.target.value);
  }

  const handleNewBirthday = (e) =>{
    setNewBirthday(e.target.value);
  }


  // getting the email

  return (
    <div className="view-account-page">
      <div className="top-bar">
        My Account
        <button className="top-bar-button" onClick={goBackToLogin}>
          Logout
        </button>
      </div>

      <div className="view-account-container">
        <div className="view-user-info-1">
          <div className="view-account-column-entry">
            <label className="heading" for="member">
              Account Info:
            </label>
          </div>

          {/* name */}
          <div className="view-account-column-entry">
            <label className="account-label" htmlFor="name">
              {" "}
              Name:{" "}
            </label>
            <label className="info-label" htmlFor="name" type="name" id="name">
              {" "}
              {name}{" "}
            </label>
          </div>

          {/* email */}
          <div className="view-account-column-entry">
            <label className="account-label" htmlFor="email">
              {" "}
              Email:{" "}
            </label>
            <label
              className="info-label"
              htmlFor="email"
              type="email"
              id="email"
            >
              {" "}
              {email}{" "}
            </label>
          </div>

          {/* phone */}
          <div className="view-account-column-entry">
            <label className="account-label" for="phone">
              {" "}
              Phone:{" "}
            </label>
            <label className="info-label" for="phone" type="phone" id="phone">
              {" "}
              {phone}{" "}
            </label>
          </div>

          {/* birthday */}
          <div className="view-account-column-entry">
            <label className="account-label" htmlFor="birthday">
              {" "}
              Birthday:{" "}
            </label>
            <label
              className="info-label"
              htmlFor="email"
              type="email"
              id="email"
            >
              {" "}
              {birthday}{" "}
            </label>
          </div>
        </div>

        <div className="view-user-info-2">
          <div className="view-account-column-entry">
            <div className="family-bar">
              <label className="heading" for="family">
                Family
              </label>
              <button className="family-button" onClick={addFamilyMemberPopup}>
                Add Family Member
              </button>
            </div>
            {/* looping through children*/}
            {renders}

            <div className="family-schedule">
              <button
                className="schedule-button"
                onClick={viewFamilyScheduleRouteChange}
              >
                View Family Schedule
              </button>
            </div>
          </div>
        </div>

        <div className="view-user-info-3">
          <div className="edit-family-info">
            <div className="view-account-column-entry">
              <label className="heading" for="family">
                Family Member Info:
              </label>
            </div>

            {/* name */}
            <div className="view-account-column-entry">
              <label className="account-label" for="name">
                {" "}
                Name:{" "}
              </label>
              <input
                className="edit-label"
                for="name"
                type="name"
                id="edit-name"
                disabled="true"
                placeholder={currentName}
              ></input>
            </div>

            {/* phone */}
            <div className="view-account-column-entry">
              <label className="account-label" for="phone">
                {" "}
                Phone:{" "}
              </label>
              <input
                className="edit-label"
                for="phone"
                type="phone"
                id="edit-phone"
                disabled="true"
                placeholder={currentPhone}
              ></input>
            </div>

            {/* birthday */}
            <div className="view-account-column-entry">
              <label className="account-label" for="birthday">
                {" "}
                Birthday:{" "}
              </label>
              <input
                className="edit-label"
                for="email"
                type="email"
                id="edit-birthday"
                disabled="true"
                placeholder={currentBirthday}
              ></input>
            </div>

            {/* level */}
            <div className="view-account-column-entry">
              <label className="account-label" for="level">
                {" "}
                Level:{" "}
              </label>
              <input
                className="edit-label"
                for="level"
                type="level"
                id="level"
                disabled="true"
                placeholder={currentLevel}
              ></input>
            </div>
            {/* edit the routers !!! */}
            <div className="family-info">
              <button className="edit-button" onClick={unlockInfo}>
                Edit
              </button>
              <button className="save-button" onClick={saveInfo}>
                Save
              </button>
            </div>
          </div>

          <div className="email-list">
            <div className="view-account-column-entry">
              <label className="heading" for="email" type="emailList">
                Email List:
              </label>

              <label class="checklist">
                Newsletter
                <input type="checkbox" />
                <span class="checkmark"></span>
              </label>

              <label class="checklist">
                Promotions
                <input type="checkbox" />
                <span class="checkmark"></span>
              </label>
            </div>
          </div>
        </div>


        <div className="add-family-popup" id="myForm">
          <form className="form-container">
            <label for="name"><b>Name</b></label>
            <input type="name" onChange={handleNewName}></input>

            <label for="phone"><b>Phone Number</b></label>
            <input type="phone" onChange={handleNewPhone}></input>

            <label for="birthday"><b>Birthday</b></label>
            <input type="birthday" onChange={handleNewBirthday}></input>

            <button type="submit" className="btn" onClick={submitFamilyMember}>
              Register
            </button>
            <button type="button" className="btn cancel" onClick={closeForm}>
              Cancel
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default AccountView;
