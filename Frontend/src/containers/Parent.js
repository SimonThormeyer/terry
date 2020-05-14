import React, {Component} from "react";
import Menu from "../components/menu";
import Canvas from "../components/threeJS/canvas";
import {Synth} from '../components/toneJS/synth';


class Parent extends Component {
    synth;

    constructor(props) {
        super(props);
        this.synth = new Synth();
        this.updateXYCoordinates = this.updateXYCoordinates.bind(this);
        this.state = {
            xyCoordinates: []
        }
    }

    updateXYCoordinates = (dataFromCanvas) => {
        this.synth.trigger("C4", "1n");
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