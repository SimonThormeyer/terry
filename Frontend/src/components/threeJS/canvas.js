import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useGlobalState } from "../../GlobalState.js"
import DragControls from "three-dragcontrols";

function Canvas(props) {

    // global state 
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [listeningLooper,] = useGlobalState('listeningLooper');

    // component state 
    const [width,] = useState(window.innerWidth);
    const [height,] = useState(window.innerHeight);

    const mount = useRef(null);

    // THREE-Objects
    const dragging = useRef(false);
    const mouse = useRef(new THREE.Vector2());
    const raycaster = useRef(new THREE.Raycaster());
    const lightForRegularClick = useRef(new THREE.PointLight(0xFFFFFF, 0.0, 6000));
    const looperLights = useRef([
        new THREE.PointLight(0x3577B2, 0.0, 6000),
        new THREE.PointLight(0x3577B2, 0.0, 6000),
        new THREE.PointLight(0x3577B2, 0.0, 6000),
        new THREE.PointLight(0x3577B2, 0.0, 6000)
    ]);
    const plane = useRef(new THREE.PlaneBufferGeometry(window.innerWidth, window.innerHeight));//BACKGROUND PLANE
    const materialBackground = useRef(new THREE.MeshPhongMaterial({ color: 0x9EC2E3, dithering: true }));
    const background = useRef(new THREE.Mesh(plane.current, materialBackground.current));
    const camera = useRef(new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000));//CAMERA
    const counter = useRef(0);
    const scene = useRef(new THREE.Scene()); //SCENE
    const ambient = useRef(new THREE.AmbientLight(0xffffff, 0.6));//SCENE LIGHT
    const spotLight = useRef(new THREE.SpotLight(0x8E2057, 0.5));//ATMOSPHERE SPOT LIGHT
    const renderer = useRef(new THREE.WebGLRenderer());//RENDERER
    // MOVING EFFEKT
    let geometryEffect = new THREE.SphereGeometry(1, 32, 32);
    let materialEffect = new THREE.MeshPhongMaterial({ color: 0x25D4D4, dithering: true });
    const effectSphere = useRef(new THREE.Mesh(geometryEffect, materialEffect)); //EFFECT SPHERE DOT

    // MOVING SYNTH
    let geometrySynth = new THREE.SphereGeometry(1, 32, 32);
    let materialSynth = new THREE.MeshPhongMaterial({ color: 0xD4D425, dithering: true });
    const synthSphere = useRef(new THREE.Mesh(geometrySynth, materialSynth));//SYNTH SPHERE DOT

    // MOVING MUSIK
    let geometryMusik = new THREE.SphereGeometry(1, 32, 32);
    let materialMusik = new THREE.MeshPhongMaterial({ color: 0xD425D4, dithering: true });
    const musikSphere = useRef(new THREE.Mesh(geometryMusik, materialMusik));//MUSIK SPHERE DOT



    const canvasClick = useCallback((value, playback = false) => {

        // give canvasClick to Looper => possibly better in a useEffect
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
            lightForRegularClick.current.intensity = 0.7;
        }

        musicCtrl.triggerSynth(value[0], value[1]);

        if (listeningLooper && !playback) {
            listeningLooper.addEvents(
                {
                    timestamp: performance.now(),
                    type: "canvasClick",
                    x: value[0],
                    y: value[1]
                }
            )
        }
    }, [musicCtrl, listeningLooper]); // ==> End of canvasClick

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

    const oldOnMouseClick = useRef(onMouseClick);
    const oldOnTouch = useRef(onTouch);

    useEffect(() => { // useEventListener
        mount.current.removeEventListener('mousedown', oldOnMouseClick.current)
        mount.current.removeEventListener('touchstart', oldOnTouch.current)
        mount.current.addEventListener('mousedown', onMouseClick, false);
        mount.current.addEventListener('touchstart', onTouch, false);
        oldOnMouseClick.current = onMouseClick;
    }, [onMouseClick, onTouch]);

    const effectSphereDrag = useCallback((value) => {
        musicCtrl.setParameterEffect(value.x, value.y)
    }, [musicCtrl]);

    const synthSphereDrag = useCallback((value) => {
        musicCtrl.setParameterSynth(value.x, value.y)
    }, [musicCtrl]);

    const musikSphereDrag = useCallback((value) => {
        musicCtrl.setParameterMusic(value.x, value.y)
    }, [musicCtrl]);


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
        for (let i = 0; i < looperLights.current.length; i++) {
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

        //DRAGGING DOTS ===> better out of this build-scene-useEffect
        let controls = new DragControls([effectSphere.current, synthSphere.current, musikSphere.current], camera.current, renderer.current.domElement);
        // ^ move up to refs

        // useEventListener
        controls.addEventListener('dragstart', function (event) {
            dragging.current = true;
            event.object.material.emissive.set(0xaaaaaa);

        });


        // useEventListener
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

        // useEventListener
        //only on drag end
        controls.addEventListener('dragend', function (event) {
            dragging.current = false;
            event.object.material.emissive.set(0x000000);
        });

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
            effectSphere.current.rotation.x += 0.01;
            effectSphere.current.rotation.y += 0.01;
            renderer.current.render(scene.current, camera.current);
        };

        animate();


    }, [mount, height, width, effectSphereDrag, musikSphereDrag, synthSphereDrag]);


    //=================
    return (
        <div style={{ width: 'window.innerWidth', height: 'window.innerHeight' }}
            ref={mount}
        />
    )
}

export default Canvas;