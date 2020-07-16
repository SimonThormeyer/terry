import React, { useState, useEffect, useCallback } from 'react';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css';
import { ReactComponent as SideMenuIcon } from '../img/sidemenu.svg';
import { ReactComponent as SaveIcon } from '../img/save.svg';
import { ReactComponent as Helpicon } from '../img/help.svg';
import { ReactComponent as RecordStopIcon } from '../img/recordStop.svg';
import { ReactComponent as OpenIcon } from '../img/open.svg';
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { ReactComponent as RecordIcon } from '../img/record.svg';
import { ReactComponent as DownloadIcon } from '../img/download.svg';
import { ReactComponent as LogoIcon } from '../img/logo.svg';
import { ReactComponent as MixerIcon } from '../img/mixer.svg';
import SaveProject from './SaveProject';
import { useGlobalState } from "../GlobalState";
import { Link } from "react-router-dom";




function SideMenu() {

    //global 
    const [, setOverlayIsOpen] = useGlobalState('overlayIsOpen');
    const [musicCtrl,] = useGlobalState('musicCtrl');
    const [sideMenu, setSideMenu] = useGlobalState('sideMenu');
    const [, setActiveHelpDialogue] = useGlobalState("activeHelpDialogue");
    const [openSaveHelpIcon, setOpenSaveHelpIcon] = useGlobalState("openSaveHelpIcon");
    const [sideMenuUnderlay, setSideMenuUnderlay] = useGlobalState("sideMenuUnderlay");
    const [record, setRecord] = useGlobalState("record");
    const [trackVolumes, setTrackVolumes] = useGlobalState("trackVolumes");
    const [toneIsInitialized,] = useGlobalState('toneIsInitialized');



    //local
    const [recordOverlay, setRecordOverlay] = useState(false);
    const [saveOverlay, setSaveOverlay] = useState(false);
    const [sideMenuIcon, setSideMenuIcon] = useState(true);
    const [mixerOverlay, setMixerOverlay] = useState(false);
    const [useChromeOverlay, setUseChromeOverlay] = useState(false);



    let isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);


    // set the global state 'overlayIsOpen' to true if an overlay is open
    useEffect(() => {
        setOverlayIsOpen(saveOverlay || recordOverlay || mixerOverlay);
    }, [saveOverlay, recordOverlay, mixerOverlay, setOverlayIsOpen])


    useEffect(() => {

    })

    //fade out side menu icons (open, save, help) when record is active
    const fadeOpenSaveHelp = () => {
        let open = document.getElementById("openIcon");
        let save = document.getElementById("saveIcon");
        let help = document.getElementById("helpIcon");
        open.style.opacity = 0;
        save.style.opacity = 0;
        help.style.opacity = 0;
        setTimeout(() => {
            setOpenSaveHelpIcon(false);
        }, 500);
    }



    const helpProjectFunction = () => {
        setActiveHelpDialogue("canvas");
    }

    const recordFunction = () => {
        musicCtrl[0].startStopRecorder()
    }

    const downloadFunction = () => {
        musicCtrl[0].saveRecording()
    }

    // save a value for a track in global state
    const setTrackVolume = useCallback((track, percentage) => {
        let newArray = Array.from(trackVolumes);
        newArray[track] = percentage;
        setTrackVolumes(newArray);
    }, [trackVolumes, setTrackVolumes])

    // set volumes to values from global state
    useEffect(() => {
        if (!toneIsInitialized) return;
        for (let i = 0; i < musicCtrl.length; i++)
            musicCtrl[i].setVolume(trackVolumes[i] / 100);
    }, [toneIsInitialized, musicCtrl, trackVolumes])



    return (
        <>
            {sideMenu &&
                <>
                    {/* if record is active, the side menu may not be closed, so the stop record button is always reachable. */}
                    {sideMenuUnderlay &&
                        <div id="closeSideMenuDiv" onClick={() => { setSideMenu(false) }}></div>
                    }
                    <div id="sideMenuIcons">

                    {record ? <>
                        {isChromeBrowser ?
                            <RecordIcon id="recordbutton" title="record" onClick={() => { setSideMenuUnderlay(false); setRecord(false); fadeOpenSaveHelp(); recordFunction(); setSideMenuIcon(false) }} /> :
                            <RecordIcon id="recordbutton" title="record" onClick={() => { setUseChromeOverlay(true) }} />
                        }
                        <MixerIcon id="mixerIcon" title="mixer" onClick={() => { setSideMenu(false); setMixerOverlay(true) }} />

                        </> : <>
                                <RecordStopIcon id="stoprecordbutton" title="stop record" onClick={() => { setSideMenu(false); setRecordOverlay(true); setRecord(true); setSideMenuIcon(true); recordFunction() }} />
                                <MixerIcon id="mixerIcon" title="mixer" onClick={() => { setMixerOverlay(true) }} />
                                <MixerIcon id="mixerIcon" title="mixer" onClick={() => { setMixerOverlay(true) }} />
                                <MixerIcon id="mixerIcon" title="mixer" onClick={() => { setMixerOverlay(true) }} />
                                <MixerIcon id="mixerIcon" title="mixer" onClick={() => { setMixerOverlay(true) }} />
                                <MixerIcon id="mixerIcon" title="mixer" onClick={() => { setMixerOverlay(true) }} />
                            </>}
                        {/* if record is active, the other side menu buttons fade out. code below prevents click actions during outfade */}
                        {openSaveHelpIcon && !record ?
                            <>
                                <OpenIcon id="openIcon" title="open project" />
                                <SaveIcon id="saveIcon" title="save and share project" />
                                <Helpicon id="helpIcon" title="help dialogue" />
                            </> :
                            openSaveHelpIcon && <>
                                <Link as='li' to='/open'>
                                    <OpenIcon id="openIcon" title="open project" onClick={() => { setSideMenu(false) }} />
                                </Link>
                                <SaveIcon id="saveIcon" title="save project" onClick={() => { setSideMenu(false); setSaveOverlay(true) }} />

                                <Helpicon id="helpIcon" title="help dialogue" onClick={() => { setSideMenu(false); helpProjectFunction() }} />
                            </>}

                    </div>
                </>
            }
            <div id="sidemenu">
                {/* if record is active, the side menu may not be closed, so the stop record button is always reachable. */}
                {sideMenuIcon ?
                    <SideMenuIcon id="sideMenuIcon" title="side menu" onClick={() => { setOpenSaveHelpIcon(true); setSideMenuUnderlay(true); setSideMenu(!sideMenu) }} /> :
                    <SideMenuIcon id="sideMenuIcon" title="side menu" />
                }
            </div>

            {recordOverlay &&
                <>
                    <div id="underlay"></div>
                    <div id="overlay">

                        <DeleteIcon id="closeOverlay" title="close overlay" onClick={() => { setRecordOverlay(false) }} />
                        <LogoIcon id="logoIcon" />
                        <p>Download your Track?</p>
                        <DownloadIcon id="downloadbutton" title="download your track" onClick={() => { downloadFunction() }} />

                    </div>
                </>
            }

            {useChromeOverlay &&
                <>
                    <div id="underlay"></div>
                    <div id="overlay">

                    <DeleteIcon id="closeOverlay" title="close overlay" onClick={() => { setUseChromeOverlay(false); }} />
                    <p id="useChromeOverlay">Recording is not supported in your browser. For full functionality we recommend the use of Google Chrome.</p>
                    </div>
                </>
            }

            {
                saveOverlay &&
                <>
                    <div className="saveOpenUnderlay"></div>
                    <div id="saveOverlay">
                        <DeleteIcon id="closeSaveOverlay" title="close overlay" onClick={() => { setSaveOverlay(false) }} />
                        <SaveProject />
                    </div>
                </>

            }

            {
                mixerOverlay &&
                <>
                    <div className="saveOpenUnderlay"></div>
                    <div id="saveOverlay">

                        <DeleteIcon id="closeSaveOverlay" title="close overlay" onClick={() => { setMixerOverlay(false) }} />
                        <p id="headerSave">Mixer</p>
                        <div id="mixer">
                            {trackVolumes.map((trackVolume, i) => {
                                return <div key={`volume__${i}`}
                                    id={`volume${i + 1}`}>
                                    <Slider
                                        maxValue={100}
                                        minValue={0}
                                        value={trackVolume}
                                        onChange={value => setTrackVolume(i, value)}
                                        orientation="vertical"
                                    />
                                    <div className='mixerValue'>{trackVolume}</div>
                                </div>
                            })}
                        </div>
                    </div>
                </>
            }


        </>
    );
}

export default SideMenu;