import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "../style/ViewAccountPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const AccountView = () => {
  const location = useLocation();
  let renders;

  // use these variables to set proper data
  let [name, setName] = useState("John Doe");
  let [phone, setPhone] = useState("(306) 123-4567");
  let [email, setEmail] = useState("email@domain.com");
  let [birthday, setBirthday] = useState("month/day/year");
  let [userID, setUserID] = useState("");
  let [staffLevel, setStaffLevel] = useState("");

  // the current data being displayed
  let [currentName, setCurrentName] = useState("");
  let [currentLevel, setCurrentLevel] = useState("");
  let [currentBirthday, setCurrentBirthday] = useState("");

  // values that change user info
  let [newName, setNewName] = useState("");
  let [newBirthday, setNewBirthday] = useState("");
  let [changedName, setChangedName] = useState("");

  // the array of users (including the main one)
  const [users, setUsers] = useState([]);

  // index to modify user data
  let [currentUserIndex, setCurrentUserIndex] = useState(0);

  // getting userID from previous page
  userID = location.state;

  // saving it to local storage
  if (userID != null) {
    window.localStorage.setItem("_id", userID);
  }

  // getting it from local storage
  userID = window.localStorage.getItem("_id");

  // for subscription checkboxes
  const [promChecked, setPromChecked] = React.useState(false);
  const [newsChecked, setNewsChecked] = React.useState(false);

  /**
   * gets the account info from the database
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
          return response.text(); // get the response text
        })
        .then((text) => {
          // Parse the text as JSON
          // setting relevent info as react states
          const data = JSON.parse(text);
          setEmail(data.email);
          setName(data.users[0].name);
          setPhone(data.phone);
          setBirthday(data.users[0].birthday);
          setStaffLevel(data.staffLevel);

          setNewsChecked(data.news);
          setPromChecked(data.prom);

          setUsers(data.users);
        });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * updates account info when states change
   */
  useEffect(() => {
    get_account_info();
  }, []);

  let navigate = useNavigate();

  /**
   * Register child for a class
   */
  const registerChild = (e) => {
    let path = "/class-registration";
    let user = users[e.target.value];
    let name = user.name;
    navigate(path, { state: { _id: userID, curUserName: name } });
  };

  /**
   * Display info for current user (parent or child)
   */
  const displayInfo = (e) => {
    setCurrentUserIndex(e.target.value);
    setCurrentName(users[currentUserIndex].name);
    setCurrentBirthday(users[currentUserIndex].birthday);
    setCurrentLevel(users[currentUserIndex].level);
  };

  /**
   * getting a list of html elements to display for each user
   */
  const getRenders = () => {
    let j = -1;
    renders = users.map(function (i) {
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
  };

  /**
   * Perform page routing
   */
  const viewFamilyScheduleRouteChange = () => {
    let path = "/family-schedule";
    navigate(path, { state: userID });
  };

  /**
   * page route back to the login page
   */
  const goBackToLogin = () => {
    let path = "/";
    navigate(path);
  };

  /**
   * page route to admin calendar page
   */
  const adminCalendarPageRoute = () => {
    let path = "/admin-schedule";
    navigate(path, { state: userID });
  };

  /**
   * page route to manage accounts page
   */
  const manageAccountsPageRoute = () => {
    let path = "/admin-accounts";
    navigate(path, { state: userID });
  };

  /**
   * page route to coach calendar page
   */
  const coachCalendarPageRoute = () => {
    let path = "/coach-schedule";
    navigate(path, { state: userID });
  };

  /**
   * page route to coaches students list
   */
  const studentsListPageRoute = () => {
    let path = "/students-list";
    navigate(path, { state: userID });
  };

  // handles news checkbox
  const handleNewsChange = () => {
    setNewsChecked(!newsChecked);
  };

  // handles promotions checkbox
  const handlePromChange = () => {
    setPromChecked(!promChecked);
  };

  /**
   * edits the email subscriptions in the backend
   */
  const editSubscriptions = (e) => {
    e.preventDefault();
    try {
      fetch(server_URL + "edit_subscriptions", {
        method: "POST",
        body: JSON.stringify({
          _id: userID,
          news: newsChecked,
          prom: promChecked,
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
      }).then((response) => {
        return response.text(); // get the response text
      });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * Edit info fields
   */
  const unlockInfo = () => {
    document.getElementById("edit-name").disabled = false;
  };

  /**
   * Save info fields
   */
  const saveInfo = (e) => {
    e.preventDefault();
    if (changedName === "") {
      alert("Please input a name");
    } else {
      try {
        fetch(server_URL + "edit_family", {
          method: "POST",
          body: JSON.stringify({
            _id: userID,
            new_name: changedName,
            old_name: currentName,
          }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
        })
          .then(function (response) {
            return response.json(); // get the response text
          })
          .then(function (data) {
            if (data == "Error: No user by that name found") {
              alert("Error: No user by that name found");
            } else if (data == "Error: account not found") {
              alert("Error: account not found");
            } else if (
              data == "Error: user with name already exists in account"
            ) {
              alert("Error: user with name already exists in account");
            }
          });
      } catch (error) {
        console.log(error);
      }
      if (currentUserIndex == 0) {
        setName(changedName); // updates name displayed in Account Info column if parent was edited
      }
      setCurrentName(changedName);
      document.getElementById("edit-name").disabled = true;

      // updating data
      get_account_info();
      getRenders();
    }
  };

  /**
   * Add new member to family account
   */
  const addFamilyMemberPopup = (e) => {
    document.getElementById("myForm").style.display = "block";
    document.querySelector(".myForm-overlay").style.display = "block";
  };

  /**
   * Handling form submittion
   */
  const submitFamilyMember = (e) => {
    e.preventDefault();

    // checking new name and birthday validity
    if (newName == "" || newBirthday == "") {
      alert("Please input all fields.");
    } else {
      // new child using newName, newPhone, newBirthday, level = 1
      try {
        // splitting the birthday to the appropriate string
        let dateArr = newBirthday.toString().split(" ");
        let stringBirthday = dateArr[1] + " " + dateArr[2] + " " + dateArr[3];
        fetch(server_URL + "add_family", {
          method: "POST",
          body: JSON.stringify({
            _id: userID,
            name: newName,
            birthday: stringBirthday,
          }),
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
            text = text.substring(1, text.length - 1);
            if (text == "Success") {
              window.location.reload(false);
              return text;
            } else if (text == "Error: name already in use") {
              alert("Name is already in use.");
            }
          });
      } catch (error) {
        console.log(error);
      }

      document.getElementById("myForm").style.display = "none";
    }
  };

  // closes family member popup
  const closeForm = () => {
    document.getElementById("myForm").style.display = "none";
    document.querySelector(".myForm-overlay").style.display = "none";
  };

  // handles new childs name
  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  // handles edited name
  const handleChangedName = (e) => {
    setChangedName(e.target.value);
  };

  // handles new childs birthday
  const handleNewBirthday = (date) => {
    setNewBirthday(date);
  };

  // check if user account is admin
  if (staffLevel == 3) {
    document.getElementById("manageAccounts").style.visibility = "visible";
    document.getElementById("adminCalendar").style.visibility = "visible";
  }

  // check if user account is coach
  if (staffLevel == 1) {
    document.getElementById("studentsList").style.visibility = "visible";
    document.getElementById("coachCalendar").style.visibility = "visible";
  }

  // getting the renders
  getRenders();

  return (
    <div className="view-account-page">
      My Account
      <div class="rectangleTop"></div>
      <div class="rectangleButtons"></div>
      <div class="rectangleFamReg"></div>
      <div class="rectangleFamInf"></div>

      <div class="rectangleMembers"></div>
      <div class="rectangleCurrent"></div>
      <div class="rectangleSubs"></div>
      <label className="emailSubs">Email Subscriptions</label> 
      <label className="ownerNLabel" htmlFor="name">Owner:{" "}</label>
      <label className="ownerName" htmlFor="name" type="name" id="name">{name}</label>
      <label className="ownerELabel" htmlFor="email">Email:</label>
      <label className="ownerEmail" htmlFor="email" type="email"id="email">{email}</label>
      <label className="checklistNews">Newsletter<input type="checkbox" checked={newsChecked} onChange={handleNewsChange}/>
        <span className="checkmarkNews"></span>
      </label>
      <label className="checklistPromotions">Promotions<input type="checkbox" checked={promChecked} onChange={handlePromChange} />
        <span className="checkmarkPromotions"></span>
      </label>
      <button className="buttonSaveSubs" onClick={editSubscriptions}>
                  Save
                </button>
      <button className="buttonLogout" onClick={goBackToLogin}>Logout</button>
      <button className="buttonManAcc" htmlFor="manageAccounts" id="manageAccounts" onClick={manageAccountsPageRoute}> Manage Accounts</button>
      <button className="buttonAdmCal" htmlFor="adminCalendar" id="adminCalendar" onClick={adminCalendarPageRoute}>Admin Calendar</button>
      <button className="buttonStuList" htmlFor="studentsList" id="studentsList" onClick={studentsListPageRoute}>Students List</button>
      <button className="buttonCoCal" htmlFor="coachCalendar" id="coachCalendar" onClick={coachCalendarPageRoute}>Coach Calendar</button>
      <button className="family-button" onClick={addFamilyMemberPopup}>
                  Add Family Member
                </button>
      <button className="schedule-button" onClick={viewFamilyScheduleRouteChange}>
                  View Family Schedule
      </button>
      <label className="family-bar">Family Members</label>
      <div class="triangleFamMems"></div>
      <div className="familyContainer">{renders}</div>
     
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
              onChange={handleChangedName}
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


        {/* darkening overlay for adding a family member */}
        <div className="myForm-overlay"></div>

        {/* add new family member */}
        <div className="add-family-popup" id="myForm">
          <form className="family-form-container">
            <label className="add-family-label-name" htmlFor="name">
            <b>Name</b>
            </label>
            <input type="name" onChange={handleNewName}></input>

            <label className="add-family-label-bday" htmlFor="birthday">
              <b>Birthday</b>
            </label>
            <DatePicker
              className="custom-datepicker-addFamily"
              selected={newBirthday}
              onChange={handleNewBirthday}
              dateFormat="MM/dd/yyyy"
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date(2099, 11, 31)}
              showMonthDropdown={true}
              showYearDropdown={true}
              todayButton="Today"
              dropdownMode="select"
              placeholderText="Select a date"
            />
            <button type="submit" className="btn-sub" onClick={submitFamilyMember}>
              Register
            </button>
            <button type="button" className="btn-cancel" onClick={closeForm}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountView;
