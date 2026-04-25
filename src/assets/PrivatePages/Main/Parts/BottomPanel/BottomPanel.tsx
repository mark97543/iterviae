import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import NewTripModal from './Parts/NewTripModal';
import {useState} from 'react';
import { useDirectus } from '../../../../../context/DirectusContext';
import EditTripModal from './Parts/EditTripModal';
import LoadTripModal from './Parts/LoadTripModal';

const BOTTOM_PANEL_STYLE=`
    .bottom-panel-wrapper{
        position: fixed;
        bottom: 10px;
        left: calc(50% + 150px);
        transform: translateX(-50%);
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: var(--gap-small);
        box-sizing: border-box;
        z-index: 10;
        box-shadow: -4px 0 15px rgba(0,0,0,0.5);
        gap: var(--gap-small);
    }

    .new-trip-btn{
        height: 50px;
        width: 50px;
        border-radius: 10px;
        background-color: var(--color-accent);
        border: none;
    }
`;

const BottomPanel = () => {
    const [showNewTripModal, setShowNewTripModal] = useState(false);
    const [showEditTripModal, setShowEditTripModal] = useState(false);
    const [showLoadTripModal, setShowLoadTripModal] = useState(false);
    const {currentTrip} = useDirectus()


    





    return(
        <div className="bottom-panel-wrapper">
            <style>{BOTTOM_PANEL_STYLE}</style>
            
            {showNewTripModal && <NewTripModal setModal={setShowNewTripModal}/>}
            {showEditTripModal && <EditTripModal setModal={setShowEditTripModal}/>}
            {showLoadTripModal && <LoadTripModal setModal={setShowLoadTripModal}/>}


            <Tippy content='Edit Trip'>
                <button className="std-button new-trip-btn" disabled={!currentTrip} onClick={() => setShowEditTripModal(!showEditTripModal)}>
                    <img src="./edit.png"/>
                </button>
            </Tippy>

            <Tippy content="New Trip">
                <button className="std-button new-trip-btn" onClick={() => setShowNewTripModal(!showNewTripModal)}>
                    <img src="./new.png"/>
                </button>
            </Tippy>

            <Tippy content="Open Trips">
                <button className="std-button new-trip-btn" onClick={() => setShowLoadTripModal(!showLoadTripModal)}>
                    <img src="./open.png"/>
                </button>
            </Tippy>

        </div>
    )
}

export default BottomPanel;