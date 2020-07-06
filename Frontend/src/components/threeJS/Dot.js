import React, { useState, forwardRef, useRef, useEffect, useCallback } from 'react';
import { useGlobalState } from "../../GlobalState.js"
import { useThree } from 'react-three-fiber'
import { useGesture } from "react-use-gesture"
import { useSpring } from 'react-spring'
import { a } from "@react-spring/three"

import { clamp } from 'lodash'

const Dot = forwardRef((props, ref) => {

    //global
    const [canvases, setCanvases] = useGlobalState("canvases");
    const [canvasId] = useGlobalState('canvasId');
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [randomNotesRunning,] = useGlobalState('randomNotesRunning');

    // local
    const [dragging, setDragging] = useState(false);
    const [animatedPosition, setAnimatedPosition] = useState([canvases[canvasId][props.name].x, canvases[canvasId][props.name].y, 0]);
    const [position, setPosition] = useState(animatedPosition);
    const beforeDragPosition = useRef(
        [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y])
    const { camera, size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const oldCanvasId = useRef(0);
    const [switchingCanvas, setSwitchingCanvas] = useState(false);

    // save current dot position into canvas with the given id.
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
        // immediate when dragging, when switching canvas 500 ms, else (during random notes) 5000
        config: { duration: dragging ? 0 : switchingCanvas ? 500 : randomNotesRunning ? 5000 : 0 },
        // pause if none of the states are active that need changes of position
        pause: !(randomNotesRunning || dragging || switchingCanvas),
        onRest: () => {
            saveCurrentPositionInGlobalState(canvasId);
            setSwitchingCanvas(false);
            if (randomNotesRunning && !dragging) {
                let x = Math.random() * viewport.width - viewport.width / 2;
                let y = Math.random() * viewport.height - viewport.height / 2;
                setPosition([x, y, 0]);
            }
        },
        onChange: ({ posX, posY }) => {
            setAnimatedPosition([posX, posY, 0]);
        }
    })

    useEffect(() => {
        if (randomNotesRunning) {
            let x = Math.random() * viewport.width - viewport.width / 2;
            let y = Math.random() * viewport.height - viewport.height / 2;
            setPosition([x, y, 0]);
        }
    }, [randomNotesRunning, viewport.height, viewport.width])


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




    const bounds = [-viewport.width / 2, viewport.width / 2, -viewport.height / 2, viewport.height / 2]
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