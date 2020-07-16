import React, { useState, useEffect } from 'react';
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



    //local
    const [recordOverlay, setRecordOverlay] = useState(false);
    const [saveOverlay, setSaveOverlay] = useState(false);
    const [openOverlay, setOpenOverlay] = useState(false);
    const [sideMenuIcon, setSideMenuIcon] = useState(true);
    const [mixerOverlay, setMixerOverlay] = useState(false);
    const [volume1, setVolume1] = useState(100);
    const [volume2, setVolume2] = useState(100);
    const [volume3, setVolume3] = useState(100);
    const [useChromeOverlay, setUseChromeOverlay] = useState(false);



    let isChromeBrowser = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);


    // set the global state 'overlayIsOpen' to true if an overlay is open
    useEffect(() => {
        setOverlayIsOpen(saveOverlay || recordOverlay || mixerOverlay);
    }, [saveOverlay, recordOverlay, mixerOverlay, setOverlayIsOpen])



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

    const mixerFunction = (canvas, volume) => {
        musicCtrl[canvas].setVolume(volume);
    }



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
                    <SideMenuIcon id="sideMenuIcon" title="side menu" onClick={() => { setOpenSaveHelpIcon(true); setSideMenuUnderlay(true); setSideMenu(!sideMenu)  }} /> :
                    <SideMenuIcon id="sideMenuIcon" title="side menu" />
                }
            </div>

            {recordOverlay &&
                <>
                    <div id="underlay"></div>
                    <div id="overlay">

                        <DeleteIcon id="closeOverlay" title="close overlay" onClick={() => { setRecordOverlay(false)}} />
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
                            <div id="volume1">
                                <Slider
                                    maxValue={100}
                                    minValue={0}
                                    value={volume1}
                                    onChange={value => { setVolume1(value); mixerFunction(0, value / 100) }}
                                    orientation="vertical"
                                />
                                <div className='mixerValue'>{volume1}</div>
                            </div>

                            <div id="volume2">
                                <Slider
                                    maxValue={100}
                                    minValue={0}
                                    value={volume2}
                                    onChange={value => { setVolume2(value); mixerFunction(1, value / 100) }}
                                    orientation="vertical"
                                />
                                <div className='mixerValue'>{volume2}</div>
                            </div>

                            <div id="volume3">
                                <Slider
                                    maxValue={100}
                                    minValue={0}
                                    value={volume3}
                                    onChange={value => { setVolume3(value); mixerFunction(2, value / 100) }}
                                    orientation="vertical"
                                />
                                <div className='mixerValue'>{volume3}</div>
                            </div>
                        </div>
                    </div>
                </>
            }


        </>
    );
}

export default SideMenu;