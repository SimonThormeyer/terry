import React, { useEffect } from 'react'
import Canvas from '../components/threeJS/canvas';
import { useGlobalState } from "../GlobalState.js"
import { useTransition, a } from 'react-spring'

const canvases = [
    ({ style }) => <a.div style={{...style}} ><Canvas /></a.div>,
    ({ style }) => <a.div style={{...style}} ><Canvas /></a.div>,
    ({ style }) => <a.div style={{...style}} ><Canvas /></a.div>
]

const items = []

const CanvasContainer = () => {

    const [id,] = useGlobalState('canvasId');

    const transitions = useTransition(items, {
      from: { opacity: 0,},
      enter: { opacity: 1,},
      leave: { opacity: 0,},
    })

    useEffect(() => {
        items.pop()
        items[0] = canvases[id];
    },[id])

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
                    console.log(style)
                    return <a.div style={style}>{<Item style={style}></Item>}</a.div>
                  })
            }
      
        </div>
}

export default CanvasContainer;