import React, { useState, forwardRef, useRef, useEffect, useCallback } from 'react';
import { useGlobalState } from "../../GlobalState.js"
import { useThree } from 'react-three-fiber'
import { useGesture } from "react-use-gesture"

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

    // method called when position changes (e.g.) on drag event
    const changeParameters = useCallback(() => {
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
    }, [camera, canvasId, musicCtrl, props.name, ref])

    // when canvas changes, change position accordingly
    useEffect(() => {
        setPosition([
            canvases[canvasId][props.name].x,
            canvases[canvasId][props.name].y,
            0
        ])
        changeParameters();
    }, [canvasId, canvases, props.name, changeParameters])

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
            setPosition([beforeDragPosition.current[0] + x / aspect, - y / aspect + beforeDragPosition.current[1], z]);
            changeParameters();
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