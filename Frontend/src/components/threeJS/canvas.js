import React, {Component} from 'react';
import * as THREE from 'three';


class Canvas extends Component {
    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        // create a ref to store the DOM element
        this.state = {
            xyCoordinates: [0, 0]
        }
    }

    updateXYvalues = (value) => {
        this.setState({xyCoordinates: [value[0], value[1]]});
        this.props.updateInfoParent(this.state.xyCoordinates);
    };

    componentDidMount() {
        const width = this.mount.clientWidth;
        const height = this.mount.clientHeight;

        let handleMouseClick = onMouseClick.bind(this);

        //ADD SCENE
        var scene = new THREE.Scene();

        //ADD CAMERA
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


        //ADD RENDERER
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.mount.appendChild(renderer.domElement);

        //ADD CUBE
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        var cube = new THREE.Mesh(geometry, material);
        scene.add(cube);


        let mouse = new THREE.Vector2();

        let raycaster = new THREE.Raycaster();

        //CLICK FUNCTION ON CANVAS
        function onMouseClick(event) {
            event.preventDefault();
            // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
            mouse.x = event.clientX / window.innerWidth;
            mouse.y = event.clientY / window.innerHeight;

            this.updateXYvalues([mouse.x, mouse.y]);
        }

        this.mount.addEventListener('click', handleMouseClick, false);

        camera.position.z = 5;
        var animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        };
        animate();
    }
//==================================================
    render() {
        return (
            <div style={{width: 'window.innerWidth', height: 'window.innerHeight'}}
                 ref={ref => {
                     this.mount = ref
                 }}
            />
        )
    }


}

export default Canvas;