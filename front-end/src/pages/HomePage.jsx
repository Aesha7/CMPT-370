import React, { useState } from "react";
import { Route, Routes, useNavigate } from "react-router";
import '../style/HomePage.css';

const server_URL = "http://127.0.0.1:5000/" //URL to access server

const HomePage = () => {
// states for registration
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [accountID, setAccountID] = useState('');
 let [userID, setUserID] = useState('')

// States for checking the errors
 const [submitted, setSubmitted] = useState(false);
 const [error, setError] = useState(false);

 // state for viewing account list
 const [names, setNames] = useState('');

 let navigate = useNavigate(); 

 // going to account
 const routeChange = () =>{ 
   let path = `/my-account`; 
   navigate(path);
 }


//  // going to create account
 const createAccountRouteChange = () =>{
  let path = '/create-account';
  navigate(path);
 }

 const viewAccountPageRouteChange = () =>{
  let path = '/my-account';
  navigate(path, {state:userID})
 }

 function validEmail(email) {
  // Regular expression for a valid email address
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  return emailRegex.test(email);
}

/**
 * Handling form submittion
 */
  const handleSubmit = (e) =>{
    e.preventDefault();
    if(email === '' || password === ''){
      setError(true);
      alert("Please fill out every field.")
    }
    else if(!validEmail(email)){
      alert("Please enter a valid email.")
    }
    else{
      try {
        // send request to backend and wait for the response
        fetch((server_URL+"get_id"), {
            method: "POST",
            // Data will be serialized and sent as json
            body: JSON.stringify({
                email: email,
                password: password, //TODO: stores password in plain text! add proper password management
            }),
            // tell the server we're sending JSON
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
            }
        })
        .then(function(response){
          return response.json();
        }).then(function(data){
          if (data == "Password does not match."){
            setSubmitted(false);
            setError(true);
            alert("Password does not match.");
          }
          else if (data == "Email not found."){
            setSubmitted(false);
            setError(true);
            alert("Email not found.");
          }
          else {
            setSubmitted(true);
            setError(false);
            userID = data;
            viewAccountPageRouteChange();
          }
          return data
        })
    }catch (error){
      console.log(error)
    }
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

const forgotPasswordDummy = (e) => {
  alert("This is a dummy feature.")
}

  //temporary, for testing 
  const viewAccounts = () => {
    fetch("/view_account_list",{method: 'get',
      dataType: 'json',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then(responseData => {
      setNames(responseData)
    }).catch((error) => {
        if (error.response) {
            console.log(error.response)
            console.log(error.response.status)
            console.log(error.response.headers)
        }
    })
    return
  }

  return (

    
    <div className="home-page">EMPIRE PARKOUR
      
        <form>
            <div className="emailLine">
              <input onChange={handleEmail} className="fieldEmailHome" value={email} type="email" id="email" />
              <div class="triangle"></div>  
              <button onClick={null} className="buttonEm" type="button">Email</button>   
            </div>

            <div className="passLine">
              <input onChange={handlePassword} className="fieldPass" value={password} type="password" id="password" />
              <div class="triangle2"></div>  
              <button onClick={null} className="buttonPass" type="button">Password</button>
            </div>
            
            <button onClick={handleSubmit} className="buttonLog" type="button">Login</button> 
            <button onClick={null} className="backLog" type="button"></button>
            <button onClick={createAccountRouteChange} className="buttonAcc" type="button">Create Account</button>
            <button onClick={null} className="backAcc" type="button"></button> 
        </form>
    
      <p>{names}</p>
    
    </div>

  );
}

export default HomePage;
