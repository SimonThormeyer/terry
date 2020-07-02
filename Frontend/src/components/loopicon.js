import React, { useState, useCallback, useEffect } from 'react';
import { useGlobalState } from "../GlobalState"
import { ReactComponent as PauseIcon } from '../img/pause.svg';
import { ReactComponent as PlayIcon } from '../img/play.svg';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { ReactComponent as MuteIcon } from '../img/mute.svg';
import { ReactComponent as VolumeIcon } from '../img/volume.svg';


function Loopicon({ id, muted }) {

  //globale State
  const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');
  const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState('activeHelpDialogue');

  //local state to toogle icons
  const [play, setPlay] = useState(true);
  const [mute, setMute] = useState(false);



  //pause progress ring animation
  const animationPause = useCallback(
    () => {
      var progressRingCircleAnimationPause = document.getElementById(`loop_${id}`).getElementsByClassName("progress-ring__circle")[0];
      progressRingCircleAnimationPause.style.webkitAnimationPlayState = "paused";
    }, [id])

  //after pause run progress ring animation again
  const animationRun = () => {
    var progressRingCircleRun = document.getElementById(`loop_${id}`).getElementsByClassName("progress-ring__circle")[0];
    progressRingCircleRun.style.webkitAnimationPlayState = "running";
  }

  //if the loop is muted the icon is transparent
  const muteLook = useCallback(
    () => {
      var loopId = document.getElementById(`loop_${id}`).getElementsByClassName("progress-ring")[0];
      loopId.style.opacity = 0.6;

    }, [id])

  //if the loop is not muted the icon is not transparent
  const unmuteLook = useCallback(
    () => {
      var loopId = document.getElementById(`loop_${id}`).getElementsByClassName("progress-ring")[0];
      loopId.style.opacity = 1;
    }, [id])


  //slides the loopicons if the user deletes one 
  const slide = () => {
    var loopId = document.getElementById(`loop_${id}`);
    var loopClass = document.getElementsByClassName("loop");
    if (loopId.nextElementSibling) {
      loopId.nextElementSibling.style.animation = "slide 0.6s ease";
    }
    loopId.style.opacity = 0;
    Array.from(loopClass).forEach(loopElement => {
      Array.from(loopElement.getElementsByTagName("li")).forEach(li => {
        li.style.visibility = "hidden"
      });
    });
  }

  //reset the slideanimation 
  const slideFinished = () => {
    var loopId = document.getElementById(`loop_${id}`);
    var loopClass = document.getElementsByClassName("loop");
    if (loopId.nextElementSibling) {
      loopId.nextElementSibling.style.animation = "none";
    }
    Array.from(loopClass).forEach(loopElement => {
      Array.from(loopElement.getElementsByTagName("li")).forEach(li => {
        li.style.visibility = "visible"
      });
    });
  }

  //get the duration from the runningloopers to set the progress ring animation time 
  if (runningLoopers.size > 0) {
    var duration = runningLoopers.get(id).duration / 1000;
    var animation = {
      animation: 'countdown ' + duration + 's linear infinite forwards'
    };
  };

  // after first render, set up according to state of looper
  useEffect(() => {
    let looperIsStopped = runningLoopers.get(id).stopped;
    let looperIsMuted = runningLoopers.get(id).muted
    setPlay(!looperIsStopped)
    if (looperIsStopped) animationPause();
    setMute(looperIsMuted)
    if (looperIsMuted) muteLook();
    else unmuteLook();
  }, [id, runningLoopers, muted, animationPause, muteLook, unmuteLook])


  return (
    <span className="loop" id={`loop_${id}`}>
      <ul>
        <li className="loopPausePlay" key={`loopPause_${id}`} onClick={() => {
          setPlay(!play); if (activeHelpDialogue === "loopIcons") { setActiveHelpDialogue("soundBed") }
        }} >
          {play ?
            <PauseIcon title="pause loop" key={`loopPauseButton_${id}`} onClick={() => {
              runningLoopers.get(id).pause(); animationPause();
            }} /> :
            <PlayIcon title="play loop" key={`loopPlayButton_${id}`} onClick={() => {
              runningLoopers.get(id).play(); animationRun();
            }} />}
        </li>

        <li className="loopMute" key={`loopMute_${id}`} onClick={() => { setMute(!mute); if (activeHelpDialogue === "loopIcons") { setActiveHelpDialogue("soundBed") } }}>
          {mute ?
            <MuteIcon title="unmute loop" key={`loopMuteButton_${id}`} onClick={() => {
              runningLoopers.get(id).toggleMute();
              unmuteLook();
            }} /> :
            <VolumeIcon title="mute loop" key={`loopOnMuteButton_${id}`} onClick={() => {
              runningLoopers.get(id).toggleMute()
              muteLook();
            }} />
          }
        </li>
        {/*set Timeout 600ms because of waiting the fade out animation is done and delete after*/}
        <li className="loopDelete" key={`loopDelete_${id}`} onClick={() => {
          if (activeHelpDialogue === "loopIcons") { setActiveHelpDialogue("soundBed") };
          slide();
          setTimeout(() => {
            slideFinished();
            runningLoopers.get(id).stop()
            runningLoopers.delete(id);
            setRunningLoopers(new Map(runningLoopers));
          }, 600);
        }}><DeleteIcon title="delete loop" key={`loopDeleteButton_${id}`} />
        </li>

      </ul>
      <svg
        className="progress-ring" height="100%" width="100%">
        <circle className="progress-ring__circle"
          style={animation}
        />
      </svg>
    </span>
  );
}

export default Loopicon;



