import React, { useState, forwardRef, useRef, useEffect, useCallback } from 'react';
import { useGlobalState } from "../../GlobalState.js"
import { useThree } from 'react-three-fiber'
import { useGesture } from "react-use-gesture"
import { useSpring } from 'react-spring'
import { a } from "@react-spring/three"
import { Vector3 } from "three";

import { clamp } from 'lodash'

const Dot = forwardRef((props, ref) => {

    //global
    const [canvases, setCanvases] = useGlobalState("canvases");
    const [canvasId] = useGlobalState('canvasId');
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [randomNotesRunning,] = useGlobalState('randomNotesRunning');
    const [toneIsInitialized,] = useGlobalState('toneIsInitialized');

    // local
    const [dragging, setDragging] = useState(false);
    const dragAnimationRunning = useRef(false);
    const [animatedPosition, setAnimatedPosition] = useState([canvases[canvasId][props.name].x, canvases[canvasId][props.name].y, 0]);
    const [position, setPosition] = useState(animatedPosition);
    const beforeDragPosition = useRef(
        [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y])
    const { camera, size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const oldCanvasId = useRef(0);
    const [switchingCanvas, setSwitchingCanvas] = useState(false);
    // bounds for dot positions that are used while dragging and animating 
    const bounds = [-viewport.width / 2, viewport.width / 2, -viewport.height / 2, viewport.height / 2];

    // this is an ugly fix to set correct musicCtrlParameters after project load also for others than the active canvas 
    // - should be done in OpenProject.js but Dot position must be projected, thus it has to be done here. 
    // Better would be to store and load relative coordinates not world coordinates
    useEffect(() => {
        if(!toneIsInitialized) return;
        camera.updateMatrixWorld();
        for (let i = 0; i < canvases.length; i++) {
            if (props.name === 'effectSphere') {
                let { x, y } = canvases[i].effectSphere;
                let pos = new Vector3(x, y, 0);
                pos.project(camera);
                musicCtrl[i].setParameterEffect(pos.x, pos.y);
            } else if (props.name === 'synthSphere') {
                let { x, y } = canvases[i].synthSphere;
                let pos = new Vector3(x, y, 0);
                pos.project(camera);
                musicCtrl[i].setParameterSynth(pos.x, pos.y);
            } else if (props.name === 'musicSphere') {
                let { x, y } = canvases[i].musicSphere;
                let pos = new Vector3(x, y, 0);
                pos.project(camera);
                musicCtrl[i].setParameterMusic(pos.x, pos.y);
            }
        }
    }, [camera, toneIsInitialized, canvases, musicCtrl, props.name])


    // save current dot position into canvas with the given id
    const saveCurrentPositionInGlobalState = useCallback((canvasId) => {
        let newCanvases = Array.from(canvases);
        let newDot = {};
        newDot[props.name] = {
            x: animatedPosition[0],
            y: animatedPosition[1]
        }
        let newCanvas = { ...canvases[canvasId], ...newDot };
        newCanvases[canvasId] = newCanvas;
        setCanvases(newCanvases);
    }, [animatedPosition, canvases, props.name, setCanvases])




    useSpring({
        posX: position[0], posY: position[1],
        config: { mass: 5, tension: 1000, friction: 50, precision: 0.0000001 },
        pause: !(randomNotesRunning[canvasId] || dragAnimationRunning.current || switchingCanvas),
        onRest: () => {
            saveCurrentPositionInGlobalState(canvasId);
            dragAnimationRunning.current = false;
            setSwitchingCanvas(false);
            if (randomNotesRunning[canvasId] && !dragging) {
                let x = Math.random() * viewport.width - viewport.width / 2;
                let y = Math.random() * viewport.height - viewport.height / 2;
                setPosition([x, y, 0]);
            }
        },
        onChange: ({ posX, posY }) => {
            const [left, right, top, bottom] = bounds;
            setAnimatedPosition([
                clamp(posX, left, right),
                clamp(posY, top, bottom),
                0]);
        }
    })

    useEffect(() => {
        if (randomNotesRunning[canvasId]) {
            let x = Math.random() * viewport.width - viewport.width / 2;
            let y = Math.random() * viewport.height - viewport.height / 2;
            setPosition([x, y, 0]);
        }
    }, [randomNotesRunning, canvasId, viewport.height, viewport.width])


    // when canvas changes, change position accordingly
    useEffect(() => {
        if (canvasId !== oldCanvasId.current) {
            saveCurrentPositionInGlobalState(oldCanvasId.current);
            setSwitchingCanvas(true);
            oldCanvasId.current = canvasId;
            setPosition([
                canvases[canvasId][props.name].x,
                canvases[canvasId][props.name].y,
                0
            ])
        }
    }, [setSwitchingCanvas, saveCurrentPositionInGlobalState, canvasId, canvases, props.name])

    // drag event handlers bound to the mesh
    const bind = useGesture({
        onDragStart: () => {
            setDragging(true);
            // position to be added to the current movement onDrag
            let position = ref.current.position.clone();
            beforeDragPosition.current =
                [position.x, position.y]

        },
        onDrag: (({ movement: [mx, my] }) => {
            const [left, right, top, bottom] = bounds;
            dragAnimationRunning.current = true;
            setPosition([
                clamp(beforeDragPosition.current[0] + mx / aspect, left, right),
                clamp(- my / aspect + beforeDragPosition.current[1], top, bottom),
                0]);
        }),
        onDragEnd: () => {
            setDragging(false);
            saveCurrentPositionInGlobalState(canvasId);
        }
    }, { pointerEvents: true, eventOptions: { capture: true } });

    // changeParameters: useEffect called when position changes (e.g.) on drag event
    useEffect(() => {
        if (!musicCtrl[canvasId]) return;
        camera.updateMatrixWorld();
        let pos = ref.current.position.clone();
        pos.project(camera);
        if (props.name === 'effectSphere') {
            musicCtrl[canvasId].setParameterEffect(pos.x, pos.y);
        } else if (props.name === 'synthSphere') {
            musicCtrl[canvasId].setParameterSynth(pos.x, pos.y);
        } else if (props.name === 'musicSphere') {
            musicCtrl[canvasId].setParameterMusic(pos.x, pos.y);
        }
    }, [animatedPosition, camera, canvasId, musicCtrl, props.name, ref])



    return (
        <a.mesh
            {...props}
            position={animatedPosition}
            {...bind()}
            ref={ref}
        >
            <sphereGeometry
                attach="geometry"
                args={[1, 16, 16]}
            />
            <meshPhongMaterial
                attach="material"
                dithering
                color={props.color}
                emissive={dragging ? props.color : 'black'}
            />
        </a.mesh>
    );

})

export default Dot;