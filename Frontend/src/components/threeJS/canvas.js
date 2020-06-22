import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGlobalState } from "../../GlobalState.js"
import DragControls from "three-dragcontrols";
import useEventListener from "../../UseEventListener";
function Canvas(props) {

    //HOW TO GET CANVAS INFO
    /**
     * const [globalFunctions] = useGlobalState('globalFunctions');
     * a way to get the data of the canvas
     *  const CallCanvasState = () => {
        if (globalFunctions.getCanvasState instanceof Function) {
          console.log(
            globalFunctions.getCanvasState());
        }
    }
     */

    // global state 
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [listeningLooper,] = useGlobalState('listeningLooper');
    const [runningLoopers, ] = useGlobalState('runningLoopers');
    const [randomNotes,] = useGlobalState('randomNotes');
    const [, setGlobalFunctions] = useGlobalState('canvasFunctions');
    const [canvases, setCanvases] = useGlobalState('canvases');
    const [id,] = useGlobalState('canvasId');
    const [activeHelpDialogue, setActiveHelpDialogue] = useGlobalState('activeHelpDialogue');

    // component state
    // const [width,] = useState(window.innerWidth);
    // const [height,] = useState(window.innerHeight);
    const [, setCanvasState] = useState(canvases[id]);

    const mount = useRef(null);

    // THREE-Objects
    const dragging = useRef(false);
    const mouse = useRef(new THREE.Vector2());
    const raycaster = useRef(new THREE.Raycaster());
    const lightForRegularClick = useRef(new THREE.PointLight(0xFFFFFF, 0.0, 6000));
    const looperLights = useRef([
        new THREE.PointLight(0x38761D, 0.0, 6000),
        new THREE.PointLight(0x38761D, 0.0, 6000),
        new THREE.PointLight(0x38761D, 0.0, 6000),
        new THREE.PointLight(0x38761D, 0.0, 6000)
    ]);
    const plane = useRef(new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight));//BACKGROUND PLANE
    // const materialBackground = useRef(new THREE.MeshPhongMaterial({ color: 0xFFFFFF, dithering: true }));
    const materialBackground = useRef(new THREE.MeshPhongMaterial({ color: 0xFFFFFF, dithering: true }));
    const background = useRef(new THREE.Mesh(plane.current, materialBackground.current));
    const camera = useRef(new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 1000));//CAMERA
    const counter = useRef(0);
    const scene = useRef(new THREE.Scene()); //SCENE
    const ambient = useRef(new THREE.AmbientLight(0xffffff, 0.6));//SCENE LIGHT
    const spotLightMusic = useRef(createSpotlight(0xD970A7));//ATMOSPHERE SPOT LIGHT
    const spotLightEffect = useRef(createSpotlight(0xF9CB9C));//ATMOSPHERE SPOT LIGHT
    const sportLightSynth = useRef(createSpotlight(0x9FC5E8));//ATMOSPHERE SPOT LIGHT
    const renderer = useRef(new THREE.WebGLRenderer({ alpha: true }));//RENDERER

    // MOVING EFFEKT
    let geometryEffect = new THREE.SphereGeometry(1, 32, 32);
    let materialEffect = new THREE.MeshPhongMaterial({ color: 0xF9CB9C, dithering: true });
    const effectSphere = useRef(new THREE.Mesh(geometryEffect, materialEffect)); //EFFECT SPHERE DOT

    // MOVING SYNTH
    let geometrySynth = new THREE.SphereGeometry(1, 32, 32);
    let materialSynth = new THREE.MeshPhongMaterial({ color: 0x9FC5E8, dithering: true });
    const synthSphere = useRef(new THREE.Mesh(geometrySynth, materialSynth));//SYNTH SPHERE DOT

    // MOVING MUSIK
    let geometryMusik = new THREE.SphereGeometry(1, 32, 32);
    let materialMusik = new THREE.MeshPhongMaterial({ color: 0xD970A7, dithering: true });
    const musikSphere = useRef(new THREE.Mesh(geometryMusik, materialMusik));//MUSIK SPHERE DOT


    const controls = useRef(new DragControls([effectSphere.current, synthSphere.current, musikSphere.current], camera.current, renderer.current.domElement)); //DRAGGING CONTROLS

    function createSpotlight(color) {
        let newObj = new THREE.SpotLight(color, 0.4);
        newObj.castShadow = true;
        newObj.angle = 0.4;
        newObj.penumbra = 0.2;
        newObj.decay = 2;
        newObj.distance = 50;

        return newObj;
    }

    // change background color accoring to canvasID
    // useEffect(()=> {
    //     materialBackground.current.color.set(canvases[id].color * 2 )
    // },[id, canvases])

    const canvasClick = useCallback((coordinates,  canvasId = id, playback = false) => {
        mouse.current.x = (coordinates[0]) * 2 - 1;
        mouse.current.y = -(coordinates[1]) * 2 + 1;

        raycaster.current.setFromCamera(mouse.current, camera.current);

        let toIntersect = [background.current];
        let intersections = raycaster.current.intersectObjects(toIntersect);
        if (playback) {
            looperLights.current[counter.current].position.x = intersections[0].point.x;
            looperLights.current[counter.current].position.y = intersections[0].point.y;
            // set light color depending on canvasId
            looperLights.current[counter.current].color.set( canvases[canvasId].color); 
            looperLights.current[counter.current].intensity = 0.5;
            
            // more elegant: use modulo instead of if / else
            if (counter.current >= looperLights.current.length - 1) {
                counter.current = 0;
            }
            else {
                counter.current++;
            }

        } else {
            //Changing lightForRegularClick position and brightness
            lightForRegularClick.current.position.x = intersections[0].point.x;
            lightForRegularClick.current.position.y = intersections[0].point.y;
            lightForRegularClick.current.intensity = 0.3;
        }

        musicCtrl[canvasId].triggerSynth(coordinates[0], coordinates[1]);

        if (listeningLooper && !playback) {
            listeningLooper.addEvents(
                {
                    timestamp: performance.now(),
                    type: "canvasClick",
                    x: coordinates[0],
                    y: coordinates[1]
                }
            )
        }
    }, [id, musicCtrl, listeningLooper, canvases]); // ==> End of canvasClick

    // give canvasClick to Looper and set ID to current canvas ID
    useEffect(() => {
        if (!musicCtrl[id]) return;
        if (listeningLooper && !listeningLooper._simulateCanvasClick) {
            listeningLooper._simulateCanvasClick = (coordinates, canvasId, playback = true) => canvasClick(coordinates, canvasId, playback);
            listeningLooper.setCanvasId(id);
        }
        // give canvasClick of this canvas to all loopers
        for(let looper of Array.from(runningLoopers.values())) {
            looper._simulateCanvasClick = (coordinates, canvasId, playback = true) => canvasClick(coordinates, canvasId, playback);
        }
        
    }, [runningLoopers, listeningLooper, musicCtrl, id, canvasClick]);

    //give Canvas Click to randomNotes-Object
    useEffect(() => {
        if (!musicCtrl[id]) return;
        if (randomNotes && !randomNotes._simulateCanvasClick) {
            randomNotes._simulateCanvasClick = (coordinates, playback = true) => canvasClick(coordinates, playback);
        };
    }, [randomNotes, musicCtrl, id, canvasClick]);

    //CLICK FUNCTION ON CANVAS
    const onMouseClick = useCallback((event) => {
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

    const refreshSpherePositions = useCallback(() => {
        // let aspectRatio = window.innerWidth / window.innerHeight;
            let posEffect = effectSphere.current.position.clone();
            console.log('speichern. vor Projektion:')
            console.log(posEffect);

            console.log('speichern. nach Projektion:')
            console.log(posEffect);
            let posSynth = synthSphere.current.position.clone();
            let posMusic = musikSphere.current.position.clone();

            let newState = {
                'effectSphere': {
                    'x': posEffect.x,
                    'y': posEffect.y,
                },
                'synthSphere': {
                    'x': posSynth.x,
                    'y': posSynth.y
                },
                'musicSphere': {
                    'x': posMusic.x,
                    'y': posMusic.y
                }
            }

            setCanvasState(newState);
            canvases[id] = newState;
            setCanvasState(Array.from(canvases));
    },[canvases, id])


    const effectSphereDrag = useCallback(() => {
        if (!musicCtrl[id]) return;
        camera.current.updateMatrixWorld();
        let pos = effectSphere.current.position.clone();
        pos.project(camera.current);
        musicCtrl[id].setParameterEffect(pos.x, pos.y)
    }, [id, musicCtrl]);

    const synthSphereDrag = useCallback(() => {
        if (!musicCtrl[id]) return;
        camera.current.updateMatrixWorld();
        let pos = synthSphere.current.position.clone();
        pos.project(camera.current);
        musicCtrl[id].setParameterSynth((pos.x), (pos.y))
    }, [id, musicCtrl]);

    const musikSphereDrag = useCallback(() => {
        if (!musicCtrl[id]) return;
        camera.current.updateMatrixWorld();
        let pos = musikSphere.current.position.clone();
        pos.project(camera.current);
        musicCtrl[id].setParameterMusic(pos.x, pos.y)
    }, [id, musicCtrl]);

    const dragStart = useCallback((event) => {
        dragging.current = true;
        event.object.material.emissive.set(0xaaaaaa);

    }, []);

    useEventListener('dragstart', dragStart, controls.current);


    const drag = useCallback((event) => {
        if (event.object === effectSphere.current) {
            effectSphereDrag();
        } else if (event.object === synthSphere.current) {
            synthSphereDrag();
        } else if (event.object === musikSphere.current) {
            musikSphereDrag();
        }
    }, [effectSphereDrag, musikSphereDrag, synthSphereDrag]);

    useEventListener('drag', drag, controls.current);

    const dragEnd = useCallback((event) => {
        dragging.current = false;
        event.object.material.emissive.set(0x000000);
        refreshSpherePositions();

    }, [refreshSpherePositions]);
    useEventListener('dragend', dragEnd, controls.current);


    const loadSpherePositions = useCallback((canvasData) => {
            if (!canvasData) {
                console.error(`sphere positions error`)
            }
            effectSphere.current.position.set(canvasData.effectSphere.x, canvasData.effectSphere.y, 0);
            synthSphere.current.position.set(canvasData.synthSphere.x , canvasData.synthSphere.y , 0);
            musikSphere.current.position.set(canvasData.musicSphere.x , canvasData.musicSphere.y, 0);
            // console.log(musikSphere.current.position.clone())
            // console.log(window.innerWidth)
            // effectSphereDrag();
            // synthSphereDrag();
            // musikSphereDrag();
    },[])//effectSphereDrag, synthSphereDrag, musikSphereDrag])

    

    // set global functions
    useEffect(() => {
        let giveCanvasClickToLooper = function (looper) {
            looper._simulateCanvasClick = (value, playback = true) => canvasClick(value, playback);
        }

    
        setGlobalFunctions(Object.assign({
            'giveCanvasClickToLooper': giveCanvasClickToLooper,

        }))
    }, [id, canvases, setCanvases, setGlobalFunctions, canvasClick,]);
    // --> End of global functions

    //CREATING SCENE
    useEffect(() => {

        //SET CAMERA
        camera.current.position.z = 40;
        camera.current.updateMatrixWorld();

        //SCENE LIGHT
        scene.current.add(ambient.current);

        //SET RENDERER
        renderer.current.setSize(window.innerWidth, window.innerHeight);
        renderer.current.shadowMap.enabled = true;
        mount.current.appendChild(renderer.current.domElement);

        //SET EFFECT SPHERE START POSITION
        // effectSphere.current.position.set(0, 0, 0);
        scene.current.add(effectSphere.current);
        // effectSphereDrag();

        //SET SYNTH SPHERE START POSITION
        // synthSphere.current.position.set(-10, 0, 0);
        scene.current.add(synthSphere.current);
        // synthSphereDrag();

        //SET MUSIK SPHERE START POSITION
        // musikSphere.current.position.set(10, 0, 0);
        scene.current.add(musikSphere.current);
        // musikSphereDrag();
        loadSpherePositions(canvases[id]);

        //MOVING LIGHT BLOB ON CLICK
        lightForRegularClick.current.position.set(0, 0, 0);
        lightForRegularClick.current.castShadow = true;
        scene.current.add(lightForRegularClick.current);

        //ADD LOPING LIGHTS
        for (let i = 0; i < looperLights.current.length; i++) {
            scene.current.add(looperLights.current[i]);
        }

        //BACKGROUND
        background.current.position.set(0, -5, -1);
        background.current.receiveShadow = true;
        scene.current.add(background.current);


        //ATMOSPHERE SPOT LIGHT
        spotLightEffect.current.position.set(0, 0, 20);
        sportLightSynth.current.position.set(0, 0, 20);
        spotLightMusic.current.position.set(0, 0, 20);
        sportLightSynth.current.target = synthSphere.current;
        spotLightEffect.current.target = effectSphere.current;
        spotLightMusic.current.target = musikSphere.current;
        scene.current.add(sportLightSynth.current);
        scene.current.add(spotLightMusic.current);
        scene.current.add(spotLightEffect.current);

        //  spotLight3.position.set( - 15, 40, 45 );

        //=======================================

        //changing the lightForRegularClick intensisty every x milliseconds
        function refreshLightIntensity() {
            let x = 3;  // 30 milliseconds

            if (lightForRegularClick.current.intensity > 0.01) {
                lightForRegularClick.current.intensity -= 0.01;
            }

            setTimeout(refreshLightIntensity, x * 10);
        }

        refreshLightIntensity();

        function looperLightIntensity() {
            let x = 3;  // 30 milliseconds
            for (let i = 0; i < looperLights.current.length; i++) {
                if (looperLights.current[i].intensity > 0.03) {
                    looperLights.current[i].intensity -= 0.03;
                }
            }

            setTimeout(looperLightIntensity, x * 10);
        }
        looperLightIntensity();

        //================================================
        var animate = function () { // why is this a function?
            requestAnimationFrame(animate);
            // effectSphere.current.rotation.x += 0.01;
            // effectSphere.current.rotation.y += 0.01;
            renderer.current.render(scene.current, camera.current);


        };

        animate();


    }, [mount, loadSpherePositions, canvases, id]);

    window.addEventListener('resize', onWindowResize, false);

    function onWindowResize() {

        camera.current.aspect = window.innerWidth / window.innerHeight;
        camera.current.updateProjectionMatrix();

        renderer.current.setSize( window.innerWidth, window.innerHeight );
       // loadSpherePositions(canvasState);
        // console.log(`height: ${window.innerHeight}`)
        

    }

    //=================

    let clicks = 0;
    return (
        <div id="canvas"
            onClick={() => {
                if (activeHelpDialogue === "canvas") { setActiveHelpDialogue("effects") };
                /* Fake listen on effect button movement for help dialogue */
                if (activeHelpDialogue === "effects") { clicks = clicks + 1 };
                if (activeHelpDialogue === "effects" && clicks === 2) { setActiveHelpDialogue("loop") };
            }}

            style={{ width: 'window.innerWidth', height: 'window.innerHeight' }}
            ref={mount} onMouseDown={onMouseClick} onTouchStart={onTouch}
        />
    )
}

export default Canvas;