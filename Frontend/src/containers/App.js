import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import Loopcontrols from "./loopcontrols";
import SideMenu from '../components/sidemenu';
import MultitrackNav from '../components/multitracknav';



function App() {

  return (
    <div className="App">
      <SideMenu />
      <MultitrackNav />
      <Loopcontrols />
      <Canvas />
      <Menu />
    </div>
  );
}

export default App;
