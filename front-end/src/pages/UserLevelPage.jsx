import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "../style/UserLevelPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const UserLevelPage = () => {
    const location = useLocation();
    let [name, setName] = useState("John");

    let [ userID, setUserID ] = useState("");
    let [ userName, setUserName ] = useState("");
    let [user, setUser] = useState();
    userID = location.state._id;
    userName = location.state.curUserName;

    if (userID != null) {
        window.localStorage.setItem("_id", userID);
      }
      // getting it from local storage
      userID = window.localStorage.getItem("_id");

      

 /**
   * gets the account info from the database
   */
 const get_account_info = () => {
  try {
    fetch(server_URL + "get_account_info", {
      method: "POST",
      body: JSON.stringify({ _id: userID }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
      },
    })
      .then((response) => {
        return response.text(); // get the response text
      })
      .then((text) => {
        // Parse the text as JSON
        // setting relevent info as react states
        const data = JSON.parse(text);

        user = data;
        console.log(user)
        if(userName == user.users[0].name && user.staffLevel >= 1){
          document.getElementById("coachSaveButton").style.visibility = "visible"
          document.getElementById("coachAddTipButton").style.visibility = "visible"
        }
        else{
          // checkboxes disabled...

        }
      });
  } catch (error) {
    console.log(error);
  }
};


    useEffect(() =>{
        get_account_info()
    }, [])

    const navigate = useNavigate();

    const goBack = () => {
      let path = "/my-account";
      navigate(path, { state: userID });
    };

    const [stepVaultChecked, setStepVaultChecked] = useState(false);
    const [lazyVaultChecked, setLazyVaultChecked] = useState(false);
    const [turnVaultChecked, setTurnVaultChecked] = useState(false);
    
    const [standingChecked, setStandingChecked] = useState(false);
    const [strideChecked, setStrideChecked] = useState(false);
    const [plyoChecked, setPlyoChecked] = useState(false);
    
    const [hipCatchChecked, setHipCatchChecked] = useState(false);
    const [climbDownChecked, setClimbDownChecked] = useState(false);
    const [dashDownChecked, setDashDownChecked] = useState(false);
    
    const [reGripChecked, setReGripChecked] = useState(false);
    const [dismountChecked, setDismountChecked] = useState(false);
    const [lacheChecked, setLacheChecked] = useState(false);

    const [forwardsChecked, setForwardsChecked] = useState(false);
    const [backwardsChecked, setBackwardsChecked] = useState(false);
    const [sidewaysChecked, setSidewaysChecked] = useState(false);

    const handleStepVaultChange = () => {
      setStepVaultChecked(!stepVaultChecked);
    };
    const handleLazyVaultChange = () => {
      setLazyVaultChecked(!lazyVaultChecked);
    };
    const handleTurnVaultChange = () => {
      setTurnVaultChecked(!turnVaultChecked);
    };

    const handleStandingChange = () => {
      setStandingChecked(!standingChecked);
    };
    const handleStrideChange = () => {
      setStrideChecked(!strideChecked);
    };
    const handlePlyoChange = () => {
      setPlyoChecked(!plyoChecked);
    };

    const handleHipCatchChange = () => {
      setHipCatchChecked(!hipCatchChecked);
    };
    const handleClimbDownChange = () => {
      setClimbDownChecked(!climbDownChecked);
    };
    const handleDashDownChange = () => {
      setDashDownChecked(!dashDownChecked);
    };

    const handleReGripChange = () => {
      setReGripChecked(!reGripChecked);
    };
    const handleDismountChange = () => {
      setDismountChecked(!dismountChecked);
    };
    const handleLacheChange = () => {
      setLacheChecked(!lacheChecked);
    };

    const handleForwardsChange = () => {
      setForwardsChecked(!forwardsChecked);
    };
    const handleBackwardsChange = () => {
      setBackwardsChecked(!backwardsChecked);
    };
    const handleSidewaysChange = () => {
      setSidewaysChecked(!sidewaysChecked);
    };


    const editSkills = (e) => {

    };



    
  return (
    // <h1>test</h1>
    <div className="user-level-page"> My Progression
    
    {/* // Member name labels at top of page */}
      <label className="NLabel" htmlFor="name">Name:{" "}</label>
      <label className="Name" htmlFor="name" type="name" id="name">{userName}</label>
    
    {/* buttons on the page */}
      <button className="buttonBack" onClick={goBack}> Back </button>
      <button className="buttonSave" id="coachSaveButton" onClick={null}> Save </button>
      <button className="buttonAddTip" id="coachAddTipButton" onClick={null}> Add Tip </button>
    
    {/* Skill checkboxes */}
      <label className="labelSkills"> Skills</label>
      
      <label className="labelVaults">Vaulting</label>
      <label className="checklistStepVault">Step-Vault<input type="checkbox" checked={stepVaultChecked} onChange={handleStepVaultChange}/>
        <span className="checkmarkStepVault"></span>
      </label>
      <label className="checklistLazyVault">Lazy-Vault<input type="checkbox" checked={lazyVaultChecked} onChange={handleLazyVaultChange}/>
        <span className="checkmarkLazyVault"></span>
      </label>
      <label className="checklistTurnVault">Turn-Vault<input type="checkbox" checked={turnVaultChecked} onChange={handleTurnVaultChange}/>
        <span className="checkmarkTurnVault"></span>
      </label>

      <label className="labelJumps">Jumping</label>
      <label className="checklistStanding">Standing<input type="checkbox" checked={standingChecked} onChange={handleStandingChange}/>
        <span className="checkmarkStanding"></span>
      </label>
      <label className="checklistStride">Stride<input type="checkbox" checked={strideChecked} onChange={handleStrideChange}/>
        <span className="checkmarkStride"></span>
      </label>
      <label className="checklistPlyo">Plyo<input type="checkbox" checked={plyoChecked} onChange={handlePlyoChange}/>
        <span className="checkmarkPlyo"></span>
      </label>

      <label className="labelClimbs">Climbing</label>
      <label className="checklistHipCatch">Hip-catch<input type="checkbox" checked={hipCatchChecked} onChange={handleHipCatchChange}/>
        <span className="checkmarkHipCatch"></span>
      </label>
      <label className="checklistClimbDown">Climb-down<input type="checkbox" checked={climbDownChecked} onChange={handleClimbDownChange}/>
        <span className="checkmarkClimbDown"></span>
      </label>
      <label className="checklistDashDown">Dash-down<input type="checkbox" checked={dashDownChecked} onChange={handleDashDownChange}/>
        <span className="checkmarkDashDown"></span>
      </label>

      <label className="labelSwings">Swinging</label>
      
      <label className="checklistReGrip">Re-grip<input type="checkbox" checked={reGripChecked} onChange={handleReGripChange}/>
        <span className="checkmarkReGrip"></span>
      </label>
      <label className="checklistDismount">Dismount<input type="checkbox" checked={dismountChecked} onChange={handleDismountChange}/>
        <span className="checkmarkDismount"></span>
      </label>
      <label className="checklistLache">Lache<input type="checkbox" checked={lacheChecked} onChange={handleLacheChange}/>
        <span className="checkmarkLache"></span>
      </label>
    
      <label className="labelLandings">Landing</label>
      <label className="checklistForwards">Forwards<input type="checkbox" checked={forwardsChecked} onChange={handleForwardsChange}/>
        <span className="checkmarkForwards"></span>
      </label>
      <label className="checklistBackwards">Backwards<input type="checkbox" checked={backwardsChecked} onChange={handleBackwardsChange}/>
        <span className="checkmarkBackwards"></span>
      </label>
      <label className="checklistSideways">Sideways<input type="checkbox" checked={sidewaysChecked} onChange={handleSidewaysChange}/>
        <span className="checkmarkSideways"></span>
      </label>

      <label className="labelCoachTips" id="CoachTips">Coach Tips</label>


    </div> 


    
  
    );
};

export default UserLevelPage;
