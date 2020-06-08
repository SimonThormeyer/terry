import React, { useState, useCallback } from 'react';
import { useGlobalState } from "../GlobalState"
import { ReactComponent as PauseIcon } from '../img/pause.svg';
import { ReactComponent as PlayIcon } from '../img/play.svg';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { ReactComponent as MuteIcon } from '../img/mute.svg';
import { ReactComponent as VolumeIcon } from '../img/volume.svg';
import UseEventListener from "./../UseEventListener"


function Loopicon({ id }) {

//globale State
  const [runningLoopers, setRunningLoopers] = useGlobalState('runningLoopers');

  //local state to toogle icons
  const [play, setPlay] = useState(true);
  const [mute, setMute] = useState(false);


  const handleKeyDown = useCallback(
    (event) => {
      // start/stop muting with Number Keys
      let keyNumber = event.keyCode - 48
      if (id < 10 && id === keyNumber) { 
        if (runningLoopers.get(keyNumber)) {
          runningLoopers.get(keyNumber).toggleMute();
          setMute(!mute);
        }
      }
    },
    [mute]
  );

  UseEventListener("keydown", handleKeyDown);

  //pause progress ring animation
  const animationPause = () => {
    var progressRingCircleAnimationPause = document.getElementById(`loop_${id}`).getElementsByClassName("progress-ring__circle")[0];
    progressRingCircleAnimationPause.style.webkitAnimationPlayState = "paused";
  }

  //after pause run progress ring animation again
  const animationRun = () => {
    var progressRingCircleRun = document.getElementById(`loop_${id}`).getElementsByClassName("progress-ring__circle")[0];
    progressRingCircleRun.style.webkitAnimationPlayState = "running";
  }

  //if the loop is muted the icon is transparent
  const muteLook = () => {
    var loopId = document.getElementById(`loop_${id}`).getElementsByClassName("progress-ring")[0];
    loopId.style.opacity = 0.6;
  }

  //if the loop is not muted the icon is not transparent
  const unmuteLook = () => {
    var loopId = document.getElementById(`loop_${id}`).getElementsByClassName("progress-ring")[0];
    loopId.style.opacity = 1;
  }

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


  return (
    <span className="loop" id={`loop_${id}`}>
      <ul>
        <li className="loopPausePlay" key={`loopPause_${id}`} onClick={() => {
          setPlay(!play)
        }} >
          {play ?
            <PauseIcon key={`loopPauseButton_${id}`} onClick={() => {
              runningLoopers.get(id).pause(); animationPause();
            }} /> :
            <PlayIcon key={`loopPlayButton_${id}`} onClick={() => {
              runningLoopers.get(id).play(); animationRun();
            }} />}
        </li>

        <li className="loopMute" key={`loopMute_${id}`} onClick={() => { setMute(!mute) }}>
          {mute ?
            <MuteIcon key={`loopMuteButton_${id}`} onClick={() => {
              runningLoopers.get(id).toggleMute();
              unmuteLook();
            }} /> :
            <VolumeIcon key={`loopOnMuteButton_${id}`} onClick={() => {
              runningLoopers.get(id).toggleMute()
              muteLook();
            }} />
          }
        </li>
        {/*set Timeout 600ms because of waiting the fade out animation is done and delete after*/}
        <li className="loopDelete" key={`loopDelete_${id}`} onClick={() => {
          slide();
          setTimeout(() => {
            slideFinished();
            runningLoopers.get(id).stop()
            runningLoopers.delete(id);
            setRunningLoopers(new Map(runningLoopers));
          }, 600);
        }}><DeleteIcon key={`loopDeleteButton_${id}`} />
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



