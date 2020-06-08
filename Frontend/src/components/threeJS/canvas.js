import React, {useCallback, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {useGlobalState} from "../../GlobalState.js"
import DragControls from "three-dragcontrols";

//import DragControls from 'three'


function Canvas(props) {

    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [listeningLooper,] = useGlobalState('listeningLooper');
    const [width,] = useState(window.innerWidth);
    const [height,] = useState(window.innerHeight);
    //  const canvasRef = useRef<HTMLCanvasElement>();
    const mount = useRef(null);

    // const [size, setSize] = useState([0, 0]);
    // const [xyCoordinates, setCoordinates] = useState(true)

    ///refs
    const dragging = useRef(false);
    const mouse = useRef(new THREE.Vector2());
    const raycaster = useRef(new THREE.Raycaster());
    const lightForRegularClick = useRef(new THREE.PointLight(0xFFFFFF, 0.0, 6000));
    const looperLights = useRef([new THREE.PointLight(0x3577B2, 0.0, 6000),
        new THREE.PointLight(0x3577B2, 0.0, 6000),
        new THREE.PointLight(0x3577B2, 0.0, 6000),
        new THREE.PointLight(0x3577B2, 0.0, 6000)]);
    const plane = useRef(new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight));//BACKGROUND PLANE
    const materialBackground = useRef(new THREE.MeshPhongMaterial({color: 0x9EC2E3, dithering: true}));
    const background = useRef(new THREE.Mesh(plane.current, materialBackground.current));
    const camera = useRef(new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000));//CAMERA
    const counter = useRef(0);
    const scene = useRef(new THREE.Scene()); //SCENE
    const ambient = useRef(new THREE.AmbientLight(0xffffff, 0.6));//SCENE LIGHT
    const renderer = useRef(new THREE.WebGLRenderer());//RENDERER
    // MOVING EFFEKT
    let geometryEffect = new THREE.SphereGeometry(1, 32, 32);
    let materialEffect = new THREE.MeshPhongMaterial({color: 0x25D4D4, dithering: true});
    const effectSphere = useRef(new THREE.Mesh(geometryEffect, materialEffect)); //EFFECT SPHERE DOT

    // MOVING SYNTH
    let geometrySynth = new THREE.SphereGeometry(1, 32, 32);
    let materialSynth = new THREE.MeshPhongMaterial({color: 0xD4D425, dithering: true});
    const synthSphere = useRef(new THREE.Mesh(geometrySynth, materialSynth));//SYNTH SPHERE DOT

    // MOVING MUSIK
    let geometryMusik = new THREE.SphereGeometry(1, 32, 32);
    let materialMusik = new THREE.MeshPhongMaterial({color: 0xD425D4, dithering: true});
    const musikSphere = useRef( new THREE.Mesh(geometryMusik, materialMusik));//MUSIK SPHERE DOT

    const spotLight = useRef(new THREE.SpotLight(0x8E2057, 0.5));//ATMOSPHERE SPOT LIGHT


    const canvasClick = useCallback((value, playback = false) => {

        //give canvasClick to Looper
        if (listeningLooper && !listeningLooper._simulateCanvasClick) {
            listeningLooper._simulateCanvasClick = (value, playback = true) => canvasClick(value, playback);
        }
        mouse.current.x = (value[0]) * 2 - 1;
        mouse.current.y = -(value[1]) * 2 + 1;

        raycaster.current.setFromCamera(mouse.current, camera.current);

        let toIntersect = [background.current];
        let intersections = raycaster.current.intersectObjects(toIntersect);
        if (playback) {
            looperLights.current[counter.current].position.x = intersections[0].point.x;
            looperLights.current[counter.current].position.y = intersections[0].point.y;
            looperLights.current[counter.current].intensity = 0.5;
            if(counter.current >=  looperLights.current.length-1){
                counter.current = 0;
            }
            else{
                counter.current ++;
            }

        } else {
            //Changing lightForRegularClick position and brightness
            lightForRegularClick.current.position.x = intersections[0].point.x;
            lightForRegularClick.current.position.y = intersections[0].point.y;
            lightForRegularClick.current.intensity = 0.7;
        }


        musicCtrl.triggerSynth(value[0], value[1]);
        if (listeningLooper && !playback) {
           // console.log("adding event");//if there is a looper currently recording actions
            listeningLooper.addEvents(
                {
                    timestamp: performance.now(),
                    type: "canvasClick",
                    x: value[0],
                    y: value[1]
                }
            )
        }
    }, [musicCtrl, listeningLooper]);

    //CLICK FUNCTION ON CANVAS
    const onMouseClick = useCallback((event) => {
       // console.log("click on canvas");
        event.preventDefault();
        if (!dragging.current) {
            // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
            canvasClick([event.clientX / window.innerWidth, event.clientY / window.innerHeight]);

        }
    }, [canvasClick]);

    //Touch on display (mobile/tablet)
    const onTouch = useCallback((event) => {
       // console.log("touch on canvas");
        event.preventDefault();
        if (!dragging.current) {
            // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
            canvasClick([event.touches[0].clientX / window.innerWidth, event.touches[0].clientY / window.innerHeight]);

        }
    }, [canvasClick]);

    const oldOnMouseClick = useRef(onMouseClick);
    const oldOnTouch = useRef(onTouch);

    useEffect(() => {
        mount.current.removeEventListener('mousedown', oldOnMouseClick.current)
        mount.current.removeEventListener('touchstart', oldOnTouch.current)
        mount.current.addEventListener('mousedown', onMouseClick, false);
        mount.current.addEventListener('touchstart', onTouch, false);
        oldOnMouseClick.current = onMouseClick;
    }, [onMouseClick, onTouch]);

    const effectSphereDrag = useCallback((value) => {
        musicCtrl.setParameterEffect(value.x, value.y)
        //Niklas = value.x / value.y sind die neuen coordinaten [-1 , 1]
    },[musicCtrl]);

    const synthSphereDrag = useCallback((value) => {
        musicCtrl.setParameterSynth(value.x, value.y)
        //Niklas = value.x / value.y sind die neuen coordinaten [-1 , 1]
    },[musicCtrl]);

    const musikSphereDrag = useCallback((value) => {
        musicCtrl.setParameterMusic(value.x, value.y)
        //Niklas = value.x / value.y sind die neuen coordinaten [-1 , 1]
        //musicCtrl.....
    },[musicCtrl]);


    //CREATING SCENE
    useEffect(() => {

        //SET CAMERA
        camera.current.position.z = 20;

        //SCENE LIGHT
        scene.current.add(ambient.current);

        //SET RENDERER
        renderer.current.setSize(width, height);
        renderer.current.shadowMap.enabled = true;
        mount.current.appendChild(renderer.current.domElement);

        //SET EFFECT SPHERE START POSITION
        effectSphere.current.position.set(0, 0, 0);
        scene.current.add(effectSphere.current);

        //SET SYNTH SPHERE START POSITION
        synthSphere.current.position.set(-10, 0, 0);
        scene.current.add(synthSphere.current);

        //SET MUSIK SPHERE START POSITION
        musikSphere.current.position.set(10, 0, 0);
        scene.current.add(musikSphere.current);

        //MOVING LIGHT BLOB ON CLICK
        lightForRegularClick.current.position.set(0, 0, 0);
        lightForRegularClick.current.castShadow = true;
        scene.current.add(lightForRegularClick.current);

        //ADD LOPING LIGHTS
        for (let i = 0; i < looperLights.current.length ; i++) {
            scene.current.add(looperLights.current[i]);
        }

        //BACKGROUND
        background.current.position.set(0, -5, -1);
        background.current.receiveShadow = true;
        scene.current.add(background.current);

        //ATMOSPHERE SPOT LIGHT
        spotLight.current.position.set(20, 0, 50);
        spotLight.current.angle = Math.PI / 4;
        spotLight.current.penumbra = 0.05;
        spotLight.current.decay = 2;
        spotLight.current.distance = 200;

        spotLight.current.castShadow = true;
        spotLight.current.shadow.mapSize.width = 1024;
        spotLight.current.shadow.mapSize.height = 1024;
        spotLight.current.shadow.camera.near = 10;
        spotLight.current.shadow.camera.far = 200;
        scene.current.add(spotLight.current);

        //=======================================

        //DRAGGING DOTS
        let controls = new DragControls([effectSphere.current, synthSphere.current, musikSphere.current], camera.current, renderer.current.domElement);
        // let dragging = false;
        controls.addEventListener('dragstart', function (event) {
            dragging.current = true;
            event.object.material.emissive.set(0xaaaaaa);

        });


        //Called every drag
        controls.addEventListener('drag', function (event) {
            let pos = event.object.position.clone();
            pos.project(camera.current);
            if (event.object === effectSphere.current) {
                effectSphereDrag(pos);
            } else if (event.object === synthSphere.current) {
                synthSphereDrag(pos);
            } else if (event.object === musikSphere.current) {
                musikSphereDrag(pos);
            }

        });

        //only on drag end
        controls.addEventListener('dragend', function (event) {
            dragging.current = false;
            event.object.material.emissive.set(0x000000);
        });


        // OLD CLICK FUNCTION ON CANVAS
        /**  function onMouseClick(event) {
            event.preventDefault();
            if (!dragging) {
                // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
                canvasClick([event.clientX / window.innerWidth, event.clientY / window.innerHeight]);
                mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);

                let toIntersect = [background, effectSphere];
                let intersections = raycaster.intersectObjects(toIntersect);

                //Changing lightForRegularClick position and brightness
                lightForRegularClick.position.x = intersections[0].point.x;
                lightForRegularClick.position.y = intersections[0].point.y;
                lightForRegularClick.intensity = 0.7;
            }


        }**/

        //======================================
        //changing the lightForRegularClick intensisty every x milliseconds
        function refreshLightIntensity() {
            let x = 3;  // 30 milliseconds

            if (lightForRegularClick.current.intensity > 0.03) {
                lightForRegularClick.current.intensity -= 0.03;
            }

            setTimeout(refreshLightIntensity, x * 10);
        }

        refreshLightIntensity();

        function looperLightIntensity(){
            let x = 3;  // 30 milliseconds
            for (let i = 0; i < looperLights.current.length ; i++) {
                if (looperLights.current[i].intensity > 0.03) {
                    looperLights.current[i].intensity -= 0.03;
                }
            }

            setTimeout(looperLightIntensity, x * 10);
        }
        looperLightIntensity();

        //================================================
        var animate = function () {
            requestAnimationFrame(animate);
            effectSphere.current.rotation.x += 0.01;
            effectSphere.current.rotation.y += 0.01;

            /** might be too often
             if (lightForRegularClick.intensity > 0.003) {
                lightForRegularClick.intensity -= 0.003;
            }
             **/
            renderer.current.render(scene.current, camera.current);
        };
        animate();


    }, [mount, height, width,effectSphereDrag,musikSphereDrag,synthSphereDrag]);


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