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
    const beforeDragPosition = useRef(
        [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y])
    const { camera, size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    const timeout = useRef();

    const [{ x, y }, set,] = useSpring(() => ({
        config: {
            duration: 1000,
        },
        from: { x: position[0], y: position[1] },
        onFrame: () => {
            setPosition([x.value, y.value, 0]);
        },
        onRest: () => {
            console.log(`x: ${x.value}, y: ${y.value}`);
        }
    }))

    useEffect(() => {
        if (!randomNotesRunning) {
            clearTimeout(timeout.current);
            set({ x: beforeDragPosition.current[0], y: beforeDragPosition.current[1] })
        } else {
            (function loopSet() {
                set({
                    x: Math.random() * viewport.width - viewport.width / 2,
                    y: Math.random() * viewport.height - viewport.height / 2
                })
                timeout.current = setTimeout(loopSet, 1000);
            })();
        }
    }, [randomNotesRunning, set, viewport.width, viewport.height])


    // when canvas changes, change position accordingly
    useEffect(() => {
        setPosition([
            canvases[canvasId][props.name].x,
            canvases[canvasId][props.name].y,
            0
        ])
    }, [canvasId, canvases, props.name, randomNotesRunning])


    // drag event handlers bound to the mesh
    const bind = useGesture({
        onDragStart: () => {
            if (!randomNotesRunning) {
                setDragging(true);
                // position to be added to the current movement onDrag
                let position = ref.current.position.clone();
                beforeDragPosition.current =
                    [position.x, position.y]
            }

        },
        onDrag: (({ movement: [x, y] }) => {
            if (!randomNotesRunning) {
                const [, , z] = position;
                setPosition([beforeDragPosition.current[0] + x / aspect, - y / aspect + beforeDragPosition.current[1], z]);
            }

        }),
        onDragEnd: () => {
            setDragging(false);
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
        <mesh
            {...props}
            position={position} {...bind()}
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
        </mesh>
    );

})

export default Dot;