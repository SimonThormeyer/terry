import React, { Component } from 'react';



import { ReactComponent as RandomIcon } from '../img/random.svg';
import { ReactComponent as LooperIcon } from '../img/looper.svg';
import { ReactComponent as PlayIcon } from '../img/play.svg';
import { ReactComponent as RecordIcon } from '../img/record.svg';
import { ReactComponent as PauseIcon } from '../img/pause.svg';
import { ReactComponent as StopIcon } from '../img/stop.svg';







class Menu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            play: true,
            loop: true,
            random: true,
            record: true
        };
    

    }
   

    loopFunction(){
        console.log("Looper")
        this.props.functionCallFromParent("hello from child1");
    }

    randomFunction() {
        console.log("randomfunction")
        this.props.functionCallFromParent("hello from child1");
    }

    recordFunction() {
        console.log("recordfunction")
        this.props.functionCallFromParent("hello from child1");
    }

    playFunction() {
        console.log("playfunction")
        this.props.functionCallFromParent("hello from child1");
    }

    handleClick(stateID) {
        this.setState(prevState => ({
            [stateID]: !this.state[stateID],
        }));
    }


   


// FUNKTIONSFUNKTIONEN FEHLEN NOCH!
    render() {
        return (
            <ul id="buttonList">
                <li id="playbutton" onClick={() => { this.handleClick("play"); this.playFunction()}}>
                    {this.state.play ?
                        <PlayIcon /> :
                        <PauseIcon />}
                </li>
                <li id="randombutton" onClick={() => { this.handleClick("random"); this.randomFunction() }}>
                    {this.state.random ?
                        <RandomIcon /> :
                        <PauseIcon />}
                </li>
                <li id="loopbutton" onClick={() => { this.handleClick("loop"); this.loopFunction() }}>
                    {this.state.loop ?
                        <LooperIcon /> :
                        <StopIcon />}
                </li>
                <li id="recordbutton" onClick={() => { this.handleClick("record"); this.recordFunction() }}>
                    {this.state.record ?
                        <RecordIcon /> :
                        <StopIcon />}
                </li>
            </ul>
        );
    }
}



export default Menu;