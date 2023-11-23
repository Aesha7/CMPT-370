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
  const [date, setDate] = useState("")

  // States for checking the errors
  const [waiver, setWaiver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  let navigate = useNavigate();

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

  const acceptWaiver = () =>{

  }

  function validEmail(email) {
    // Regular expression for a valid email address
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailRegex.test(email);
  }

  function validatePhoneNumber(input_str) {
    var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  
    return re.test(input_str);
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
    // } else if(!waiver){
    //   alert("Please agree to the waiver.")
    } 
    else if (!validEmail(email)) {
      alert("Please enter a valid email.");
      setError(true);
    } else if (password != confirmPassword) {
      alert("Passwords do not match.");
      setError(true);
    } else if(!validatePhoneNumber(phone)){
      alert("Please ender a valid phone number.")
    } 
    
    else {
      try {
        // send request to backend and wait for the response
        fetch(server_URL + "submit_application", {
          method: "POST",
          // Data will be serialized and sent as json
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
   * saying they agree with the waiver
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

  const handleConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
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
  const handleBirthDay = (inputDate) => {
    setDate(inputDate)
    let arr = inputDate.toString().split(" ")
    setBirthday(arr[1] + " " + arr[2] + " "+ arr[3]);
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
    <div className="account-creation-page">&nbsp;CREATE ACCOUNT
      {/* <div className="top-bar">Create Account</div> */}

      {/* <div className="account-create-container"> */}
        <form>
          
          {/* <div className="account-create-container-toprow"> */}
            <div className="entryName">
              {/* <label className="labelName" htmlFor="name">Name:</label> */}
            
              <button onClick={null} className="labelName" type="button">Name:</button> 
              <div class="triangleName"></div>
              <input onChange={handleName} className="fieldName" value={name} type="name" id="name" placeholder="First / Last"/>
            </div>

            <div className="entryEmail">
              {/* <label className="labelName" htmlFor="name">Name:</label> */}
            
              <button onClick={null} className="labelEmail" type="button">Email:</button> 
              <div class="triangleEmail"></div>
              <input onChange={handleEmail} className="fieldEmail" value={email} type="email" id="email" placeholder="someone@somewhere.com"/>
            </div>

            <div className="entryPword">
              {/* <label className="labelName" htmlFor="name">Name:</label> */}
              <button onClick={null} className="labelPword" type="button">Password:</button> 
              <div class="trianglePword"></div>
              <input onChange={handlePassword} className="fieldPword" value={password} type="password" id="password" placeholder="openSesame1!"/>
            </div>

            <div className="entryConf">
              {/* <label className="labelName" htmlFor="name">Name:</label> */}
           
              <button onClick={null} className="labelConf" type="button">Confirm Password:</button> 
              <div class="triangleConf"></div>
              <input onChange={handleConfirmPassword} className="fieldConf" value={confirmPassword} type="password" id="password" placeholder="openSesame1!"/>
            </div>

            <div className="entryPhone">
              {/* <label className="labelName" htmlFor="name">Name:</label> */}
              <button onClick={null} className="labelPhone" type="button">Phone:</button> 
              <div class="trianglePhone"></div>
              <input onChange={handlePhone} className="fieldPhone" value={phone} type="phone" id="phone" placeholder="(123) 456 7890"/>
            </div>

            <div className="entryBirthday">
              <button onClick={null} className="labelBirthday" type="button">Birthday:</button> 
              <div class="triangleBirthday"></div>
              {/* <input onChange={handleBirthDay} className="fieldBirthday" value={birthday} type="birthday" id="birthday" placeholder="Day/Month/Year"/> */}
              
            <DatePicker
              className="custom-datepicker-createAccount"
              selected={date}
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

            <div className="entrySignature">
              {/* <label className="labelName" htmlFor="name">Name:</label> */}
              <button onClick={null} className="labelSignature" type="button">Signature:</button> 
              <div class="triangleSignature"></div>
              <input onChange={handleSignature} className="fieldSignature" value={signature} type="signature" id="signature" placeholder="Fullname"/>
              {/* <button onClick={null} className="labelSigNote" type="button">*Signing states that you accept the terms and conditions  of the waiver*</button>         */}
            </div>

            <div className="entryWaiver">
              {/* <label className="labelName" htmlFor="name">Name:</label> */}
              {/* <button onClick={null} className="labelWaiver" type="button">Waiver:</button>  */}
              <div class="triangleWaiver"></div>
              <button className="waiver-button" onClick={goToWaiver}>Open Waiver</button>
            
              {/* <button className="buttonAccept" onClick={null}>I Accept</button> */}
            </div>

            <div className="entrySubmit">
              <div class="triangleSubmit"></div>
              <button className="buttonSubmit" onClick={handleSubmit}>Submit</button>
            </div>

            <div className="entryBack">
              <div class="triangleBack"></div>
              <button className="buttonBack" onClick={backToLandingPage}>Back</button>
            </div>
      
        </form>
      
    </div>
  );
};

export default AccountCreatePage;
