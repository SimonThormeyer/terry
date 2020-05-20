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
        const lightBlobs = [];

        let handleMouseClick = onMouseClick.bind(this);

        //ADD SCENE
        var scene = new THREE.Scene();

        //ADD CAMERA
        var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 20;

        //LIGHT
        let ambient = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambient);

        //ADD RENDERER
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        this.mount.appendChild(renderer.domElement);

        //ADD SPHERE
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshPhongMaterial({color: 0x808080, dithering: true});
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, 0);
        scene.add(cube);

        //MOVING LIGHT BLOB
        let groupBlobs = new THREE.Group();
        let light = new THREE.PointLight(0xFFFFFF, 0.0, 6000);
        light.position.set(0, 0, 0);
        light.castShadow = true;
        groupBlobs.add(light);
        lightBlobs.push(light);


        scene.add(groupBlobs);
        //BACKGROUND
        var materialBackground = new THREE.MeshPhongMaterial({color: 0x9EC2E3, dithering: true});
        let plane = new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight);
        let background = new THREE.Mesh(plane, materialBackground);
        background.position.set(0, -5, -1);
        background.receiveShadow = true;
        scene.add(background);

        //SPOT LIGHT
        let spotLight = new THREE.SpotLight(0x8E2057, 0.5);
        spotLight.position.set(20, 0, 50);
        spotLight.angle = Math.PI / 4;
        spotLight.penumbra = 0.05;
        spotLight.decay = 2;
        spotLight.distance = 200;

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 200;
        scene.add(spotLight);


        let mouse = new THREE.Vector2();

        let raycaster = new THREE.Raycaster();

        //CLICK FUNCTION ON CANVAS
        function onMouseClick(event) {
            event.preventDefault();
            // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1=
            this.updateXYvalues([event.clientX / window.innerWidth, event.clientY / window.innerHeight]);


            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            let toIntersect = [background];
            var intersections = raycaster.intersectObjects(toIntersect);

            light.position.x = intersections[0].point.x;
            light.position.y = intersections[0].point.y;
            light.intensity = 0.7;

        }

        this.mount.addEventListener('click', handleMouseClick, false);


        var animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            if (light.intensity > 0) {
                light.intensity -= 0.03;
            }


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