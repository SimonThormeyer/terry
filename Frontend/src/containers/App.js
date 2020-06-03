import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import SaveProjectButton from "../components/SaveProjectButton"
import Loopcontrols from "./loopcontrols";


function App() {
  

  return (
    <div className="App">
      <SaveProjectButton/>
      <Loopcontrols/>
      <Canvas />
      <Menu />
    </div>
  );
}

export default App;
