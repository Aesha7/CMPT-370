import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import "../style/LandingPage.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const LandingPage = () => {
  let navigate = useNavigate();

  // going to account
  const loginRouteChange = () => {
    let path = `/login`;
    navigate(path);
  };

  //  // going to create account
  const createAccountRouteChange = () => {
    let path = "/create-account";
    navigate(path);
  };

  return (
    <div className="home-page">
      <div className="top-bar">Landing Page</div>
      <div className="container">
        <div className="login">
            <div className="container-toprow"></div>

            <div className="column-entry">
              <button className="login-button" onClick={loginRouteChange}>
                Login
              </button>
            </div>

            <div className="column-entry">
              <button
                onClick={createAccountRouteChange}
                // className="login-button"
                type="button"
              >
                Create Account
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
