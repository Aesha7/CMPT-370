import React, { useState } from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { Route, Routes, useNavigate } from "react-router";
import './AccountCreationPage.css';


const AccountCreatePage = () => {
// states for registration
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [name, setName] = useState('');
 const [birthday, setBirthday] = useState('');
 const [phone, setPhone] = useState('');


// States for checking the errors
 const [waiver, setWaiver] = useState(false)
 const [submitted, setSubmitted] = useState(false);
 const [error, setError] = useState(false);

 let navigate = useNavigate(); 

 const viewAccountPageRouteChange = () =>{
    let path = '/my-account';
    navigate(path)
   }


/**
 * Handling form submittion
 */
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(email === '' || password === '' || name === '' || phone === '' || birthday === '' ||!waiver ){
      setError(true);
    }
    else{
      setSubmitted(true);
      setError(false);
// save backend stuff here

// navigate
    viewAccountPageRouteChange();
    }
  }

  /**
   * saying they agree with the waiver
   */
  const handleWaiver = (e) =>{
    e.preventDefault();
    setWaiver(true);
  }

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

/**
 * Handling Name change
 */
const handleName = (e) => {
    setName(e.target.value);
    setSubmitted(false);
};

/**
 * Handling Phone Number change
 */
const handlePhone = (e) => {
    setPhone(e.target.value);
    setSubmitted(false);
};

/**
 * Handling Birthday change
 */
const handleBirthDay = (e) => {
    setBirthday(e.target.value);
    setSubmitted(false);
};

  return (
    <div className="account-creation-page">

    <div className="account-create-top-bar">Create Account</div>

    <div className="account-create-container">

      <form>

        <div className="account-create-container-toprow">
        <div className="column-entry">
            <label className="account-create-label" for="name">Name:</label>
            <input onChange={handleName} className="text-field" value={name} type="name" id="name" />
          </div>

          <div className="account-create-column-entry">
            <label className="account-create-label" for="email">Email:</label>
            <input onChange={handleEmail} className="text-field" value={email} type="email" id="email" />
            {/* <button onClick={handleSubmit} className="button1" type="button">Login</button>           */}
          </div>

          <div className="account-create-column-entry">
            <label className="account-create-label" for="password">Password:</label>
            <input onChange={handlePassword} className="text-field" value={password} type="password" id="password" />
          </div>

          <div className="account-create-column-entry">
            <label className="account-create-label" for="phone-number">Phone Number:</label>
            <input onChange={handlePhone} className="text-field" value={phone} type="phone" id="phone" />
          </div>

          <div className="account-create-column-entry">
            <label className="account-create-label" for="birthday">Birthday:</label>
            <input onChange={handleBirthDay} className="text-field" value={birthday} type="birthday" id="birthday" />
          </div>

          <div className="account-create-row-entry">
            <label className="account-create-label" for="waiver">Waiver</label>
            <div className="account-create-row-entry">
                <label className='account-create-label' for='waiverPDF'>waiver pdf</label>
                <button className="waiver-button" onClick={handleWaiver}>I agree</button>
            </div>
          </div>

          <div className="account-create-column-entry">
            <button className="account-create-submit-button" onClick={handleSubmit}>Submit</button>
          </div>

          

        </div>

      </form>

    </div>
    
    </div>

  );
}

export default AccountCreatePage;
