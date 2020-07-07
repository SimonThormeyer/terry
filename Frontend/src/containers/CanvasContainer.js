import React, { useEffect, useRef } from 'react'
import Canvas from '../components/threeJS/canvas';
import { useGlobalState } from "../GlobalState.js"
import { useTransition, a } from 'react-spring'

const canvases = [
    ({ style }) => <a.div style={{ ...style }} ><Canvas /></a.div>,
    ({ style }) => <a.div style={{ ...style }} ><Canvas /></a.div>,
    ({ style }) => <a.div style={{ ...style }} ><Canvas /></a.div>
]


const CanvasContainer = () => {

    const [id,] = useGlobalState('canvasId');

    const transitions = useTransition([canvases[id]], {
        from: { transform: 'translate3d(100%,0,0)' },
        enter: { transform: 'translate3d(0%,0,0)' },
        leave: { transform: 'translate3d(-50%,0,0)' },

        expires: 500,
    })
    


    return <div className="simple-trans-main">

        {/* {transitions.map(({ item, props, key }) => {
            const Cvs = canvases[item]
            return <Cvs key={key} style={props} />
            console.log(transitions)
            return <div/>
        })} */}
        {
            transitions((style, Item) => {
                // 3. Render each item
                return <a.div style={style}>{<Item style={style}></Item>}</a.div>
            })
        }

    </div>
}

export default CanvasContainer;