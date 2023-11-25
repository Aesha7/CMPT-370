import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import "../style/AdminManageAccountsPage.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const AdminManageAccountsPage = () => {
  const location = useLocation();
  let userID = location.state;
  const [staffLevel, setStaffLevel] = useState("");
  let tempUsers = [];
  const [listedUsers, setListedUsers] = useState([]);

  let [currentDisplayName, setCurrentDisplayName] = useState("")
  let [currentPhoneNumber, setCurrentPhoneNumber] = useState("")
  let [currentEmail, setCurrentEmail] = useState("")
  let [currentStaffLevel, setCurrentStaffLevel] = useState("")
  let [currentLevel, setCurrentLevel] = useState("")
  let [currentParentID, setCurrentParentID] = useState("")
  let [currentChildID, setCurrentChildID] = useState("")
  let [currentBirthday, setCurrentBirthday] = useState("")

  let userEmail;

  let accountRenders;
  
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

  // uncovering the page if a valid account
  if (staffLevel >= 3) {
    document.getElementById("overlay").style.display = "none";
  }


/**
 * get all user accounts from database
 */
  const getAccountRenders = () =>{
    let userIndex = -1;
    accountRenders = listedUsers.map(function (user) {
      userIndex++;
      let childIndex = -1;
      let innerAccountRenders = user.users.map(function (child) {
        childIndex++;
        if(childIndex > 0){
          return (
          <div className="family-member-row">
            <label>{child.name}</label>
            <button value={[userIndex, childIndex]} onClick={openInfoPopup}>info</button>
          </div>
          );
        } else{
          return null;
        }
      })

      return(
        <div className="family-member-row">
          <label>{user.users[0].name}</label>
          <button value={[userIndex, 0]} onClick={openInfoPopup}>info</button>
          <div>{innerAccountRenders}</div>
        </div>
      );
    })
  }

/**
 * show user info
 */
  const openInfoPopup = (e) =>{
    // console.log(e.target.value);
    let string = e.target.value;
    let indicies = string.split(',');
    let parentUser = listedUsers[indicies[0]];
    let subUser = parentUser.users[indicies[1]];

    // name, birthday, phone number, email, staff level, level, both id's
    setCurrentDisplayName(subUser.name);    
    setCurrentPhoneNumber(subUser.phoneNumber);
    setCurrentEmail(parentUser.email);
    setCurrentBirthday(subUser.birthday)

    if (indicies[1] != 0) {
      setCurrentStaffLevel(parentUser.staffLevel);
    }
    else {
      setStaffLevel(null);
    }

    setStaffLevel(subUser.level);
    setCurrentParentID(parentUser._id);
    setCurrentChildID(subUser._id);

    // from user.users name, birthday, phone, 
    
  }

  // users is set
  getAccountRenders()
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


      <div className="edit-family-info">
          <div className="view-account-column-entry">
            <label className="headingCurrMem" htmlFor="family">
              Current Member Info
            </label>
          </div>

          {/* name */}
          <div className="view-account-column-entry">
            <label className="account-label" htmlFor="name" id="info-name">
              {" "}
              Name:{" "}
            </label>
            <input
              className="edit-label"
              htmlFor="name"
              type="name"
              id="edit-name"
              disabled={true}
              placeholder={currentDisplayName}
            ></input>
          </div>

          {/* birthday */}
          <div className="view-account-column-entry">
            <label className="account-label" htmlFor="birthday" id="info-birthday">
              {" "}
              Birthday:{" "}
            </label>
            <input
              className="edit-label"
              htmlFor="email"
              type="email"
              id="edit-birthday"
              disabled={true}
              placeholder={currentBirthday}
            ></input>
          </div>

          {/* level */}
          <div className="view-account-column-entry">
            <label className="account-label" htmlFor="level" id="info-level">
              {" "}
              Level:{" "}
            </label>
            <input
              className="edit-label"
              htmlFor="level"
              type="level"
              id="level"
              disabled={true}
              placeholder={currentLevel}
            ></input>
          </div>

          <div className="family-info">
            <button className="edit-button">
              Edit
            </button>
            <button className="save-button">
              Save
            </button>
          </div>
        </div>




      <div className="overlay" id="overlay">
        YOU DO NOT HAVE ACCESS TO THIS PAGE!
      </div>

      <div>{accountRenders}</div>
    </div>
  );
};
export default AdminManageAccountsPage;
