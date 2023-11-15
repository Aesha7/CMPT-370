import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import "../style/AccountCreationPage.css";
import "../style/ViewAccountPage.css";
import DatePicker from "react-datepicker";


const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const AccountCreatePage = (props) => {

  // states for registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [signature, setSignature] = useState("");
  let [userID] = useState("");

  // states for checking the errors
  const [waiver, setWaiver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  let navigate = useNavigate();

  /**
  * Perform page routing
  */
  const viewAccountPageRouteChange = () => {
    let path = "/my-account";
    navigate(path, { state: userID });
  };

  const backToLandingPage = () => {
    let path = "/";
    navigate(path);
  };

  const goToWaiver = () => {
    let path = "/waiver-form";
    navigate(path);
  };

   /**
   * Check for valid email address
   */ 
  function validEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  /**
   * Handling form submittion
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      name === "" ||
      phone === "" ||
      birthday === "" ||
      signature === "" 
    ) {
      setError(true);
      alert("Please fill out every field.");
    } else if(!waiver){
      alert("Please agree to the waiver.")
    } 
    else if (!validEmail(email)) {
      alert("Please enter a valid email.");
      setError(true);
    } else if (password != confirmPassword) {
      alert("Passwords do not match.");
      setError(true);
    } else {
      try {
        // send request to backend and wait for the response
        fetch(server_URL + "submit_application", {
          method: "POST",
          // data will be serialized and sent as json
          body: JSON.stringify({
            email: email,
            password: password,
            name: name,
            phone: phone,
            birthday: birthday,
            waiver: waiver,
          }),
          // tell the server we're sending JSON
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
          },
        })
          .then(function (response) {
            // The response is a Response instance.
            // You parse the data into a useable format using `.json()`
            return response.json();
          })
          .then(function (data) {
            // `data` is the parsed version of the JSON returned from the above endpoint.

            // Checks for error/success messages sent by server
            if (data == "Success") {
              setSubmitted(true);
              setError(false);
              //navigate
              // fetch the object id
              try {
                // send request to backend and wait for the response
                fetch(server_URL + "get_id", {
                  method: "POST",
                  // Data will be serialized and sent as json
                  body: JSON.stringify({
                    email: email,
                    password: password, //TODO: stores password in plain text! add proper password management
                  }),
                  // tell the server we're sending JSON
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Headers": "Content-Type",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
                  },
                })
                  .then(function (response) {
                    return response.json();
                  })
                  .then(function (data) {
                    setSubmitted(true);
                    setError(false);
                    userID = data;
                    viewAccountPageRouteChange();
                    return data;
                  });
              } catch (error) {
                console.log(error);
              }
            } else if (data == "Email already in use!") {
              setSubmitted(false);
              setError(true);
              alert("Email already in use.");
            } else {
              //Unexpected message or error in response
              setSubmitted(false);
              setError(true);
              alert("Invalid response!");
            }
            return data;
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  /**
   * Handling waiver form selection
   */
  const handleWaiver = (e) => {
    e.preventDefault();
    if (!waiver) {
      e.target.style.backgroundColor = "green";
      //  e.target.style.color = 'black';
      setWaiver(true);
    } else {
      e.target.style.backgroundColor = "white";
      //  e.target.style.color = 'black';
      setWaiver(false);
    }
  };

  /**
   * Handling email change
   */
  const handleEmail = (e) => {
    setEmail(e.target.value);
    setSubmitted(false);
  };

  /**
   * Handling password change
   */
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
  };

  /**
   * Handling name change
   */
  const handleName = (e) => {
    setName(e.target.value);
    setSubmitted(false);
  };

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setSubmitted(false);
  };

  /**
   * Handling phone number change
   */
  const handlePhone = (e) => {
    setPhone(e.target.value);
    setSubmitted(false);
  };

  /**
   * Handling birthday change
   */
  const handleBirthDay = (date) => {
    let arr = date.toString().split(" ")
    setBirthday(arr[1] + " " + arr[2] + " "+ arr[3]);
    setSubmitted(false);
  };

  /**
   * Handling signature change
   */
  const handleSignature = (e) => {
    setSignature(e.target.value);
    setSubmitted(false);
  };


  return (
    <div className="account-creation-page">
      <div className="top-bar">
        Create Account
        <div className="allButtons">
        <button className="top-bar-button" onClick={backToLandingPage}>Home</button>
        </div>
      </div>

      <div className="account-create-container">

        {/* input fields in form */}
        <form>
          <div className="account-create-container-toprow">
            <div className="column-entry">
              <label className="account-create-label" htmlFor="name">
                Name:
              </label>
              <input
                onChange={handleName}
                className="text-field"
                value={name}
                type="name"
                id="name"
                placeholder="First Last"
              />
            </div>

            <div className="account-create-column-entry">
              <label className="account-create-label" htmlFor="email">
                Email:
              </label>
              <input
                onChange={handleEmail}
                className="text-field"
                value={email}
                type="email"
                id="email"
              />
            </div>

            <div className="account-create-column-entry">
              <label className="account-create-label" htmlFor="password">
                Password:
              </label>
              <input
                onChange={handlePassword}
                className="text-field"
                value={password}
                type="password"
                id="password"
              />
            </div>

            <div className="account-create-column-entry">
              <label className="account-create-label" htmlFor="password">
                Confirm Password:
              </label>
              <input
                onChange={handleConfirmPassword}
                className="text-field"
                value={confirmPassword}
                type="password"
                id="password"
              />
            </div>

            <div className="account-create-column-entry">
              <label className="account-create-label" htmlFor="phone-number">
                Phone Number:
              </label>
              <input
                onChange={handlePhone}
                className="text-field"
                value={phone}
                type="phone"
                id="phone"
                placeholder="(123) 456-6789"
              />
            </div>

            <div className="account-create-column-entry">
              <label className="account-create-label" htmlFor="birthday">
                Birthday:
              </label>

            <DatePicker
              className="custom-datepicker-createAccount"
              selected={birthday}
              onChange={handleBirthDay}
              dateFormat="MM/dd/yyyy"
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date(2099, 11, 31)}
              showMonthDropdown={true}
              showYearDropdown={true}
              todayButton="Today"
              dropdownMode="select"
              placeholderText="Select a date"
            />
            </div>

            {/* waiver selection in form */}
            <div className="account-create-row-entry">
              <label className="account-create-label" htmlFor="waiver">
                Waiver:
              </label>
              <div className="waiver-entry">
                <button className="waiver-button" onClick={goToWaiver}>
                  Click Here To Open
                </button>
                <label className="checklist">
                  I Agree
                  <input type="checkbox" />
                  <span className="checkmark" onClick={handleWaiver} id="waiver-button"></span>
                </label>
              </div>
            </div>

            {/* adding signature in form */}
            <div className="account-create-column-entry">
              <label className="account-create-label" htmlFor="signature">
                Signature:
              </label>
              <input
                onChange={handleSignature}
                className="text-field"
                value={signature}
                type="signature"
                id="signature"
                placeholder="Full Name"
              />
            </div>

            <div className="account-create-column-entry">
              <button
                className="account-create-submit-button"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AccountCreatePage;
