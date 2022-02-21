import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Header from './components/header'
import Tournament from './pages/tournament'
import Tournaments from './pages/tournaments'
import Leaderboard from './pages/leaderboard'
import Profile from './pages/profile'
import Webpage from './pages/webpage'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Homepage from './pages/homepage';

ReactDOM.render(
    <div>
     
      <Router>
        <Header></Header>
        <Routes>
          <Route exact path="/" element={<Homepage></Homepage>}>
          </Route>
          <Route path="/tournament/:id" element={<Tournament></Tournament>}>
          </Route>
          <Route path="/tournament" element={<Tournaments></Tournaments>}>
          </Route>
          <Route path="/leaderboard" element={<Leaderboard></Leaderboard>}>
          </Route>
          <Route path="/profile/:id" element={<Profile></Profile>}>
          </Route>
          <Route path="/webpage/:id" element={<Webpage></Webpage>}>
          </Route>
        </Routes>
      </Router>
    </div>,
  document.getElementById('root')
);


