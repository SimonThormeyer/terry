import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import SaveProjectButton from "../components/SaveProjectButton"
import Loopcontrols from "./loopcontrols";
import SideMenu from '../components/sidemenu';


function App() {
  

  return (
    <div className="App">
      <SideMenu />
      {/*<SaveProjectButton />*/}
      <Loopcontrols/>
      <Canvas />
      <Menu />
    </div>
  );
}

export default App;
