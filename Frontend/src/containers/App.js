import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import Loopcontrols from "./loopcontrols";


function App() {

  return (
    <div className="App">
      <Loopcontrols />
      <Canvas />
      <Menu />
    </div>
  );
}

export default App;
