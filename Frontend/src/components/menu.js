import React from 'react';

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
   
//set State because of diffrent icons by click
    handleClick(stateID) {
        this.setState(prevState => ({
            [stateID]: !this.state[stateID],
        }));
    }


   
//HTML structure with handleClick that toggles and call musicfunctions
    render() {
        let loopFunctionParameter = this.state.loop ? "start" : "stop";
        return (
            <ul id="menu">
                <li id="playbutton" onClick={() => { this.handleClick("play"); this.props.playFunction(); }}>
                    {this.state.play ?
                        <PlayIcon /> :
                        <PauseIcon />}
                </li>
                <li id="randombutton" onClick={() => { this.handleClick("random"); this.props.randomFunction() }}>
                    {this.state.random ?
                        <RandomIcon /> :
                        <PauseIcon />}
                </li>
                <li id="loopbutton" onClick={() => { this.handleClick("loop"); this.props.loopFunction(loopFunctionParameter) }}>
                    {this.state.loop ?
                        <LooperIcon /> :
                        <StopIcon />}
                </li>
                <li id="recordbutton" onClick={() => { this.handleClick("record"); this.props.recordFunction() }}>
                    {this.state.record ?
                        <RecordIcon /> :
                        <StopIcon />}
                </li>
            </ul>
        );
    }
}



export default Menu;