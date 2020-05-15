import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React, { useState } from 'react';
// import Parent from "./Parent";
import {MusicCtrl} from '../components/toneJS/musicCtrl';

function App() {


  let musicCtrl = new MusicCtrl();

  const [coordinates, setCoordinates] = useState([]);

  //Callback that is passed to Canvas
  const triggerToneWithCoordinates = (dataFromCanvas) => {

    musicCtrl.triggerSynth(dataFromCanvas[0], dataFromCanvas[1]);
    setCoordinates(dataFromCanvas);
    console.log(`X: ${dataFromCanvas[0]}, Y: ${dataFromCanvas[1]}`);
  };


  return (
    <div className="App">
      <Menu />
      <Canvas updateInfoParent={triggerToneWithCoordinates} />
    </div>
  );
}

export default App;
