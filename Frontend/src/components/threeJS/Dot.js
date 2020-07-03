import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { useGlobalState } from "../../GlobalState.js"
import { useThree } from 'react-three-fiber'
import { useGesture } from "react-use-gesture"
import { clamp } from 'lodash'

const Dot = forwardRef((props, ref) => {

    //global
    const [canvases, setCanvases] = useGlobalState("canvases");
    const [canvasId] = useGlobalState('canvasId');
    const [musicCtrl,] = useGlobalState('musicCtrl');

    // local
    const [dragging, setDragging] = useState(false);
    const [position, setPosition] = useState(
        [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y, 0]);
    const beforeDragPosition = useRef(
        [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y])
    const { camera, size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    // when canvas changes, change position accordingly
    useEffect(() => {
        setPosition([
            canvases[canvasId][props.name].x,
            canvases[canvasId][props.name].y,
            0
        ])
    }, [canvasId, canvases, props.name])


    const bounds = [-viewport.width / 2, viewport.width / 2, -viewport.height / 2, viewport.height / 2]
    // drag event handlers bound to the mesh
    const bind = useGesture({
        onDragStart: () => {
            setDragging(true);
            // position to be added to the current movement onDrag
            beforeDragPosition.current =
                [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y]
        },
        onDrag: (({ movement: [x, y] }) => {
            const [, , z] = position;
            const [left, right, top, bottom] = bounds;
            setPosition([
                clamp(beforeDragPosition.current[0] + x / aspect, left, right),
                clamp(- y / aspect + beforeDragPosition.current[1], top, bottom),
                z]);
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

        // useEffect called when position changes (e.g.) on drag event - changes musicCtrl parameters
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
        }, [camera, canvasId, musicCtrl, props.name, ref, position])

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