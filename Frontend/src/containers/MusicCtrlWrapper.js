import React, { useEffect, useRef } from 'react'
import { useGlobalState } from "../GlobalState"
import { MusicCtrl } from "../components/toneJS/musicCtrl"
import { Marimba } from "../components/toneJS/Marimba";
import { Harp } from "../components/toneJS/Harp"

//this container is designed to initialize musicCtrl Objetcs and set a global state variable after initialization.

export default function MusicCtrlWrapper() {

    //global
    const [, setToneIsInitialized] = useGlobalState("toneIsInitialized")
    const [musicCtrl, setMusicCtrl] = useGlobalState('musicCtrl');

    const countInitialized = useRef(0);

    useEffect(() => {
        setMusicCtrl([new Marimba(), new MusicCtrl(), new Harp()]);
    }, [setMusicCtrl])

    useEffect(() => {
        for (const object of musicCtrl) {
            object.initialize().then(() => {
                countInitialized.current += 1;
                if (countInitialized.current === 3) {
                    setToneIsInitialized(true);
                }
            }).catch(e => {
                console.error(`error while initializing:`)
                console.error(e)
            }
            )
        }
    }, [musicCtrl, countInitialized, setToneIsInitialized])

    return <>
    </>
}