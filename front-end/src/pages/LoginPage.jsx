import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import "../style/LoginPage.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const LoginPage = () => {
  // states for registration
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountID, setAccountID] = useState("");
  let [userID, setUserID] = useState("");

  // States for checking the errors
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  // state for viewing account list
  const [names, setNames] = useState("");

  let navigate = useNavigate();

  const backToLandingPage = () => {
    let path = "/";
    navigate(path);
  };

  const viewAccountPageRouteChange = () => {
    let path = "/my-account";
    navigate(path, { state: userID });
  };

  function validEmail(email) {
    // Regular expression for a valid email address
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailRegex.test(email);
  }

  /**
   * Handling form submittion
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      alert("Please input all of the information.");
      setError(true);
      alert("Please fill out every field.");
    } else if (!validEmail(email)) {
      alert("Please enter a valid email.");
    } else {
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
            if (data == "Password does not match.") {
              setSubmitted(false);
              setError(true);
              alert("Password does not match.");
            } else if (data == "Email not found.") {
              setSubmitted(false);
              setError(true);
              alert("Email not found.");
            } else {
              setSubmitted(true);
              setError(false);
              userID = data;
              viewAccountPageRouteChange();
            }
            return data;
          });
      } catch (error) {
        console.log(error);
      }
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
   * Handling Password change
   */
  const handlePassword = (e) => {
    setPassword(e.target.value);
    setSubmitted(false);
  };

  const forgotPasswordDummy = (e) => {
    alert("This is a dummy feature.");
  };

  //temporary, for testing
  const viewAccounts = () => {
    fetch("/view_account_list", {
      method: "get",
      dataType: "json",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setNames(responseData);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
    return;
  };

  return (
    <div className="home-page">
      <div className="top-bar">
        Login
        <div className="allButtons">
          <button className="top-bar-button" onClick={backToLandingPage}>
            Home
          </button>
        </div>
      </div>

      <div className="container">
        <form>
          <div className="container-toprow">
            <div className="column-entry">
              <label className="label" htmlFor="email">
                Email:
              </label>
              <input
                onChange={handleEmail}
                className="text-field"
                value={email}
                type="email"
                id="email"
              />
              <button onClick={handleSubmit} className="button1" type="button">
                Login
              </button>
            </div>

            <div className="column-entry">
              <label className="label" htmlFor="password">
                Password:
              </label>
              <input
                onChange={handlePassword}
                className="text-field"
                value={password}
                type="password"
                id="password"
              />
              <button
                className="button2"
                type="button"
                onClick={forgotPasswordDummy}
              >
                Forgot Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
