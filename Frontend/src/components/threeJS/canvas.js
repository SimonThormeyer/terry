import React, {Component} from 'react';
import * as THREE from 'three';


class Canvas extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
            xyCoordinates: [0, 0]
        }
    }
    updateXYvalues=(value)=>{
        this.setState({xyCoordinates: [value[0], value[1]]});
        this.props.updateInfoParent(this.state.xyCoordinates);
    };

    componentDidMount() {
        let handleMouseClick = onMouseClick.bind(this);

        var scene = new THREE.Scene();
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        var renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        // use ref as a mount point of the Three.js scene instead of the document.body
        this.mount.appendChild(renderer.domElement);
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});

        let mouse = new THREE.Vector2();

        function onMouseClick(event) {

            // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
            mouse.x = event.clientX / window.innerWidth; 
            mouse.y = event.clientY / window.innerHeight; 
            this.updateXYvalues([mouse.x,mouse.y]);
            



        }

        window.addEventListener('click', handleMouseClick, false);

        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;
        var animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }

    render() {
        return (
            <div ref={ref => (this.mount = ref)}/>
        )
    }


}

export default Canvas;