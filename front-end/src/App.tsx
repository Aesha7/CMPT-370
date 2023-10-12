import React from 'react';
import './App.css';
//import './styles/tailwind.css'
import HomePage from './pages/HomePage.jsx';
import AccountCreatePage from './pages/AccountCreatePage';
import ViewAccountPage from './pages/ViewAccountPage'

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {  } from 'react-router'


function App() {
  return (
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/create-account' element={<AccountCreatePage/>}/>
        <Route path='/my-account' element={<ViewAccountPage/>}/>
      </Routes>


    // <div className="App">

    //   <HomePage />

    // </div>

  );
}

export default App;
