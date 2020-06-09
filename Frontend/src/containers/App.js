import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import Loopcontrols from "./loopcontrols";
import useLocalStorage from "../UseLocalStorage.js"


function App() {

    const getCanvasState = useLocalStorage('getCanvasState');
const CallCanvasState = ()=>{
    if (getCanvasState.current instanceof Function) {
        getCanvasState.current();
    }
}



  return (
    <div className="App">
        <button onClick={CallCanvasState}>click </button>
      <Loopcontrols/>
      <Canvas />
      <Menu />
    </div>
  );
}

export default App;
