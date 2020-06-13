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
      <HelpDialogue/>
      <SideMenu />
      <Loopcontrols />
      <Canvas />
      <Menu />
      <StartOverlay />
    </div>
  );
}

export default App;
