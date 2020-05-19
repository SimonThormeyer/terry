import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import { useGlobalState } from "../GlobalState"


function App() {

  const [listeningLooper,] = useGlobalState('listeningLooper')
  const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');
  const [musicCtrl,] = useGlobalState('musicCtrl');

  // ==================== Callbacks for Canvas (could be transferred to Canvas using GlobalState) 
  const triggerToneWithCoordinates = (dataFromCanvas) => {
    musicCtrl.triggerSynth(dataFromCanvas[0], dataFromCanvas[1]);
    console.log(`X: ${dataFromCanvas[0]}, Y: ${dataFromCanvas[1]}`);
    if (listeningLooper) { //if there is a looper currently recording actions
      listeningLooper.addEvents(
        {
          timestamp: Date.now(),
          type: "canvasClick",
          x: dataFromCanvas[0],
          y: dataFromCanvas[1]
        }
      )
    }
  };

  const recordMouseMovement = (eventArray) => {
    if (listeningLooper) { //if there is a looper currently recording actions
      listeningLooper.addEvents(eventArray);
    }
  }
  // ======================================== (End callbacks canvas)


  return (
    <div className="App">
      {/* This should be part of some Looper-Controls-Component in the future (=> Luca) */}
      {Array.from(runningLoopers.keys()).map((id) => {
        // iterate over elements in runningLoopers and create a button for each
        return (
          <button key={`loopStopButton_${id}`} onClick={() => {
            runningLoopers.get(id).stop()
            runningLoopers.delete(id);
            setRunningLoopers(new Map(runningLoopers));
          }}>Stop Looper {id}</button>
        )
      })}
      {/* End of Looper-Controls */}
      <Canvas id={"canvas"} updateInfoParent={triggerToneWithCoordinates} recordMouseMovement={recordMouseMovement} />
      <Menu/>
    </div>
  );
}

export default App;
