import React from 'react';
import { ReactComponent as ArrowForward } from '../img/arrow_forward.svg';
import { ReactComponent as ArrowBack } from '../img/arrow_back.svg';


function MultitrackNav(props) {

    // Functions to be filled with functionality to switch canvas for multitracking

    const prevTrack = () => {
        console.log("switch to previous track");
    };

    const nextTrack = () => {
        console.log("switch to next track");
    };


    return (
            <div id="multitrackingNav">
                <ArrowBack id="arrowBack" onClick={() => { prevTrack() }}/>
                <span id="synthesizerName">synthesizerName</span>
                <ArrowForward id="arrowForward" onClick={() => { nextTrack() }}/>
            </div>
    );
};


export default MultitrackNav;