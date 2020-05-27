import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React from 'react';
import { useGlobalState } from "../GlobalState"


function App() {

  //can be reomved as soon as there is a 'loopers control' component (see below, used to be able to stop the loopers and create corresponding buttons)
  const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');

  return (
    <div className="App">
      {/* This should be part of some "Looper-Controls-Component" in the future (=> Luca) */}
      {Array.from(runningLoopers.keys()).map((id) => {
        // iterate over elements in runningLoopers and create a button for each
        return (
          <div key={`loopcontrolContainer__${id}`}>
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
          </div>
        )
      })}
      {/* End of "Looper-Controls" */}
      <Canvas />
      <Menu />
    </div>
  );
}

export default App;
