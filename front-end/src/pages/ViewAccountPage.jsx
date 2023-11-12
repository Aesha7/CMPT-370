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

  // gets account information
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

  useEffect(() => {
    get_account_info();
  }, []);

  /**
   phone = ___;
   birthday = ___;
   name = ___;
   */
  let navigate = useNavigate();

  // the children that are listed
  const registerChild = (e) => {
    let path = "/class-registration";
    let user = users[e.target.value];
    let name = user.name;
    console.log(userID);
    navigate(path, { state: { _id: userID, curUserName: name } });
  };

  // displays the info for the current user (parent or children)
  const displayInfo = (e) => {
    setCurrentUserIndex(e.target.value);
    setCurrentName(users[currentUserIndex].name);
    setCurrentBirthday(users[currentUserIndex].birthday);
    setCurrentLevel(users[currentUserIndex].level);
  };

  // getting a list of html elements to display users and buttons
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

  // takes you to the family schedule
  const viewFamilyScheduleRouteChange = () => {
    let path = "/family-schedule";
    navigate(path, { state: userID });
  };

  // logout button
  const goBackToLogin = () => {
    let path = "/";
    navigate(path);
  };

  // go to admin calendar
  const adminCalendarPageRoute = () => {
    let path = "/admin-schedule";
    navigate(path, { state: userID });
  };

  // go to account management page
  const manageAccountsPageRoute = () => {
    let path = "/admin-accounts";
    navigate(path, { state: userID });
  };

  // go to coach calendar
  const coachCalendarPageRoute = () => {
    let path = "/coach-schedule";
    navigate(path, { state: userID });
  };

  // go to student list page
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

  // edit subsctiptions api call
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
        return response.text(); // Get the response text
      });
    } catch (error) {
      console.log(error);
    }
  };

  // unlocks the input fields
  const unlockInfo = () => {
    document.getElementById("edit-name").disabled = false;
  };

  // Saves name user name to database
  // TODO: BUG: After editing a name and clicking "save", the name in the Name box no longer changes to match the user that is clicked on.
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
            return response.json(); // Get the response text
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
        setName(changedName); //Updates name displayed in Account Info column if parent was edited
      }
      setCurrentName(changedName);
      document.getElementById("edit-name").disabled = true;

      // updating data
      get_account_info();
      getRenders();
    }
  };

  // shows popup for adding a family member
  const addFamilyMemberPopup = (e) => {
    document.getElementById("myForm").style.display = "block";
    document.querySelector(".myForm-overlay").style.display = "block";
  };


  // api call for submitting family member
  const submitFamilyMember = (e) => {
    e.preventDefault();

    if (newName == "" || newBirthday == "") {
      alert("Please input all fields.");
    } else {
      // new child using newName, newPhone, newBirthday, level = 1
      try {
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
    // console.log("clicked");
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


  // checking to see if the user can see admin or coach buttons
  if (staffLevel == 3) {
    document.getElementById("manageAccounts").style.display = "block";
    document.getElementById("adminCalendar").style.display = "block";
  }

  if (staffLevel == 1) {
    document.getElementById("studentsList").style.display = "block";
    document.getElementById("coachCalendar").style.display = "block";
  }

  getRenders();
  return (
    <div className="view-account-page">
      <div className="top-bar">
        My Account
        <div className="allButtons">
          <button
            className="top-bar-button"
            htmlFor="manageAccounts"
            id="manageAccounts"
            onClick={manageAccountsPageRoute}
          >
            Manage Accounts
          </button>
          <button
            className="top-bar-button"
            htmlFor="adminCalendar"
            id="adminCalendar"
            onClick={adminCalendarPageRoute}
          >
            Admin Calendar
          </button>
          <button
            className="top-bar-button"
            htmlFor="studentsList"
            id="studentsList"
            onClick={studentsListPageRoute}
          >
            Students List
          </button>
          <button
            className="top-bar-button"
            htmlFor="coachCalendar"
            id="coachCalendar"
            onClick={coachCalendarPageRoute}
          >
            Coach Calendar
          </button>
          <button className="top-bar-button" onClick={goBackToLogin}>
            {" "}
            Logout{" "}
          </button>
        </div>
      </div>
      <div className="view-account-container">
        <div className="view-user-info-1">
          <div className="view-account-column-entry">
            <label className="heading" htmlFor="member">
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
            <label className="account-label" htmlFor="phone">
              {" "}
              Phone:{" "}
            </label>
            <label
              className="info-label"
              htmlFor="phone"
              type="phone"
              id="phone"
            >
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
              <label className="heading" htmlFor="family">
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
              <label className="heading" htmlFor="family">
                Family Member Info:
              </label>
            </div>

            {/* name */}
            <div className="view-account-column-entry">
              <label className="account-label" htmlFor="name">
                {" "}
                Name:{" "}
              </label>
              <input
                onChange={handleChangedName}
                className="edit-label"
                htmlFor="name"
                type="name"
                id="edit-name"
                disabled={true}
                placeholder={currentName}
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

          <div className="email-list">
            <div className="view-account-column-entry">
              <label className="heading" htmlFor="email" type="emailList">
                Email List:
              </label>

              <label className="checklist">
                Newsletter
                <input
                  type="checkbox"
                  checked={newsChecked}
                  onChange={handleNewsChange}
                />
                <span className="checkmark"></span>
              </label>

              <br />

              <label className="checklist">
                Promotions
                <input
                  type="checkbox"
                  checked={promChecked}
                  onChange={handlePromChange}
                />
                <span className="checkmark"></span>
              </label>

              <button className="save-button" onClick={editSubscriptions}>
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="myForm-overlay"></div>

        <div className="add-family-popup" id="myForm">
          <form className="form-container">
            <label htmlFor="name">
              <b>Name</b>
            </label>
            <input type="name" onChange={handleNewName}></input>

            <label htmlFor="birthday">
              <b>Birthday</b>
            </label>
            <DatePicker
              className="custom-datepicker"
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
