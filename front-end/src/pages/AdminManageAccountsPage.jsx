import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import DatePicker from "react-datepicker";

import "../style/AdminManageAccountsPage.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const AdminManageAccountsPage = () => {
  const location = useLocation();
  let userID = location.state;
  const [staffLevel, setStaffLevel] = useState("");
  let tempUsers = [];
  const [listedUsers, setListedUsers] = useState([]);

  let [currentDisplayName, setCurrentDisplayName] = useState("");
  let [currentPhoneNumber, setCurrentPhoneNumber] = useState("");
  let [currentEmail, setCurrentEmail] = useState("");
  let [currentStaffLevel, setCurrentStaffLevel] = useState("");
  let [currentLevel, setCurrentLevel] = useState("");
  let [currentParentID, setCurrentParentID] = useState("");
  let [currentChildID, setCurrentChildID] = useState("");
  let [currentBirthday, setCurrentBirthday] = useState("");


  let [newName, setNewName] = useState("");
  let [newBirthday, setNewBirthday] = useState("");
  let [newLevel, setNewLevel] = useState("");
  let [newPhone, setNewPhone] = useState("");
  let [newEmail, setNewEmail] = useState("");
  let [newStaffLevel, setNewStaffLevel] = useState("");


  let staffLevelDiv = null;

  let userEmail;

  let accountRenders;
  let staffRenders;

  const modifyAccountsStaff = () => {
    try {
      fetch(server_URL + "change_staff_level", {
        method: "POST",
        body: JSON.stringify({ admin_ID: userID, email: userEmail, level: 1 }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      })
        .then((response) => {
          return response.text();
        })
        .then((text) => {
          // Parse the text as JSON
          const data = JSON.parse(text);

          if (text == '"Error: admin account not found"') {
            alert('"Error: admin account not found"');
          }
          if (data == '"Error: user account not found"') {
            alert('"Error: user account not found"');
          }
          if (
            data == '"Error: you do not have permission to perform this action"'
          ) {
            alert('"Error: you do not have permission to perform this action"');
          }
          if (
            data ==
            '"Error: target account\'s staff level is too high to change."'
          ) {
            alert(
              '"Error: target account\'s staff level is too high to change."'
            );
          }
        });
    } catch (exception) {
      console.log(exception);
    }
  };

  if (userID != null) {
    window.localStorage.setItem("_id", userID);
  }
  userID = window.localStorage.getItem("_id");

  /**
   * checks if current user on the page is an admin
   */
  const get_account_info = () => {
    try {
      fetch(server_URL + "get_account_info", {
        method: "POST",
        body: JSON.stringify({ _id: userID }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      })
        .then((response) => {
          return response.text(); // Get the response text
        })
        .then((text) => {
          // Parse the text as JSON
          const data = JSON.parse(text);
          setStaffLevel(data.staffLevel);
        });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * sets users to a list of all users found in the database
   */
  const get_user_obj_list = () => {
    try {
      fetch(server_URL + "get_all_account_id", {
        method: "POST",
        body: JSON.stringify({ admin_ID: userID }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      })
        .then((response) => {
          return response.text(); // Get the response text
        })
        .then((text) => {
          // Parse the text as JSON
          let data = JSON.parse(text);

          setListedUsers(data);
        });
    } catch (error) {
      console.log(error);
    }
  };

  // getting data initially
  useEffect(() => {
    get_account_info();
    get_user_obj_list();
  }, []);

  let navigate = useNavigate();

  const goBack = () => {
    let path = "/my-account";
    navigate(path, { state: userID });
  };


  const handleNewName = (e) => {
    setNewName(e.target.value);
  }

  const handleNewBirthday = (date) =>{
    setNewBirthday(date);
  }

  const handleNewLevel = (e) =>{
    setNewLevel(e.target.value)
  }

  const handleNewPhone = (e) =>{
    setNewPhone(e.target.value)
  }

  const handleNewEmail = (e) =>{
    setNewEmail(e.target.value)
  }

  const handleNewStaffLevel = (e) =>{
    setNewStaffLevel(e.target.value)
  }



  /**
   * @param {} email the email string
   * @returns true if its a valid email
   */
  function validEmail(email) {
    // Regular expression for a valid email address
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailRegex.test(email);
  }

  /**
   * @param {} input_str phone number
   * @returns true if its a valid phone number
   */
  function validatePhoneNumber(input_str) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  
    return re.test(input_str);
  }

// SAVING INFO ##############
const saveInfo = (e) =>{
  e.preventDefault();
  let error = false;
  // case where they dont modify a field

  if(newName == ""){
    newName = currentDisplayName;
  }
  if(newBirthday == ""){
    newBirthday = currentBirthday;
  }
  else{
    let arr = newBirthday.toString().split(" ")
    newBirthday = arr[1] + " " + arr[2] + " " + arr[3]
  }
  if(newLevel == ""){
    newLevel = currentLevel;
  }
  if(newPhone == ""){
    newPhone = currentPhoneNumber
  }
  if(newEmail == ""){
    newEmail = currentEmail;
  }
  if(newStaffLevel == ""){
    newStaffLevel = currentStaffLevel
  }

  // All input checking

  // name can be anything?

  // level is a number
  if(isNaN(newLevel)){
    alert("Please enter a number for the new level.")
    error = true
  }
  else if(newLevel > 3 || newLevel < 0){
    alert("Please ensure the new level is between 3 and 0.")
    error = true
  }
  else if(!validatePhoneNumber(newPhone)){
    alert("Please ensure the new phone number is in the form \"(123) 456 7890\".")
    error = true
  }
  else if(!validEmail(newEmail)){
    alert("Please ensure the new email is valid.")
    error = true
  }
  else if(isNaN(newStaffLevel)){
    alert("Please enter a number for the staff level.")
    error = true
  }
  else if(newStaffLevel > 3 || newStaffLevel < 0){
    alert("Please ensure the new staff level is between 3 and 0.")
    error = true
  }
  else{
    // all variables you will need
    console.log("NEW ", newName, newBirthday, newLevel, newPhone, newEmail, newStaffLevel)
    
    // API CALL GOES HERE
    // CAN SEND ALL INFO, Might need new route
    // can probably use currentAccountID to get to the right user
    try {
      fetch(server_URL + "edit_account", {
        method: "POST",
        body: JSON.stringify({ userID: userID, name: newName, birthday: newBirthday, phone: newPhone, staffLevel: newStaffLevel, email: newEmail, level: newLevel }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      })
        .then((response) => {
          return response.text();
        })
        .then((text) => {
          // Parse the text as JSON
          const data = JSON.parse(text);

          if (text == '"Error: admin account not found"') {
            alert('"Error: admin account not found"');
          }
          if (data == '"Error: user account not found"') {
            alert('"Error: user account not found"');
          }
          if (
            data == '"Error: you do not have permission to perform this action"'
          ) {
            alert('"Error: you do not have permission to perform this action"');
          }
          if (
            data ==
            '"Error: target account\'s staff level is too high to change."'
          ) {
            alert(
              '"Error: target account\'s staff level is too high to change."'
            );
          }
        });
    } catch (exception) {
      console.log(exception);
    }

  }
}


  // uncovering the page if a valid account
  if (staffLevel >= 3) {
    document.getElementById("overlay").style.display = "none";
  }

  /**
   * get all user accounts from database
   */
  const getAccountRenders = () => {
    let userIndex = -1;
    accountRenders = listedUsers.map(function (user) {
      userIndex++;
      if (user.staffLevel == 0) {
        let childIndex = -1;
        let innerAccountRenders = user.users.map(function (child) {
          childIndex++;
          if (childIndex > 0) {
            return (
              <div className="all-accounts-child-row">
                <label>{child.name}</label>
                <button
                  className="all-accounts-info-button"
                  value={[userIndex, childIndex]}
                  onClick={openInfoPopup}
                >
                  info
                </button>
              </div>
            );
          } else {
            return null;
          }
        });

        return (
          <div className="all-accounts-family">
            <div className="all-accounts-parent-row">
              <label>{user.users[0].name}</label>
              <button
                className="all-accounts-info-button"
                value={[userIndex, 0]}
                onClick={openInfoPopup}
              >
                info
              </button>
            </div>
            <div>{innerAccountRenders}</div>
          </div>
        );
      }
    });

      userIndex = -1;
      staffRenders = listedUsers.map(function (user) {
        userIndex++;
        if (user.staffLevel >= 1) {
        let childIndex = -1;
        let innerAccountRenders = user.users.map(function (child) {
          childIndex++;
          if (childIndex > 0) {
            return (
              <div className="all-accounts-child-row">
                <label>{child.name}</label>
                <button
                  className="all-accounts-info-button"
                  value={[userIndex, childIndex]}
                  onClick={openInfoPopup}
                >
                  info
                </button>
              </div>
            );
          } else {
            return null;
          }
        });

        return (
          <div className="all-accounts-family">
            <div className="all-accounts-parent-row">
              <label>{user.users[0].name}</label>
              <button
                className="all-accounts-info-button"
                value={[userIndex, 0]}
                onClick={openInfoPopup}
              >
                info
              </button>
            </div>
            <div>{innerAccountRenders}</div>
          </div>
        );
      }
  })
};

  /**
   * show user info
   */
  const openInfoPopup = (e) => {
    // console.log(e.target.value);
    let string = e.target.value;
    let indicies = string.split(",");
    let parentUser = listedUsers[indicies[0]];
    let subUser = parentUser.users[indicies[1]];

    // name, birthday, phone number, email, staff level, level, both id's
    setCurrentDisplayName(subUser.name);
    setCurrentPhoneNumber(parentUser.phone);
    setCurrentEmail(parentUser.email);
    setCurrentBirthday(subUser.birthday);
    setCurrentLevel(subUser.level);

    if (indicies[1] == 0) {
      setCurrentStaffLevel(parentUser.staffLevel);
    } else {
      setStaffLevel(null);
    }

    setStaffLevel(subUser.level);
    setCurrentParentID(parentUser._id["$oid"]);
    setCurrentChildID(subUser._id["$oid"]);

    // from user.users name, birthday, phone,
    document.getElementById("edit-accout-info").style.display = "block";
  };

  const closeForm = () => {
    document.getElementById("edit-accout-info").style.display = "none";

    document.getElementById("edit-name").disabled = true
    document.getElementById("edit-birthday").prefentOpenOnFocus = true
    document.getElementById("edit-level").disabled = true
    document.getElementById("edit-phone").disabled = true
    document.getElementById("edit-email").disabled = true
    document.getElementById("edit-staff-level").disabled = true
  };

  const unlockInput = () =>{
    document.getElementById("edit-name").disabled = false
    // document.getElementById("edit-birthday").disabled = false


    document.getElementById("edit-birthday").prefentOpenOnFocus = false

    document.getElementById("edit-level").disabled = false
    document.getElementById("edit-phone").disabled = false
    document.getElementById("edit-email").disabled = false
    document.getElementById("edit-staff-level").disabled = false

  }

  // users is set
  getAccountRenders();
  return (
    <div className="admin-page">
      <div className="top-bar">
        &nbsp;&nbsp;MANAGE ACCOUNTS
        <div className="allButtons">
          <button className="top-bar-button" onClick={goBack}>
            Back
          </button>
        </div>
      </div>

      {/* the popup for modifying account info */}
      <div className="form-popup" id="edit-accout-info">
        <div className="admin-edit-account">
          <div className="admin-edit-div">
            <label className="headingCurrMem" htmlFor="family">
              Current Member Info
            </label>
          </div>

          {/* name */}
          <div className="admin-edit-div">
            <label className="account-label" htmlFor="name" id="info-name">
              {" "}
              Name:{" "}
            </label>
            <input
              className="manage-account-edit"
              htmlFor="name"
              type="name"
              id="edit-name"
              disabled={true}
              onChange={handleNewName}
              placeholder={currentDisplayName}
            ></input>
          </div>

          {/* birthday */}
          <div className="admin-edit-div">
            <label
              className="account-label"
              htmlFor="birthday"
              id="info-birthday"
            >
              {" "}
              Birthday:{" "}
            </label>
  
            <DatePicker 
            className="manage-account-edit-dp" 
            id="edit-birthday"
            placeholderText={currentBirthday}
            selected={newBirthday}
            onChange={handleNewBirthday}

            portalId="root-portal"
            showPopperArrow={true} //getting rid of arrow
            dateFormat="MM/dd/yyyy"
            minDate={new Date(1900, 0, 1)}
            maxDate={new Date(2099, 11, 31)}
            showMonthDropdown={true}
            showYearDropdown={true}
            todayButton="Today"
            dropdownMode="select"
            inputReadOnly={true}
            // readOnly={true}
            preventOpenOnFocus = {true}


            popperPlacement="auto"
            ></DatePicker>
            
          </div>

          {/* level */}
          <div className="admin-edit-div">
            <label className="account-label" htmlFor="level" id="info-level">
              {" "}
              Level:{" "}
            </label>
            <input
              className="manage-account-edit"
              htmlFor="level"
              type="level"
              id="edit-level"
              disabled={true}
              onChange={handleNewLevel}
              placeholder={currentLevel}
            ></input>
          </div>

          {/* phone */}
          <div className="admin-edit-div">
            <label className="account-label" htmlFor="phone" id="info-phone">
              {" "}
              Phone:{" "}
            </label>
            <input
              className="manage-account-edit"
              htmlFor="email"
              type="email"
              id="edit-phone"
              disabled={true}
              onChange={handleNewPhone}
              placeholder={currentPhoneNumber}
            ></input>
          </div>

          {/* Email */}
          <div className="admin-edit-div">
            <label className="account-label" htmlFor="email" id="info-email">
              {" "}
              Email:{" "}
            </label>
            <input
              className="manage-account-edit"
              htmlFor="email"
              type="email"
              id="edit-email"
              disabled={true}
              onChange={handleNewEmail}
              placeholder={currentEmail}
            ></input>
          </div>

          {/* parent ID CANT CHANGE*/}
          <div className="admin-edit-div">
            <label
              className="account-label"
              htmlFor="parentID"
              id="info-parentID"
            >
              {" "}
              Parent Account ID:{" "}
            </label>
            <input
              className="manage-account-edit"
              htmlFor="email"
              type="email"
              id="edit-email"
              disabled={true}
              placeholder={currentParentID}
            ></input>
          </div>

          {/* user ID CANT CHANGE*/}
          <div className="admin-edit-div">
            <label className="account-label" htmlFor="userID" id="info-userID">
              {" "}
              Account ID:{" "}
            </label>
            <input
              className="manage-account-edit"
              htmlFor="email"
              type="email"
              id="edit-email"
              disabled={true}
              placeholder={currentChildID}
            ></input>
          </div>

          {/* staffLevel */}
          <div className="admin-edit-div">
            <label
              className="account-label"
              htmlFor="staffLevel"
              id="info-staffLevel"
            >
              {" "}
              Staff Level:{" "}
            </label>
            <input
              className="manage-account-edit"
              htmlFor="email"
              type="email"
              id="edit-staff-level"
              disabled={true}
              placeholder={currentStaffLevel}
              onChange={handleNewStaffLevel}
            ></input>
          </div>

          {/* <div className="family-info">
           */}
          <div className="">
            <button className="edit-button" onClick={closeForm}>
              Close
            </button>
            <button className="edit-button" onClick={unlockInput}>Edit</button>
            <button className="edit-button" onClick={saveInfo}>Save</button>
          </div>
        </div>
      </div>

      <div className="overlay" id="overlay">
        YOU DO NOT HAVE ACCESS TO THIS PAGE!
      </div>

      {/* rendering the accounts */}
      <div className="admin-parent-div">
        <div className="admin-account-div">
          {accountRenders}
        </div>
        <div className="admin-account-div">
          {staffRenders}
        </div>
      </div>
    </div>
  );
};
export default AdminManageAccountsPage;
