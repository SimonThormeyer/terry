import React, { useEffect, useRef } from 'react'
import Canvas from '../components/threeJS/canvas';
import { useGlobalState } from "../GlobalState.js"
import { useSpring, a } from 'react-spring'

const canvases = [
    ({ style }) => <a.div style={{ ...style }} ><Canvas id={0} /></a.div>,
    ({ style }) => <a.div style={{ ...style }} ><Canvas id={1} /></a.div>,
    ({ style }) => <a.div style={{ ...style }} ><Canvas id={2} /></a.div>
]


const CanvasContainer = () => {

    const [id,] = useGlobalState('canvasId');


    const { x } = useSpring({
        x: id,
        config: { mass: 5, tension: 1000, friction: 50, precision: 0.0000001 },
    })

    useSpring()

    let showStyle = {
        position: 'fixed',
        width: '100%',
        height: '100%',
        'z-index': '-1'
    }

    const left0 = x.to([0, 2], [0, -window.innerWidth * 2])
    const left1 = x.to([0, 2], [window.innerWidth, -window.innerWidth])
    const left2 = x.to([0, 2], [window.innerWidth * 2, 0])

    return <div className='canvasContainer'>
        {/* x.to([0, 1], [-1.2, 1.2] */}

        <a.div style={{left: left0, top: 0 }} ><Canvas id={0} /></a.div>
        <a.div style={{left: left1, top: 0 }} ><Canvas id={1} /></a.div>
        <a.div style={{left: left2, top: 0 }}><Canvas id={2} /></a.div>

    </div>
}

export default CanvasContainer;