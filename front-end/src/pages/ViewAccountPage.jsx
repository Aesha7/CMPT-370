import React, { useState, useEffect } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router";
import "./ViewAccountPage.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

async function fetchAddFamily(){

}

const AccountView = () => {

  const location = useLocation();

  // use these variables to set proper data
  let [name, setName] = useState("John Doe");
  let [phone, setPhone] = useState("(306) 123-4567");
  let [email, setEmail] = useState("email@domain.com");
  let [birthday, setBirthday] = useState("month/day/year");
  let [level] = useState("1");
  let [userID, setUserID] = useState("");
  let [staffLevel, setStaffLevel] = useState('')

  // the current data being displayed
  let [currentName, setCurrentName] = useState("");
  let [currentPhone, setCurrentPhone] = useState("");
  let [currentLevel, setCurrentLevel] = useState("");
  let [currentBirthday, setCurrentBirthday] = useState("");

  // values that change user info
  let [newName, setNewName] = useState("");
  let [newPhone, setNewPhone] = useState("");
  let [newBirthday, setNewBirthday] = useState("");

  // the array of users (including the main one)
  const [users, setUsers] = useState([]);
  let [accountData, setAccountData] = useState('')

  // index to modify user data
  let currentUserIndex
  // users = [{name: "name"},{name: 'name2'}]

  userID = location.state;

  if(userID != null){
    window.localStorage.setItem('_id', userID);
  }
    
  // setUserID(JSON.parse(window.localStorage.getItem('_id')));
  userID = window.localStorage.getItem('_id')
  

  useEffect(() => {
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
        setEmail(data.email);
        setName(data.users[0].name);
        setPhone(data.phone);
        setBirthday(data.users[0].birthday)
  
        setAccountData(data)
        setStaffLevel(data.staffLevel)
  
        setUsers(data.users)
      })
    } catch (error) {
      console.log(error);
    }
  }, []);



  
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
    navigate(path, { state:userID});
  };

  // displays the info for the current user (parent or children)
  const displayInfo = (e) => {
    currentUserIndex = e.target.value
    setCurrentName(users[currentUserIndex].name);
    setCurrentPhone(users[currentUserIndex.phone])
    setCurrentBirthday(users[currentUserIndex].birthday)
    setCurrentLevel(users[currentUserIndex].level)
  };  
  

  // let renders = children.map(function (i) {
    let j = -1
    let renders = users.map(function (i) {
      j++;
      return (
      <div className="family-member-row">
        <label className="family-member-name" htmlFor="family">
          {" "}
          {i.name}{" "}
        </label>
        <button
          className="register-button"
          value={j}
          type="button"
          onClick={registerChild}
        >
          Register
        </button>
        <button
          className="info-button"
          value={j}
          type="button"
          onClick={displayInfo}
        >
          Info
        </button>
      </div>
    );
  });


  const viewFamilyScheduleRouteChange = () => {
    let path = "/family-schedule";
    navigate(path, { state: userID });
  };

  const goBackToLogin = () => {
    let path = "/";
    navigate(path);
  };

  const adminPageRoute = () =>{
    let path = '/admin'
    navigate(path, {state:userID})
  }

  // unlocks the input fields
  const unlockInfo = () => {
    document.getElementById("edit-name").disabled = false;
    document.getElementById("edit-birthday").disabled = false;
    document.getElementById("edit-phone").disabled = false;

  };

  const saveInfo = () => {
    // NEED TO EDIT INFO IN BACK END

    document.getElementById("edit-name").disabled = true;
    document.getElementById("edit-birthday").disabled = true;
    document.getElementById("edit-phone").disabled = true;

  };



  const addFamilyMemberPopup = (e) => {
    document.getElementById("myForm").style.display = "block";
  };

  const submitFamilyMember = (e) => {
    e.preventDefault()
    
    if (newName == "" || newBirthday == "") {
      alert("Please input all fields.");
    } 
    else {
      // new child using newName, newPhone, newBirthday, level = 1
      try{
        fetch(server_URL + "add_family", {
          method: "POST",
          body: JSON.stringify({ _id: userID, name: newName, birthday: newBirthday}),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
        }).then((response) => {
          return response.text(); // Get the response text
        })
        .then((text) => {
          // Parse the text as JSON
          text = text.substring(1, text.length -1)
          if(text == 'Success'){
            window.location.reload(false);
            return text;
          }
          else if(text == "Error: name already in use"){
            alert("Name is already in use.")
          }
          // else if(data == ){

          // }
        })
      }
        catch(error){
          console.log(error)
        }

      document.getElementById("myForm").style.display = "none";
    }
  };

  const closeForm = () => {
    // console.log("clicked");
    document.getElementById("myForm").style.display = "none";
  };

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewPhone = (e) => {
    setNewPhone(e.target.value);
  };

  const handleNewBirthday = (e) => {
    setNewBirthday(e.target.value);
  };

  // window.location.reload(false);
  if(staffLevel == 3){
    document.getElementById("adminButton").style.display = "block";
  }

  return (
    <div className="view-account-page">My Account
    <div class="rectangleTop"></div>
    <div class="triangleTop"></div>
    <label className="ownerNLabel" htmlFor="name">Owner:{" "}</label>
    <label className="ownerName" htmlFor="name" type="name" id="name">{name}</label>
    <label className="ownerELabel" htmlFor="email">Email:</label>
    <label className="ownerEmail" htmlFor="email" type="email"id="email">{email}</label>
    <button className="buttonLogout" onClick={goBackToLogin}>Logout</button>
      
      
      {/* <div className="top-bar">
        
        <button className="top-bar-button" htmlFor="adminButton" id="adminButton" onClick={adminPageRoute}>AdminPage</button>

        
        
      </div> */}
      <div className="view-account-container">

        <div className="email-list">
          <div className="emailOptions">
            <label className="heading" htmlFor="email" type="emailList">
              Email List:
            </label>

            <label className="checklist">
              Newsletter
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>

            <label className="checklist">
              Promotions
              <input type="checkbox" />
              <span className="checkmark"></span>
            </label>
          </div>
        </div>
        <div class="triangleEmOpt"></div>

        <div className="view-user-info-2">
          <div className="view-account-column-entry">
            <div className="family-bar">
              <label className="heading" htmlFor="family">
                Family Members
              </label>
              <div class="triangleFamMems"></div>
              <button className="family-button" onClick={addFamilyMemberPopup}>
                Add Family Member
              </button>
              {/* <button className="schedule-button" onClick={viewFamilyScheduleRouteChange}>
                View Family Schedule
              </button> */}
            </div>
            {/* looping through children*/}
            {renders}

            <div className="family-schedule">
            
            </div>
          </div>
        </div>

        <div className="currentMemberPanel">
          <div className="edit-family-info">
            <div className="view-account-column-entry">
              <label className="headingCurrMem" htmlFor="family">
                Current Member Info:
              </label>
            </div>

            {/* name */}
            <div className="view-account-column-entry">
              <label className="account-label" htmlFor="name">
                {" "}
                Name:{" "}
              </label>
              <input
                className="edit-label"
                htmlFor="name"
                type="name"
                id="edit-name"
                disabled={true}
                placeholder={currentName}
              ></input>
            </div>

            {/* phone */}
            <div className="view-account-column-entry"> 
              <label className="account-label" htmlFor="phone">
                {" "}
                Phone:{" "}
              </label>
              <input
                className="edit-label"
                htmlFor="phone"
                type="phone"
                id="edit-phone"
                disabled={true}
                placeholder={currentPhone}
              ></input> 
             </div>

            {/* birthday */}
            <div className="view-account-column-entry">
              <label className="account-label" htmlFor="birthday">
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
              <label className="account-label" htmlFor="level">
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


        </div>

        <div className="add-family-popup" id="myForm">
          <form className="form-container">
            <label htmlFor="name">
              <b>Name</b>
            </label>
            <input type="name" onChange={handleNewName}></input>

            {/* <label htmlFor="phone">
              <b>Phone Number</b>
            </label>
            <input type="phone" onChange={handleNewPhone}></input> */}

            <label htmlFor="birthday">
              <b>Birthday</b>
            </label>
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
