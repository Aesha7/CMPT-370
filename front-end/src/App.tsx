import React from 'react';
import './App.css';
//import './styles/tailwind.css'
import HomePage from './pages/HomePage.jsx';
import AccountCreatePage from './pages/AccountCreatePage';
import ViewAccountPage from './pages/ViewAccountPage'
import ViewFamilySchedule from './pages/ViewFamilySchedule';
import AdminCalendarPage from './pages/AdminCalendarPage';
import WaiverPDF from './pages/WaiverPDF';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {  } from 'react-router'


function App() {
  return (
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/create-account' element={<AccountCreatePage/>}/>
        <Route path='/my-account' element={<ViewAccountPage/>}/>
        <Route path='/family-schedule' element={<ViewFamilySchedule/>}/>
        <Route path='/admin-schedule' element={<AdminCalendarPage/>}/>
        <Route path='/waiver-form' element={<WaiverPDF/>}/>

      </Routes>

  );
}

export default App;
