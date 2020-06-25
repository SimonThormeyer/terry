import React, { useState, forwardRef, useRef, useEffect } from 'react';
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
    const [position, setPosition] = useState([
        canvases[canvasId][props.name].x,
        canvases[canvasId][props.name].y,
        0
    ]);
    const initialPos = useRef([canvases[canvasId][props.name].x, canvases[canvasId][props.name].y])
    const { camera, size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    useEffect(() => {
        setPosition([
            canvases[canvasId][props.name].x,
            canvases[canvasId][props.name].y,
            0
        ])
        console.log(props.name)
        console.log(canvases[canvasId][props.name])
    }, [canvasId, props.name, canvases])

    const bind = useGesture({
        onDragStart: () => {
            setDragging(true);
        },
        onDrag: (({ offset: [x, y] }) => {
            const [, , z] = position;
            setPosition([initialPos.current[0] + x / aspect, -(initialPos.current[1] + y) / aspect, z]);
            changeParameters();
        }),
        onDragEnd: () => {
            console.log(`drag end`);
            canvases[canvasId][props.name].x = position[0];
            canvases[canvasId][props.name].y = position[0];
            setCanvases(Array.from(canvases));
            setDragging(false);
        }
    }, { pointerEvents: true, eventOptions: { capture: true } });

    const changeParameters = () => {
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
    }


    return (
        <>
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
        </>
    );

})

export default Dot;