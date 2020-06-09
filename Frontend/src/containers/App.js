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


// <button onClick={CallCanvasState}>click </button>
  return (
    <div className="App">
      <Loopcontrols />
      <Canvas />
      <Menu />
    </div>
  );
}

export default App;
