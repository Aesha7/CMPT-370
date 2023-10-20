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
 const [signature, setSignature] = useState('');


// States for checking the errors
 const [waiver, setWaiver] = useState(false)
 const [submitted, setSubmitted] = useState(false);
 const [error, setError] = useState(false);

 let navigate = useNavigate(); 

 const viewAccountPageRouteChange = () =>{
    let path = '/my-account';
    navigate(path, {state:email});
   }

  const backToLogin = () =>{
    let path = '/';
    navigate(path);
  }

  const goToWaiver = () =>{
    let path = '/waiver-form';
    navigate(path);
  }


/**
 * Handling form submittion
 */
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(email === '' || password === '' || name === '' || phone === '' || birthday === '' || signature === '' || !waiver ){
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
    if(!waiver){
      e.target.style.backgroundColor = 'green';
      //  e.target.style.color = 'black';
      setWaiver(true);
  }
    else{
      e.target.style.backgroundColor = 'white';
      //  e.target.style.color = 'black';
      setWaiver(false); 
    }
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

/**
 * Handling Signature change
 */
const handleSignature = (e) => {
  setSignature(e.target.value);
  setSubmitted(false);
};

  return (
    <div className="account-creation-page">

    <div className="top-bar">Create Account
      <button className="top-bar-button" onClick={backToLogin}>Back</button>
    </div>

    <div className="account-create-container">

      <form>

        <div className="account-create-container-toprow">
        <div className="column-entry">
            <label className="account-create-label" for="name">Name:</label>
            <input onChange={handleName} className="text-field" value={name} type="name" id="name" placeholder="First Last"/>
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
            <input onChange={handlePhone} className="text-field" value={phone} type="phone" id="phone" placeholder="(123) 456-6789"/>
          </div>

          <div className="account-create-column-entry">
            <label className="account-create-label" for="birthday">Birthday:</label>
            <input onChange={handleBirthDay} className="text-field" value={birthday} type="birthday" id="birthday" placeholder="Day/Month/Year"/>
          </div>

          <div className="account-create-row-entry">
            <label className="account-create-label" htmlFor="waiver">Waiver:</label>
            <div className="waiver-entry">
                <button className="waiver-button" onClick={goToWaiver}>Click Here To Open</button>
                {/* <button className="waiver-button" onClick={handleWaiver} id="waiver-button">I agree</button> */}

                <label class="checklist-2">I Agree
                  <input type="checkbox-2"/>
                  <span class="checkmark-2" onClick={handleWaiver} id="waiver-button"></span>
                </label>

            </div>
          </div>

          <div className="account-create-column-entry">
            <label className="account-create-label" for="signature">Signature:</label>
            <input onChange={handleSignature} className="text-field" value={signature} type="signature" id="signature" placeholder="Full Name"/>
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
