import React, {useState, forwardRef, useRef, useEffect, useCallback} from 'react';
import {useGlobalState} from "../../GlobalState.js"
import {useThree} from 'react-three-fiber'
import {useGesture} from "react-use-gesture"
import {useSpring} from 'react-spring'
import {a} from "@react-spring/three"
import useStore from '../../store'

import {clamp} from 'lodash'

const Dot = forwardRef((props, ref) => {

    //global
    const [canvases, setCanvases] = useGlobalState("canvases");
    const [canvasId] = useGlobalState('canvasId');
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [randomNotesRunning,] = useGlobalState('randomNotesRunning');

    // local
    const [dragging, setDragging] = useState(false);
    const dragAnimationRunning = useRef(false);
    const [animatedPosition, setAnimatedPosition] = useState([canvases[canvasId][props.name].x, canvases[canvasId][props.name].y, 0]);
    const [position, setPosition] = useState(animatedPosition);
    const beforeDragPosition = useRef(
        [canvases[canvasId][props.name].x, canvases[canvasId][props.name].y])
    const {camera, size, viewport} = useThree();
    const aspect = size.width / viewport.width;
    const oldCanvasId = useRef(0);
    const [loadingDotPosition, setLoadingDotPosition] = useState(false);
    // bounds for dot positions that are used while dragging and animating 
    const bounds = [-viewport.width / 2, viewport.width / 2, -viewport.height / 2, viewport.height / 2];

    // store.js
    const hasLoaded = useStore(state => state.functions.dotHasLoaded);
    const loadingProject = useStore(state => state.loadingProject);


    // save current dot position into canvas with the given id
    const saveCurrentPositionInGlobalState = useCallback((canvasId) => {
        let newCanvases = Array.from(canvases);
        let newDot = {};
        newDot[props.name] = {
            x: animatedPosition[0],
            y: animatedPosition[1]
        }
        let newCanvas = {...canvases[canvasId], ...newDot};
        newCanvases[canvasId] = newCanvas;
        setCanvases(newCanvases);
    }, [animatedPosition, canvases, props.name, setCanvases])


    useSpring({
        posX: position[0], posY: position[1],
        config: {
            mass: 5,
            tension: (dragAnimationRunning.current || loadingDotPosition) ? 1000 : randomNotesRunning[canvasId] ? 20 : 1000,
            friction: 50,
            precision: 0.01
        },

        // position change will be canceled or not be exectued if this is true
        pause: !(randomNotesRunning[canvasId] || dragAnimationRunning.current || loadingDotPosition || !loadingProject),
        onRest: () => {
            saveCurrentPositionInGlobalState(canvasId);
            dragAnimationRunning.current = false;
            setLoadingDotPosition(false);
            hasLoaded();
            if (randomNotesRunning[canvasId] && !dragging) {
                let x = Math.random() * viewport.width - viewport.width / 2;
                let y = Math.random() * viewport.height - viewport.height / 2;
                setPosition([x, y, 0]);
            }
        },
        onChange: ({posX, posY}) => {
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
        } else {
           let posAfterRandomNotes = ref.current.position.clone();
           setPosition([posAfterRandomNotes.x, posAfterRandomNotes.y, 0])
        }
    }, [randomNotesRunning, canvasId, viewport.height, viewport.width, ref])

    // when canvas changes, change position accordingly
    useEffect(() => {
        let switchingCanvas = (canvasId !== oldCanvasId.current)
        if (switchingCanvas || loadingProject) {
            if (switchingCanvas) saveCurrentPositionInGlobalState(oldCanvasId.current);
            setLoadingDotPosition(true);
            oldCanvasId.current = canvasId;
            setPosition([
                canvases[canvasId][props.name].x,
                canvases[canvasId][props.name].y,
                0
            ])
        }
    }, [loadingProject, setLoadingDotPosition, saveCurrentPositionInGlobalState, canvasId, canvases, props.name])

    // drag event handlers bound to the mesh
    const bind = useGesture({
        onDragStart: () => {
            setDragging(true);
            // position to be added to the current movement onDrag
            let position = ref.current.position.clone();
            beforeDragPosition.current =
                [position.x, position.y]

        },
        onDrag: (({movement: [mx, my]}) => {
            const [left, right, top, bottom] = bounds;
            dragAnimationRunning.current = true;
            setPosition([
                clamp(beforeDragPosition.current[0] + mx / aspect, left, right),
                clamp(-my / aspect + beforeDragPosition.current[1], top, bottom),
                0]);
        }),
        onDragEnd: () => {
            setDragging(false);
            saveCurrentPositionInGlobalState(canvasId);
        }
    }, {pointerEvents: true, eventOptions: {capture: true}});

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