import Canvas from '../components/threeJS/Canvas';
import Menu from '../components/menu'
import React from 'react';
import Loopcontrols from "./loopcontrols";
import SideMenu from '../components/sidemenu';
import MultitrackNav from '../components/multitracknav';
import StartOverlay from '../components/startoverlay';
import HelpDialogue from '../components/helpDialogue';


function App() {

  return (
    <div className="App">
      <SideMenu />
      <MultitrackNav />
      <Loopcontrols />
      <Canvas className='Canvas'/>
      <Menu />
      <StartOverlay />
      <HelpDialogue />
    </div>
  );
}

export default App;
