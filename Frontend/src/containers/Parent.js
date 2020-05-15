import React, {Component} from "react";
import Menu from "../components/menu";
import Canvas from "../components/threeJS/canvas";
import {MusicCtrl} from '../components/toneJS/musicCtrl';


class Parent extends Component {

    constructor(props) {
        super(props);
        this.musicCtrl = new MusicCtrl();
        this.updateXYCoordinates = this.updateXYCoordinates.bind(this);
        this.state = {
            xyCoordinates: []
        }
    }

    updateXYCoordinates = (dataFromCanvas) => {
        this.musicCtrl.triggerSynth(dataFromCanvas[0], dataFromCanvas[1]);
        console.log(dataFromCanvas[0], dataFromCanvas[1]);
        this.setState({xyCoordinates: dataFromCanvas});
    };

    render() {
        return (
            <div>
                <Menu/>
                <Canvas updateInfoParent={this.updateXYCoordinates}/>
            </div>
        );
    }
}

export default Parent;