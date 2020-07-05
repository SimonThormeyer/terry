import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { useGlobalState } from "../../GlobalState.js"
import {
    // useFrame, 
    useThree
} from 'react-three-fiber'
import { useGesture } from "react-use-gesture"
// import * as THREE from "three";
// import { sample } from 'lodash';
import { useSpring } from 'react-spring'
import { a } from "@react-spring/three"


const Dot = forwardRef((props, ref) => {

    //global
    const [canvases, setCanvases] = useGlobalState("canvases");
    const [canvasId] = useGlobalState('canvasId');
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [randomNotesRunning,] = useGlobalState('randomNotesRunning');

    // local
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState(
        [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y, 0]);
    const [animatePosition, setAnimatePosition] = useState(position);
    const beforeDragPosition = useRef(
        [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y])
    const { camera, size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const timeout = useRef();
    const oldCanvasId = useRef(0);
    const switchingCanvas = useRef(false);

    const refreshCanvases = () => {
        let newCanvases = Array.from(canvases);
        let newDot = {};
        newDot[props.name] = {
            x: position[0],
            y: position[1]
        }
        let newCanvas = { ...canvases[canvasId], ...newDot };
        newCanvases[canvasId] = newCanvas;
        setCanvases(newCanvases);
    }

    const { posX, posY } = useSpring({
        posX: animatePosition[0], posY: animatePosition[1],
        // immediate when dragging, when switching canvas 500 ms, else (during random notes) 5000
        onRest: () => {
            refreshCanvases()
        },
        onChange: ({ posX, posY }) => {
            setPosition([posX, posY, 0]);
        }
    })

    useEffect(() => {
        let loopPosition = () => {
            let x = Math.random() * viewport.width - viewport.width / 2
            let y = Math.random() * viewport.height - viewport.height / 2
            setAnimatePosition([x, y, 0]);
            if (randomNotesRunning) {
                timeout.current = setTimeout(() => loopPosition(), 5000)
            }
        }
        if (randomNotesRunning) {
            posX.start({ config: {duration: 5000 }});
            posY.start({ config: {duration: 5000 }});
            loopPosition();

        } else {
            clearTimeout(timeout.current);
            posX.start({ pause: true });
            posY.start({ pause: true });
        }

    }, [posX, posY, randomNotesRunning, viewport.height, viewport.width])


    // when canvas changes, change position accordingly
    useEffect(() => {
        if (canvasId !== oldCanvasId.current) {
            switchingCanvas.current = true;
            oldCanvasId.current = canvasId;
            posX.start({ config: {duration: 500 }});
            posY.start({ config: {duration: 500 }});
            setAnimatePosition([
                canvases[canvasId][props.name].x,
                canvases[canvasId][props.name].y,
                0
            ])
            switchingCanvas.current = false;
            if (randomNotesRunning) {
                let x = Math.random() * viewport.width - viewport.width / 2
                let y = Math.random() * viewport.height - viewport.height / 2
                setAnimatePosition([x, y, 0]);
            }
        } else { switchingCanvas.current = false; }
    }, [posX, posY, canvasId, canvases, props.name, randomNotesRunning, viewport.width, viewport.height])



    // drag event handlers bound to the mesh
    const bind = useGesture({
        onDragStart: () => {
            setDragging(true);
            posX.start({ config: {duration: 0 }});
            posY.start({ config: {duration: 0 }});
            // position to be added to the current movement onDrag
            let position = ref.current.position.clone();
            beforeDragPosition.current =
                [position.x, position.y]

        },
        onDrag: (({ movement: [mx, my] }) => {
            setPosition([beforeDragPosition.current[0] + mx / aspect, - my / aspect + beforeDragPosition.current[1], 0]);
            setAnimatePosition([beforeDragPosition.current[0] + mx / aspect, - my / aspect + beforeDragPosition.current[1], 0]);
        }),
        onDragEnd: () => {
            setDragging(false);
            refreshCanvases();
            posX.start({ config: {duration: 5000 }});
            posY.start({ config: {duration: 5000 }});
            if (randomNotesRunning) {
                let x = Math.random() * viewport.width - viewport.width / 2
                let y = Math.random() * viewport.height - viewport.height / 2
                setAnimatePosition([x, y, 0]);
            }
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
    }, [position, camera, canvasId, musicCtrl, props.name, ref])



    return (
        <a.mesh
            {...props}
            position={position}
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