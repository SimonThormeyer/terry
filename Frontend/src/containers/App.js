import Canvas from '../components/threeJS/canvas'
import Menu from '../components/menu'
import React, { useState, useMemo } from 'react';
import { MusicCtrl } from '../components/toneJS/musicCtrl';
import { Looper } from '../components/toneJS/Looper'


function App() {

  const [musicCtrlParams, setMusicCtrlParams] = useState({})
  const [looper, setLooper] = useState({
    isRecording: false,
    looper: undefined
  })

  ///temporary, until there is a real "loopers" component
  const [looperCount, setLooperCount] = useState(1);
  const [runningLoopers, setRunningLoopers] = useState(new Map());
  let loopersMap = runningLoopers;
  
  //only create a new MusicCtrl Object when parameters change that it depends on.
  let musicCtrl = useMemo(() => musicCtrlFactory(musicCtrlParams), [musicCtrlParams]);

  //returns a new MusicCtrl Object depending on the parameters
  function musicCtrlFactory(params) {
    return new MusicCtrl()
  }

  // Callback Functions for Menu ============
  const randomFunction = () => {
    console.log("app js random Function");
  }
  const loopFunction = (parameter) => {
    if (parameter === "start") {
      console.log("app js loop Function " + parameter);
      let looper = new Looper(Date.now(), musicCtrl);
      setLooper({
        isRecording: true,
        looper: looper
      })
    } else {
      console.log("app js loop Function " + parameter);
      looper.looper.stopRecording(Date.now());
      looper.looper.play();
      setLooperCount(looperCount + 1);
      loopersMap.set(looperCount, looper.looper);
      setRunningLoopers(loopersMap);
      setRunningLoopers(new Map(loopersMap));
      setLooper({
        isRecording: false,
        looper: undefined
      })
    }
  }
  const playFunction = () => {
    musicCtrl.startStopSoundbed()
    console.log("app js play Function");
  }
  const recordFunction = () => {
    console.log("app js record Function");
  }
  // ========================================

  //Callbacks for Canvas ====================
  const triggerToneWithCoordinates = (dataFromCanvas) => {
    musicCtrl.triggerSynth(dataFromCanvas[0], dataFromCanvas[1]);
    console.log(`X: ${dataFromCanvas[0]}, Y: ${dataFromCanvas[1]}`);
    if (looper.isRecording) {
      looper.looper.addEvents(
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
    if (looper.isRecording) {
      looper.looper.addEvents(eventArray);
    }
  }

  // ========================================


  return (
    <div className="App">
      {Array.from(loopersMap.keys()).map((id) => {
        return (
          <button key={`loopStopButton_${id}`} onClick={() => {
            loopersMap.get(id).stop()
            loopersMap.delete(id);
            setRunningLoopers(new Map(loopersMap));
          }}>Stop Looper {id}</button>
        )
      })}
      <Canvas updateInfoParent={triggerToneWithCoordinates} recordMouseMovement={recordMouseMovement} />
      <Menu randomFunction={randomFunction} loopFunction={loopFunction} playFunction={playFunction} recordFunction={recordFunction} />
    </div>
  );
}

export default App;
