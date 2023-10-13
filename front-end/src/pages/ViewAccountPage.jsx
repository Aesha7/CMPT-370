import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import { Route, Routes, useNavigate } from "react-router";
import "./ViewAccountPage.css";

const AccountView = () => {
  const [name] = useState("John Doe");
  const [phone] = useState("(306) 123-4567");
  const [email] = useState("abc123@domain.ca");
  const [birthday] = useState("month/day/year");
  const [password] = useState("");

  return (
    <div className="view-account-page">
      <div className="view-account-top-bar">
        My Account
        <button className="view-account-settingsButton">&#x26ED;</button>
      </div>

      <div className="view-account-container">
        <div className="view-account-container-toprow">
          <div className="view-account-column-entry">
            <label className="view-account-label" for="email">
              Email:
            </label>
            <input
              className="text-field"
              value={email}
              type="email"
              id="email"
            />
          </div>

          <div className="view-account-column-entry">
            <label className="view-account-label" for="password">
              Password:
            </label>
            <input
              className="view-account-text-field"
              value={password}
              type="password"
              id="password"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountView;
