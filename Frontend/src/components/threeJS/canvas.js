import React, { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import { useGlobalState } from "../../GlobalState.js"
import Dot from './Dot'
function Scene(props) {

    //HOW TO GET CANVAS INFO
    /**
     * const [canvases] = useGlobalState('canvases');
     * canvases[canvasId]
     */

    // global state 
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [listeningLooper,] = useGlobalState('listeningLooper');
    const [runningLoopers,] = useGlobalState('runningLoopers');
    const [randomNotes,] = useGlobalState('randomNotes');
    const [id,] = useGlobalState('canvasId');

    // THREE-Objects
    const { camera, raycaster, } = useThree();
    // const aspect = size.width / viewport.width;
    const mouse = useRef(new THREE.Vector2());
    const lightForRegularClick = useRef();
    const looperLights = [useRef(), useRef(), useRef(), useRef()];
    const background = useRef();
    const counter = useRef(0);
    const effectSphere = useRef(); //EFFECT SPHERE DOT
    const synthSphere = useRef();//SYNTH SPHERE DOT
    const musicSphere = useRef();//MUSIK SPHERE DOT

    const canvasClick = useCallback((coordinates, canvasId = id, playback = false) => {
        mouse.current.x = (coordinates[0]) * 2 - 1;
        mouse.current.y = -(coordinates[1]) * 2 + 1;
        // x / aspect, -y / aspect

        raycaster.setFromCamera(mouse.current, camera);

        let toIntersect = [background.current];
        let intersections = raycaster.intersectObjects(toIntersect);
        if (playback && (canvasId === id)) {
            looperLights[counter.current].current.position.x = intersections[0].point.x;
            looperLights[counter.current].current.position.y = intersections[0].point.y;
            // set light color depending on canvasId
            // looperLights.current[counter.current].color.set( canvases[canvasId].color); 
            looperLights[counter.current].current.intensity = 0.5;

            // more elegant: use modulo instead of if / else
            if (counter.current >= looperLights.length - 1) {
                counter.current = 0;
            }
            else {
                counter.current++;
            }

        } else if (!playback) {
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
    }, [id, musicCtrl, listeningLooper, camera, raycaster, looperLights]); // ==> End of canvasClick

    // give canvasClick to Looper and set ID to current canvas ID
    useEffect(() => {
        if (!musicCtrl[id]) return;
        if (listeningLooper && !listeningLooper._simulateCanvasClick) {
            listeningLooper._simulateCanvasClick = (coordinates, canvasId, playback = true) => canvasClick(coordinates, canvasId, playback);
            listeningLooper.setCanvasId(id);
        }
        // give canvasClick of this canvas to all loopers (needed after loading loopers from DB)
        for (let looper of Array.from(runningLoopers.values())) {
            looper._simulateCanvasClick = (coordinates, canvasId, playback = true) => canvasClick(coordinates, canvasId, playback);
        }

    }, [runningLoopers, listeningLooper, musicCtrl, id, canvasClick]);

    //give Canvas Click to randomNotes-Object
    useEffect(() => {
        if (!musicCtrl[id]) return;
        if (randomNotes && !randomNotes._simulateCanvasClick) {
            randomNotes._simulateCanvasClick = (coordinates, canvasId = id, playback = true) => canvasClick(coordinates, canvasId, playback);
        };
    }, [randomNotes, musicCtrl, id, canvasClick]);

    //CLICK FUNCTION ON CANVAS
    const onMouseClick = useCallback((event) => {
        // if anything more than the background is intersected, don't do anything
        if (event.intersections.length > 1) return;
        // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
        canvasClick([event.clientX / window.innerWidth, event.clientY / window.innerHeight]);
        // }
    }, [canvasClick]);

    // -> use useGesture() for all the click events -> native touch support
    //Touch on display (mobile/tablet) 
    // const onTouch = useCallback((event) => {
    //     event.preventDefault();
    //     // calculate mouse position in relative Coordinates: top left: 0, 0 / bottom right: 1, 1
    //     canvasClick([event.touches[0].clientX / window.innerWidth, event.touches[0].clientY / window.innerHeight]);

    //     // }
    // }, [canvasClick]);

    // make lights disappear over time
    useFrame(() => {
        lightForRegularClick.current.intensity = Math.max(0, lightForRegularClick.current.intensity - .05);
        for (let i = 0; i < looperLights.length; i++) {
            looperLights[i].current.intensity = Math.max(0, looperLights[i].current.intensity - .1)
        }
    });

    return (
        <>
            <ambientLight color='white' intensity={0.6} />
            <mesh
                ref={background}
                position={[0, -5, -1]}
                receiveShadow={true}
                onClick={onMouseClick}
            >
                <planeBufferGeometry attach="geometry" args={[window.innerWidth, window.innerHeight]} />
                <meshPhongMaterial attach="material" color='white' />
            </mesh>

            <Dot ref={effectSphere} name="effectSphere" color={0xF9CB9C} />
            <Dot ref={synthSphere} name="synthSphere" color={0x9FC5E8} />
            <Dot ref={musicSphere} name="musicSphere" color={0xD970A7} />
            <spotLight // Music
                target={musicSphere.current}
                color='#D970A7'
                position={[0, 0, 20]}
                intensity={0.4}
                castShadow={true}
                angle={.4}
                penumbra={.2}
                decay={2}
                distance={50}
            />
            <spotLight // Synth
                target={synthSphere.current}
                color='#9FC5E8'
                position={[0, 0, 20]}
                intensity={0.4}
                castShadow={true}
                angle={.4}
                penumbra={.2}
                decay={2}
                distance={50}
            />
            <spotLight // Effect
                target={effectSphere.current}
                color='#F9CB9C'
                position={[0, 0, 20]}
                intensity={0.4}
                castShadow={true}
                angle={.4}
                penumbra={.2}
                decay={2}
                distance={50}
            />
            <pointLight ref={lightForRegularClick} color='white' intensity={0} distance={6000} />
            <pointLight args={[0x38761D, 0.0, 6000]} ref={looperLights[0]} />
            <pointLight args={[0x38761D, 0.0, 6000]} ref={looperLights[1]} />
            <pointLight args={[0x38761D, 0.0, 6000]} ref={looperLights[2]} />
            <pointLight args={[0x38761D, 0.0, 6000]} ref={looperLights[3]} />
        </>
    )
}

function Cnvs() {
    return (
        <Canvas
            camera={{
                position: [0, 0, 40], near: 0.1, far: 1000, fov: 35,
                aspect: window.innerWidth / window.innerHeight, // 16 / 9 ??
            }}
        >
            <Scene />
        </Canvas>
    );
}

export default Cnvs;