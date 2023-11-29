import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import "../style/UserLevelPage.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const server_URL = "http://127.0.0.1:5000/"; //URL to access server

const UserLevelPage = () => {
  const location = useLocation();
  let [name, setName] = useState("John");

  let [userID, setUserID] = useState("");
  let [userName, setUserName] = useState("");
  let [user, setUser] = useState();
  let [account, setAccount] = useState();
  let studentID = location.state.studentID;
  // userName = location.state.curUserName;
  let isCoach = location.state.isCoach;
  let coachID = location.state.coachID;
  let coachName = location.state.coachName

  console.log(studentID, isCoach, coachID, coachName)


  const get_user_info = () =>{
    try {
      fetch(server_URL + "get_user_info", {
        method: "POST",
        body: JSON.stringify({ user_id: studentID }),
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

          setAccount(data)

          data.users.forEach((user) =>{
            // console.log(user._id, studentID)
            if(user._id["$oid"] == studentID){
              setUserName(user.name)

              console.log("USER", user)
              console.log(user.skills)
            }
          })


          // user = data;


          if (isCoach) {
            // checkboxes enabled (and save button)...
            unlock_checkbox()
          } else {
            // checkboxes disabled...
            lock_checkbox()
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

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

          // disabling buttons and checkboxes based on stafflevel

        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // get_account_info();
    get_user_info();
  }, []);

  const navigate = useNavigate();

  const goBack = () => {
    if(!isCoach){
      let path = "/my-account";
      navigate(path, { state: userID });
    } else{
      let path = "/coach-schedule"
      navigate(path, {state:{userID: coachID, coachName: coachName}});
    }
  };

  const lock_checkbox = () =>{
    document.getElementById("checkboxSave").style.visibility = "hidden"
    document.getElementById("step-vault").disabled = true
    document.getElementById("lazy-vault").disabled = true
    document.getElementById("turn-vault").disabled = true
    document.getElementById("standing").disabled = true
    document.getElementById("stride").disabled = true
    document.getElementById("plyo").disabled = true
    document.getElementById("hip-catch").disabled = true
    document.getElementById("climb-down").disabled = true
    document.getElementById("dash-down").disabled = true
    document.getElementById("re-grip").disabled = true
    document.getElementById("dismount").disabled = true
    document.getElementById("lache").disabled = true
    document.getElementById("forwards").disabled = true
    document.getElementById("backwards").disabled = true
    document.getElementById("sideways").disabled = true
  }

  const unlock_checkbox = () =>{
    document.getElementById("checkboxSave").style.visibility = "visible"
    document.getElementById("step-vault").disabled = false
    document.getElementById("lazy-vault").disabled = false
    document.getElementById("turn-vault").disabled = false
    document.getElementById("standing").disabled = false
    document.getElementById("stride").disabled = false
    document.getElementById("plyo").disabled = false
    document.getElementById("hip-catch").disabled = false
    document.getElementById("climb-down").disabled = false
    document.getElementById("dash-down").disabled = false
    document.getElementById("re-grip").disabled = false
    document.getElementById("dismount").disabled = false
    document.getElementById("lache").disabled = false
    document.getElementById("forwards").disabled = false
    document.getElementById("backwards").disabled = false
    document.getElementById("sideways").disabled = false
  }

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

  const editSkills = (e) => {};

  return (
    // <h1>test</h1>
    <div className="user-level-page"> My Progression
    
    {/* // Member name labels at top of page */}
      <label className="NLabel" htmlFor="name">Name:{" "}</label>
      <label className="Name" htmlFor="name" type="name" id="name">{userName}</label>
    
    {/* buttons on the page */}
      <button className="buttonBackLevel" onClick={goBack}> Back </button>
      <button className="buttonSave" id="checkboxSave" onClick={null}> Save </button>
      {/* <button className="buttonAddTip" onClick={null}> Add Tip </button> */}
    
    {/* Skill checkboxes */}
      <label className="labelSkills"> Skills</label>
      <label className="labelVaults">Vaulting</label>
      <label className="checklistStepVault">
        Step-Vault
        <input
          type="checkbox"
          checked={stepVaultChecked}
          onChange={handleStepVaultChange}
          id="step-vault"
        />
        <span className="checkmarkStepVault"></span>
      </label>
      <label className="checklistLazyVault">
        Lazy-Vault
        <input
          type="checkbox"
          checked={lazyVaultChecked}
          onChange={handleLazyVaultChange}
          id="lazy-vault"
        />
        <span className="checkmarkLazyVault"></span>
      </label>
      <label className="checklistTurnVault">
        Turn-Vault
        <input
          type="checkbox"
          checked={turnVaultChecked}
          onChange={handleTurnVaultChange}
          id="turn-vault"
        />
        <span className="checkmarkTurnVault"></span>
      </label>
      <label className="labelJumps">Jumping</label>
      <label className="checklistStanding">
        Standing
        <input
          type="checkbox"
          checked={standingChecked}
          onChange={handleStandingChange}
          id="standing"
        />
        <span className="checkmarkStanding"></span>
      </label>
      <label className="checklistStride">
        Stride
        <input
          type="checkbox"
          checked={strideChecked}
          onChange={handleStrideChange}
          id="stride"
        />
        <span className="checkmarkStride"></span>
      </label>
      <label className="checklistPlyo">
        Plyo
        <input
          type="checkbox"
          checked={plyoChecked}
          onChange={handlePlyoChange}
          id="plyo"
        />
        <span className="checkmarkPlyo"></span>
      </label>
      <label className="labelClimbs">Climbing</label>
      <label className="checklistHipCatch">
        Hip-catch
        <input
          type="checkbox"
          checked={hipCatchChecked}
          onChange={handleHipCatchChange}
          id="hip-catch"
        />
        <span className="checkmarkHipCatch"></span>
      </label>
      <label className="checklistClimbDown">
        Climb-down
        <input
          type="checkbox"
          checked={climbDownChecked}
          onChange={handleClimbDownChange}
          id="climb-down"
        />
        <span className="checkmarkClimbDown"></span>
      </label>
      <label className="checklistDashDown">
        Dash-down
        <input
          type="checkbox"
          checked={dashDownChecked}
          onChange={handleDashDownChange}
          id="dash-down"
        />
        <span className="checkmarkDashDown"></span>
      </label>
      <label className="labelSwings">Swinging</label>
      <label className="checklistReGrip">
        Re-grip
        <input
          type="checkbox"
          checked={reGripChecked}
          onChange={handleReGripChange}
          id="re-grip"
        />
        <span className="checkmarkReGrip"></span>
      </label>
      <label className="checklistDismount">
        Dismount
        <input
          type="checkbox"
          checked={dismountChecked}
          onChange={handleDismountChange}
          id="dismount"

        />
        <span className="checkmarkDismount"></span>
      </label>
      <label className="checklistLache">
        Lache
        <input
          type="checkbox"
          checked={lacheChecked}
          onChange={handleLacheChange}
          id="lache"
        />
        <span className="checkmarkLache"></span>
      </label>
      <label className="labelLandings">Landing</label>
      <label className="checklistForwards">
        Forwards
        <input
          type="checkbox"
          checked={forwardsChecked}
          onChange={handleForwardsChange}
          id="forwards"

        />
        <span className="checkmarkForwards"></span>
      </label>
      <label className="checklistBackwards">
        Backwards
        <input
          type="checkbox"
          checked={backwardsChecked}
          onChange={handleBackwardsChange}
          id="backwards"

        />
        <span className="checkmarkBackwards"></span>
      </label>
      <label className="checklistSideways">
        Sideways
        <input
          type="checkbox"
          checked={sidewaysChecked}
          onChange={handleSidewaysChange}
          id="sideways"

        />
        <span className="checkmarkSideways"></span>
      </label>

      {/* <label className="labelCoachTips">Coach Tips</label> */}


    </div> 


    
  
    );
};

export default UserLevelPage;
