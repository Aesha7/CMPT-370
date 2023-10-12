import React, { useState } from "react";
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { Route, Routes, useNavigate } from "react-router";
import './HomePage.css';


const HomePage = () => {
// states for registration
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');

// States for checking the errors
 const [submitted, setSubmitted] = useState(false);
 const [error, setError] = useState(false);

 let navigate = useNavigate(); 

 // going to account
 const routeChange = () =>{ 
   let path = `/account-page`; 
   navigate(path);
 }


//  // going to create account
 const createAccountRouteChange = () =>{
  let path = '/create-account';
  navigate(path);
 }

 const viewAccountPageRouteChange = () =>{
  let path = '/my-account';
  navigate(path)
 }


/**
 * Handling form submittion
 */
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(email === '' || password === ''){
      setError(true);
    }
    else{
      setSubmitted(true);
      setError(false);
      viewAccountPageRouteChange();
      
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

  return (

    <div className="home-page">

    <div className="top-bar">Login</div>

    <div className="container">

      <form>

        <div className="container-toprow">
          
          <div className="column-entry">
            <label className="label" for="email">Email:</label>
            <input onChange={handleEmail} className="text-field" value={email} type="email" id="email" />
            <button onClick={handleSubmit} className="button1" type="button">Login</button>          
          </div>

          <div className="column-entry">
            <label className="label" for="password">Password:</label>
            <input onChange={handlePassword} className="text-field" value={password} type="password" id="password" />
            <button className="button2" type="button">Forgot Password</button>
          </div>

        </div>

        <button onClick={createAccountRouteChange}
        className="button3" type="button">Create Account</button> 

      </form>

    </div>
    
    </div>

  );
}

export default HomePage;
