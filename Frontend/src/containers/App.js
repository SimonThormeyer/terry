import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import { useGlobalState } from "../GlobalState"


function App() {

  //can be reomved as soon as there is a 'loopers control' component (see below, used to be able to stop the loopers and create corresponding buttons)
  const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');

  // can be removed as soon as canvas doesn't need callbacks anymore
  const [musicCtrl,] = useGlobalState('musicCtrl');
  const [listeningLooper,] = useGlobalState('listeningLooper')

  // ==================== Callbacks for Canvas (can be transferred to Canvas as soon as it is able to use GlobalState) 
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
      {/* This should be part of some "Looper-Controls-Component" in the future (=> Luca) */}
      {Array.from(runningLoopers.keys()).map((id) => {
        // iterate over elements in runningLoopers and create a button for each
        return (
          <>
            <button key={`loopStopButton_${id}`} onClick={() => {
              runningLoopers.get(id).stop()
              runningLoopers.delete(id);
              setRunningLoopers(new Map(runningLoopers));
            }}>X Looper {id}</button>
            <button key={`loopMuteButton_${id}`} onClick={() => {
              runningLoopers.get(id).toggleMute()
            }}>M Looper {id}</button>
            <button key={`loopPauseButton_${id}`} onClick={() => {
              runningLoopers.get(id).pause()
            }}>|| Looper {id}</button>
            <button key={`loopPlayButton_${id}`} onClick={() => {
              runningLoopers.get(id).play()
            }}>>> Looper {id}</button>
          </>
        )
      })}
      {/* End of "Looper-Controls" */}
      <Canvas updateInfoParent={triggerToneWithCoordinates} recordMouseMovement={recordMouseMovement} />
      <Menu />
    </div>
  );
}

export default App;
