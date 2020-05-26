import React, {useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {useGlobalState} from "../../GlobalState.js"
import DragControls from "three-dragcontrols";

//import DragControls from 'three'


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

    const effectSphereDrag = (value) => {
        //do something
        //Niklas = value.x / value.y sind die neuen coordinaten [-1 , 1]
        //musicCtrl.....
    };

    const synthSphereDrag = (value) => {
        //do something
        //Niklas = value.x / value.y sind die neuen coordinaten [-1 , 1]
        //musicCtrl.....
    };

    const musikSphereDrag = (value) => {
        //do something
        //Niklas = value.x / value.y sind die neuen coordinaten [-1 , 1]
        //musicCtrl.....
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
        let ambient = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambient);

        //ADD RENDERER
        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        mount.current.appendChild(renderer.domElement);

        // MOVING EFFEKT
        let geometryEffect = new THREE.SphereGeometry(1, 32, 32);
        let materialEffect = new THREE.MeshPhongMaterial({color: 0x25D4D4, dithering: true});
        let effectSphere = new THREE.Mesh(geometryEffect, materialEffect);
        effectSphere.position.set(0, 0, 0);
        scene.add(effectSphere);

        // MOVING SYNTH
        let geometrySynth = new THREE.SphereGeometry(1, 32, 32);
        let materialSynth = new THREE.MeshPhongMaterial({color: 0xD4D425, dithering: true});
        let synthSphere = new THREE.Mesh(geometrySynth, materialSynth);
        synthSphere.position.set(-10, 0, 0);
        scene.add(synthSphere);

        // MOVING MUSIK
        let geometryMusik = new THREE.SphereGeometry(1, 32, 32);
        let materialMusik = new THREE.MeshPhongMaterial({color: 0xD425D4, dithering: true});
        let musikSphere = new THREE.Mesh(geometryMusik, materialMusik);
        musikSphere.position.set(10, 0, 0);
        scene.add(musikSphere);


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


        //DRAGGING DOTS
        let controls = new DragControls([effectSphere, synthSphere, musikSphere], camera, renderer.domElement);
        let dragging = false;
        controls.addEventListener('dragstart', function (event) {
            dragging = true;
            event.object.material.emissive.set(0xaaaaaa);

        });


        //Called every drag
        controls.addEventListener('drag', function (event) {
            let pos = event.object.position.clone();
            pos.project(camera);
            if (event.object === effectSphere) {
                effectSphereDrag(pos);
            } else if (event.object === synthSphere) {
                synthSphereDrag(pos);
            } else if (event.object === musikSphere) {
                musikSphereDrag(pos);
            }

        });

        //only on drag end
        controls.addEventListener('dragend', function (event) {
            dragging = false;
            event.object.material.emissive.set(0x000000);
            let pos = event.object.position.clone();
            pos.project(camera);
            pos.x = (pos.x / window.innerWidth) + window.innerWidth / 2;
            pos.y = -(pos.y * window.innerHeight / 2) + window.innerHeight / 2;
            pos.normalize();

            if (event.object === effectSphere) {
                effectSphereDrag(pos);
                console.log("dragged effect dot");
            } else if (event.object === synthSphere) {
                synthSphereDrag(pos);
                console.log("dragged synth dot");
            }
            else if (event.object === musikSphere) {
                musikSphereDrag(pos);
                console.log("dragged musik dot");
            }


        });

        let mouse = new THREE.Vector2();

        let raycaster = new THREE.Raycaster();

        //CLICK FUNCTION ON CANVAS
        function onMouseClick(event) {
            event.preventDefault();
            if (!dragging) {
                // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
                canvasClick([event.clientX / window.innerWidth, event.clientY / window.innerHeight]);
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);

                let toIntersect = [background, effectSphere];
                let intersections = raycaster.intersectObjects(toIntersect);

                //Changing light position and brightness
                light.position.x = intersections[0].point.x;
                light.position.y = intersections[0].point.y;
                light.intensity = 0.7;
            }


        }

        mount.current.addEventListener('mousedown', handleMouseClick, false);

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
            effectSphere.rotation.x += 0.01;
            effectSphere.rotation.y += 0.01;

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