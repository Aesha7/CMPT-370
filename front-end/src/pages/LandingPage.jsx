import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import '../style/LandingPage.css';

const server_URL = "http://127.0.0.1:5000/" //URL to access server

const LandingPage = () => {

 let navigate = useNavigate(); 

 // going to account
 const loginRouteChange = () =>{ 
   let path = `/login`; 
   navigate(path);
 }


//  // going to create account
 const createAccountRouteChange = () =>{
  let path = '/create-account';
  navigate(path);
 }

  return (

    <div className="home-page">
    <div className="top-bar">Login</div>
    <div className="container">

      <form>

        <div className="container-toprow">
          
        </div>

        <button onClick={createAccountRouteChange}
        className="button3" type="button">Create Account</button> 

        <button onClick={loginRouteChange}>Login</button>
        <p></p>
        {/* <button onClick={viewAccounts} 
        className="button3" type="button">View Accounts</button> 
         */}
      </form>
    
    </div>
      {/* <p>{names}</p> */}
    </div>

  );
}

export default LandingPage;
