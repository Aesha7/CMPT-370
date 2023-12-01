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
  let coachName = location.state.coachName;

  // prevents refresh on useEffect
  let checklistBool = false;

  console.log(studentID, isCoach, coachID, coachName);

  const get_user_info = () => {
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

          setAccount(data);

          data.users.forEach((subUser) => {
            // console.log(user._id, studentID)
            if (subUser._id["$oid"] == studentID) {
              setUserName(subUser.name);
              user = subUser;
            }
          });

          if(!checklistBool){
            get_skill_checklist()
            checklistBool = !checklistBool
          }

          if (isCoach) {
            // checkboxes enabled (and save button)...
            unlock_checkbox();
          } else {
            // checkboxes disabled...
            lock_checkbox();
          }
        });
    } catch (error) {
      console.log(error);
    }
  };

  const saveChecks = () =>{
    console.log(coachID, account)

    let skillDict = {
      "Step-Vault": stepVaultChecked,
      "Lazy-Vault": lazyVaultChecked,
      "Turn-Vault": turnVaultChecked,
      "Standing": standingChecked,
      "Stride": strideChecked,
      "Plyo": plyoChecked,
      "Hip-Catch": hipCatchChecked,
      "Climb-Down":climbDownChecked,
      "Dash-Down":dashDownChecked,
      "Re-Grip": reGripChecked,
      "Dismount": dismountChecked,
      "Lache":lacheChecked,
      "Forwards": forwardsChecked,
      "Backwards": backwardsChecked,
      "Sideways": sidewaysChecked
    }

    let checked = [];
    let unchecked = [];

    Object.keys(skillDict).forEach((skill) => {
      if(skillDict[skill] == true){
        checked.push(skill)
      }
      else{
        unchecked.push(skill)
      }
    })

    console.log(checked, unchecked)


    try{
      fetch(server_URL + "check_uncheck_skills", {
        method: "POST",
        body: JSON.stringify({
           _id: coachID,
           check_list: checked,
           uncheck_list: unchecked,
           email: account.email,
           user_name: userName
         }),
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
          console.log(text)
          if(text == "\"Error: you do not have permission to perform this action\""){
            alert("You do not have permission to perform this action.")
          }
          else if(text == '"Error: account not found"'){
            alert("Account not found.")
          }
          else if(text == '"Error: admin account not found"'){
            alert("Coach account not found.")
          }
          else{
            alert("Skills saved.")
          }
        })
    }catch(exception){
      console.log(exception)
    }
  }

  const get_skill_checklist = () => {
    console.log(user);
    let skillCategories = [
      "Jumping",
      "Vaulting",
      "Climbing",
      "Swinging",
      "Landing",
    ];

    skillCategories.forEach((category) => {
      user.skills[category].forEach((skill) => {
        // , ", "Lache", "Forwards", "Backwards", "Sideways"

        document.getElementById(skill.name).checked = skill.checked;
        switch (skill.name) {
          case "Step-Vault":
            setStepVaultChecked(skill.checked);
            break;
          case "Lazy-Vault":
            setLazyVaultChecked(skill.checked);
            break;
          case "Turn-Vault":
            setTurnVaultChecked(skill.checked);
            break;
          case "Standing":
            setStandingChecked(skill.checked);
            break;
          case "Stride":
            setStrideChecked(skill.checked);
            break;
          case "Plyo":
            setPlyoChecked(skill.checked);
            break;
          case "Hip-Catch":
            setHipCatchChecked(skill.checked);
            break;
          case "Climb-Down":
            setClimbDownChecked(skill.checked);
            break;
          case "Dash-Down":
            setDashDownChecked(skill.checked);
            break;
          case "Re-Grip":
            setReGripChecked(skill.checked);
            break;
          case "Dismount":
            setDismountChecked(skill.checked);
            break;
          case "Lache":
            setLacheChecked(skill.checked);
            break;
          case "Forwards":
            setForwardsChecked(skill.checked);
            break;
          case "Backwards":
            setBackwardsChecked(skill.checked);
            break;
          case "Sideways":
            setSidewaysChecked(skill.checked);
            break;
        }
      });
    });
  };


  // updating the skill checklist

  useEffect(() => {
    // get_account_info();
    get_user_info();
  }, []);

  const navigate = useNavigate();

  const goBack = () => {
    if (!isCoach) {
      let path = "/my-account";
      navigate(path, { state: userID });
    } else {
      let path = "/coach-schedule";
      navigate(path, { state: { userID: coachID, coachName: coachName } });
    }
  };

  const lock_checkbox = () => {
    document.getElementById("checkboxSave").style.visibility = "hidden";
    document.getElementById("Step-Vault").disabled = true;
    document.getElementById("Lazy-Vault").disabled = true;
    document.getElementById("Turn-Vault").disabled = true;
    document.getElementById("Standing").disabled = true;
    document.getElementById("Stride").disabled = true;
    document.getElementById("Plyo").disabled = true;
    document.getElementById("Hip-Catch").disabled = true;
    document.getElementById("Climb-Down").disabled = true;
    document.getElementById("Dash-Down").disabled = true;
    document.getElementById("Re-Grip").disabled = true;
    document.getElementById("Dismount").disabled = true;
    document.getElementById("Lache").disabled = true;
    document.getElementById("Forwards").disabled = true;
    document.getElementById("Backwards").disabled = true;
    document.getElementById("Sideways").disabled = true;
  };
  const unlock_checkbox = () => {
    document.getElementById("checkboxSave").style.visibility = "visible";
    document.getElementById("Step-Vault").disabled = false;
    document.getElementById("Lazy-Vault").disabled = false;
    document.getElementById("Turn-Vault").disabled = false;
    document.getElementById("Standing").disabled = false;
    document.getElementById("Stride").disabled = false;
    document.getElementById("Plyo").disabled = false;
    document.getElementById("Hip-Catch").disabled = false;
    document.getElementById("Climb-Down").disabled = false;
    document.getElementById("Dash-Down").disabled = false;
    document.getElementById("Re-Grip").disabled = false;
    document.getElementById("Dismount").disabled = false;
    document.getElementById("Lache").disabled = false;
    document.getElementById("Forwards").disabled = false;
    document.getElementById("Backwards").disabled = false;
    document.getElementById("Sideways").disabled = false;
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

  const editSkills = (e) => {};

  return (
    // <h1>test</h1>
    <div className="user-level-page">
      {" "}
      My Progression
      {/* // Member name labels at top of page */}
      <label className="labelBackground"> MY PROGRESSION</label>
      <label className="NLabel" htmlFor="name">
        Name:{" "}
      </label>
      <label className="Name" htmlFor="name" type="name" id="name">
        {userName}
      </label>
      {/* buttons on the page */}
      <button className="buttonBackLevel" onClick={goBack}>
        {" "}
        Back{" "}
      </button>
      <button className="buttonSave" id="checkboxSave" onClick={saveChecks}>
        {" "}
        Save{" "}
      </button>
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
          id="Step-Vault"
        />
        <span className="checkmarkStepVault"></span>
      </label>
      <label className="checklistLazyVault">
        Lazy-Vault
        <input
          type="checkbox"
          checked={lazyVaultChecked}
          onChange={handleLazyVaultChange}
          id="Lazy-Vault"
        />
        <span className="checkmarkLazyVault"></span>
      </label>
      <label className="checklistTurnVault">
        Turn-Vault
        <input
          type="checkbox"
          checked={turnVaultChecked}
          onChange={handleTurnVaultChange}
          id="Turn-Vault"
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
          id="Standing"
        />
        <span className="checkmarkStanding"></span>
      </label>
      <label className="checklistStride">
        Stride
        <input
          type="checkbox"
          checked={strideChecked}
          onChange={handleStrideChange}
          id="Stride"
        />
        <span className="checkmarkStride"></span>
      </label>
      <label className="checklistPlyo">
        Plyo
        <input
          type="checkbox"
          checked={plyoChecked}
          onChange={handlePlyoChange}
          id="Plyo"
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
          id="Hip-Catch"
        />
        <span className="checkmarkHipCatch"></span>
      </label>
      <label className="checklistClimbDown">
        Climb-down
        <input
          type="checkbox"
          checked={climbDownChecked}
          onChange={handleClimbDownChange}
          id="Climb-Down"
        />
        <span className="checkmarkClimbDown"></span>
      </label>
      <label className="checklistDashDown">
        Dash-down
        <input
          type="checkbox"
          checked={dashDownChecked}
          onChange={handleDashDownChange}
          id="Dash-Down"
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
          id="Re-Grip"
        />
        <span className="checkmarkReGrip"></span>
      </label>
      <label className="checklistDismount">
        Dismount
        <input
          type="checkbox"
          checked={dismountChecked}
          onChange={handleDismountChange}
          id="Dismount"
        />
        <span className="checkmarkDismount"></span>
      </label>
      <label className="checklistLache">
        Lache
        <input
          type="checkbox"
          checked={lacheChecked}
          onChange={handleLacheChange}
          id="Lache"
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
          id="Forwards"
        />
        <span className="checkmarkForwards"></span>
      </label>
      <label className="checklistBackwards">
        Backwards
        <input
          type="checkbox"
          checked={backwardsChecked}
          onChange={handleBackwardsChange}
          id="Backwards"
        />
        <span className="checkmarkBackwards"></span>
      </label>
      <label className="checklistSideways">
        Sideways
        <input
          type="checkbox"
          checked={sidewaysChecked}
          onChange={handleSidewaysChange}
          id="Sideways"
        />
        <span className="checkmarkSideways"></span>
      </label>
      {/* <label className="labelCoachTips">Coach Tips</label> */}
    </div>
  );
};

export default UserLevelPage;
