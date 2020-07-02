import Canvas from '../components/threeJS/canvas';
import Menu from '../components/menu'
import React from 'react';
import Loopcontrols from "./loopcontrols";
import SideMenu from '../components/sidemenu';
import MultitrackNav from '../components/multitracknav';
import StartOverlay from '../components/startoverlay';
import HelpDialogue from '../components/helpDialogue';


function App() {

  let landscapeMode = () => { 
    let height = window.innerHeight;
    let width = window.innerWidth;
    if (width <= height) {
      alert("Mach Landscape Modus!")
    }
  }
  
window.addEventListener('resize', landscapeMode);

  return (
    <div className="App">
      <MultitrackNav />
      <Loopcontrols />
      <Canvas className='Canvas' />
      <Menu />
      <HelpDialogue />
      <SideMenu />
      <StartOverlay />
    </div>
  );
}

export default App;
