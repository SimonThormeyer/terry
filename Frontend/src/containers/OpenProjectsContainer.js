import React, { useEffect } from 'react';
import OpenProjects from '../components/OpenProjects'
import { ReactComponent as DeleteIcon } from '../img/delete.svg';
import { useGlobalState } from "../GlobalState";
import { useParams, Link } from "react-router-dom";

// this is the OpenProject Component just with the possibility to close it
export default function OpenProjectContainer() {
    const [, setOverlayIsOpen] = useGlobalState('overlayIsOpen');
    const [toneIsInitialized,] = useGlobalState("toneIsInitialized")
    const { user, projectName } = useParams();

   

    // setOverlay is Open true when Component mounts, false when it unmounts
    useEffect(() => {
        setOverlayIsOpen(true);
        return () => {
            setOverlayIsOpen(false);
        }
    }, [setOverlayIsOpen])

    return <>
        {toneIsInitialized && <>
            <div className="saveOpenUnderlay"></div>
            <div id="openOverlay">
                <Link as='li' to='/'>
                    <DeleteIcon id="closeOpenOverlay" title="close overlay"/>
                </Link>
                <OpenProjects user={user} projectName={projectName} />
            </div>
        </>}
    </>


}