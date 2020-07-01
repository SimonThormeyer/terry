import Canvas from '../components/threeJS/canvas';
import Menu from '../components/menu'
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Loopcontrols from "./loopcontrols";
import SideMenu from '../components/sidemenu';
import MultitrackNav from '../components/multitracknav';
import StartOverlay from '../components/startoverlay';
import HelpDialogue from '../components/helpDialogue';
import OpenProjectsContainer from '../containers/OpenProjectsContainer';


function App() {

  return (
    <div className="App">
      <Router>
        <MultitrackNav />
        <Loopcontrols />
        <SideMenu />
        <HelpDialogue />
        <Canvas className='Canvas' />
        <Menu />
        <Routes>
          <Route path="projects" element={<OpenProjectsContainer />} />
          <Route path="projects/:user" element={<OpenProjectsContainer />} />
          <Route path="projects/:user/:projectName" element={<OpenProjectsContainer />} />
        </Routes>
        <StartOverlay />
      </Router>
    </div>
  );
}

export default App;
