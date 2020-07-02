import React, { useState, forwardRef, useRef, useEffect } from 'react';
import { useGlobalState } from "../../GlobalState.js"
import { useFrame, useThree } from 'react-three-fiber'
import { useGesture } from "react-use-gesture"
import * as THREE from "three";

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

    //--RANDOM MOVING DOTS--//
    let randomDirection = new THREE.Vector3((2 * Math.random() - 1) * 0.1, (2 * Math.random() - 1) * 0.1, 0);


    useFrame(() => {
        //needs to be toggled on and off
        if (randomNotesRunning) {
            moveRandomDots();
        }
    });


    function changeDirection() {
        //right side or left side
        if (ref.current.position.x > 20 || ref.current.position.x < -20) {
            randomDirection.set(-randomDirection.x, (2 * Math.random() - 1) * 0.1, 0);
        }
        //upper or lower bar
        else if (ref.current.position.y > 9 || ref.current.position.y < -9) {
            randomDirection.set((2 * Math.random() - 1) * 0.1, -randomDirection.y, 0);
        }
    }

    function moveRandomDots() {

        camera.updateMatrix();
        camera.updateMatrixWorld();
        let frustum = new THREE.Frustum();
        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

        //
        ref.current.translateX(randomDirection.x);
        ref.current.translateY(randomDirection.y);

        // Your 3d point to check
        if (!frustum.containsPoint(ref.current.position.clone())) {
            changeDirection();
        }
    }

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