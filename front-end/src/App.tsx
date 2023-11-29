import React from 'react';
import './App.css';
//import './styles/tailwind.css'
import LoginPage from './pages/LoginPage.jsx';
import AccountCreatePage from './pages/AccountCreatePage';
import ViewAccountPage from './pages/ViewAccountPage'
import ViewFamilySchedule from './pages/ViewFamilySchedule';
import AdminCalendarPage from './pages/AdminCalendarPage';
import WaiverPDF from './pages/WaiverPDF';
import GymSchedule from './pages/GymSchedule';
import AdminManageAccountsPage from './pages/AdminManageAccountsPage';
import LandingPage from './pages/LandingPage';
import CoachCalendarPage from './pages/CoachCalendarPage';
import HomePage from './pages/HomePage';
import UserLevelPage from './pages/UserLevelPage';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {  } from 'react-router'




function App() {
  return (
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        {/* <Route path='/login' element={<LoginPage/>}/> */}
        <Route path='/create-account' element={<AccountCreatePage/>}/>
        <Route path='/my-account' element={<ViewAccountPage/>}/>
        <Route path='/family-schedule' element={<ViewFamilySchedule/>}/>
        <Route path='/admin-schedule' element={<AdminCalendarPage/>}/>
        <Route path='/gym-schedule' element={<GymSchedule/>}/>
        <Route path='/class-registration' element={<GymSchedule/>}/>
        <Route path='/admin-accounts' element={<AdminManageAccountsPage/>}/>
        <Route path='/waiver-form' element={<WaiverPDF/>}/>
        <Route path='/coach-schedule' element={<CoachCalendarPage/>}/>
        <Route path='/user-level' element={<UserLevelPage/>}/>
      </Routes>
  );
}



export default App;
