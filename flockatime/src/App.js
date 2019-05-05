import React from 'react';
import logo from './logo.svg';
import './App.css';

import authService from './utilities/auth';

import Navbar from './components/Navbar/navbar';
import Main from './components/Main/main';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Main />
    </div>
  );
}

export default App;

/* 
Components:

Navbar
  Navitem

Jumbotron

ChartContainer

ProgrammerTable
  ProgrammerRow

AuthModal
  AuthForm
  FacebookLogin

Button

*/