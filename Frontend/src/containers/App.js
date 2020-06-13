import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import Loopcontrols from "./loopcontrols";
import SideMenu from '../components/sidemenu';
import StartOverlay from '../components/startoverlay';


function App() {

  return (
    <div className="App">
      <SideMenu />
      <Loopcontrols />
      <Canvas />
      <Menu />
      <StartOverlay />
    </div>
  );
}

export default App;
