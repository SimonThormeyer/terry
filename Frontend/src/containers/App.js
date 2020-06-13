import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import Loopcontrols from "./loopcontrols";
import SideMenu from '../components/sidemenu';
import StartOverlay from '../components/startoverlay';
import HelpDialogue from '../components/helpDialogue';


function App() {

  return (
    <div className="App">
      <SideMenu />
      <Loopcontrols />
      <Canvas />
      <Menu />
      <StartOverlay />
      <HelpDialogue />
    </div>
  );
}

export default App;
