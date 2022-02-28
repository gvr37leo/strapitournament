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
import {get, getHost} from './pages/utils'

function updateHTML(){
  ReactDOM.render()
}

get('homepage',{populate:'*'}).then((data => {
  window.homepagedata = data
  document.body.style = `background-attachment : fixed; background-position:center; background-size:cover; background-image:url('${getHost()+homepagedata.data.attributes.background.data.attributes.url}')`
  ReactDOM.render(
    <React.Fragment >
      <Router>
        <div style={{"display":"flex","flexDirection":"column","minHeight":"calc(100vh - 18px)"}}>
          <div><Header></Header></div>
          <div  className="container-fluid">
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
          </div>
        </div>
      </Router>
    </React.Fragment>,
    document.getElementById('root')
  );
}))




