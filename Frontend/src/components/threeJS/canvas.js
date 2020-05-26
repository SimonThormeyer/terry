import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {useGlobalState} from "../../GlobalState.js"

function Canvas(props) {

    const [musicCtrl,] = useGlobalState('musicCtrl');

    //  const canvasRef = useRef<HTMLCanvasElement>();
    const mount = useRef(null);
    const [size, setSize] = useState([0, 0]);
    const [xyCoordinates, setCoordinates] = useState(true)

    const canvasClick = (value) => {
        //  setCoordinates([value[0], value[1]]);
        musicCtrl.triggerSynth(value[0], value[1]);
    };

    // init globe
    useEffect(() => {
        // get current instances
        const width = mount.clientWidth;
        const height = mount.clientHeight;

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
        mount.current.appendChild(renderer.domElement);

        //FUTURE MOVING EFFEKT
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshPhongMaterial({color: 0x808080, dithering: true});
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, 0);
        scene.add(cube);

        //MOVING LIGHT BLOB ON CLICK
        let groupBlobs = new THREE.Group();
        let light = new THREE.PointLight(0xFFFFFF, 0.0, 6000);
        light.position.set(0, 0, 0);
        light.castShadow = true;
        groupBlobs.add(light);


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
            // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
            canvasClick([event.clientX / window.innerWidth, event.clientY / window.innerHeight]);


            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            let toIntersect = [background];
            var intersections = raycaster.intersectObjects(toIntersect);

            //Changing light position and brightness
            light.position.x = intersections[0].point.x;
            light.position.y = intersections[0].point.y;
            light.intensity = 0.7;

        }

        mount.current.addEventListener('click', handleMouseClick, false);

        //changing the light intensisty every x milliseconds
        function refreshLightIntensity() {
            let x = 3;  // 30 milliseconds

            if (light.intensity > 0.03) {
                light.intensity -= 0.03;
            }

            setTimeout(refreshLightIntensity, x * 10);
        }

        refreshLightIntensity();
        var animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            /** might be too often
             if (light.intensity > 0.003) {
                light.intensity -= 0.003;
            }
             **/
            renderer.render(scene, camera);
        };
        animate();


    }, [mount]);


    /**
     // update size
     useEffect(() => {
        const renderer = rendererRef.current;
        renderer.setSize(width, height);
    }, [height, width]);
     **/
    //=================
    return (
        <div style={{width: 'window.innerWidth', height: 'window.innerHeight'}}
             ref={mount}
        />
    )
}

export default Canvas;

/**class Canvas extends Component {
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

        //FUTURE MOVING EFFEKT
        var geometry = new THREE.SphereGeometry(1, 32, 32);
        var material = new THREE.MeshPhongMaterial({color: 0x808080, dithering: true});
        var cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, 0);
        scene.add(cube);

        //MOVING LIGHT BLOB ON CLICK
        let groupBlobs = new THREE.Group();
        let light = new THREE.PointLight(0xFFFFFF, 0.0, 6000);
        light.position.set(0, 0, 0);
        light.castShadow = true;
        groupBlobs.add(light);


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
            // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
            this.updateXYvalues([event.clientX / window.innerWidth, event.clientY / window.innerHeight]);


            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            let toIntersect = [background];
            var intersections = raycaster.intersectObjects(toIntersect);

            //Changing light position and brightness
            light.position.x = intersections[0].point.x;
            light.position.y = intersections[0].point.y;
            light.intensity = 0.7;

        }

        this.mount.addEventListener('click', handleMouseClick, false);

        //changing the light intensisty every x milliseconds
        function refreshLightIntensity() {
            let x = 3;  // 30 milliseconds

            if (light.intensity > 0.03) {
                light.intensity -= 0.03;
            }

            setTimeout(refreshLightIntensity, x * 10);
        }

        refreshLightIntensity();
        var animate = function () {
            requestAnimationFrame(animate);
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            /** might be too often
             if (light.intensity > 0.003) {
                light.intensity -= 0.003;
            }
            //
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

 export default Canvas;**/