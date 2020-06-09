import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import Loopcontrols from "./loopcontrols";
import { useGlobalState } from "../GlobalState.js"


function App() {

  const [globalFunctions] = useGlobalState('globalFunctions');
  const CallCanvasState = () => {
    if (globalFunctions.getCanvasState instanceof Function) {
      console.log(
        globalFunctions.getCanvasState());
    }
  }



  return (
    <div className="App">
      <button onClick={CallCanvasState}>click </button>
      <Loopcontrols />
      <Canvas />
      <Menu />
    </div>
  );
}

export default App;
