import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { useDirectus } from '../../../../../../context/DirectusContext';

const LOAD_TRIP_STYLE=`
    .load-trip-modal{
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        height: 80%;
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--gap-small);
        box-sizing: border-box;
        z-index: 100;
        box-shadow: -4px 0 15px rgba(0,0,0,0.5);
        gap: var(--gap-small);
    }

    .load-trip-header{
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: top;
        justify-content: space-between;
        padding: var(--gap-small);
        box-sizing: border-box;
    }

    .load-trip-close-btn{
        height: 50px;
        width: 50px;
        border-radius: 10px;
        background-color: var(--color-accent);
        border: none;
    }

    .load-trip-content{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: var(--gap-small);
        box-sizing: border-box;
        gap: var(--gap-small);
    }
`

const LoadTripModal = ({setModal}: {setModal: (show: boolean) => void}) => {

    const {loadTrips} = useDirectus();
    
    useEffect(() => {
        const loadAll = async () => {
            let trips = await loadTrips();
            console.log(trips);
        };
        loadAll();
    }, []);


    return createPortal(
        <div className="load-trip-modal">
            <style>{LOAD_TRIP_STYLE}</style>
            <div className='load-trip-header'>
                <h3>Load Trip</h3>
                <button className="std-button" onClick={() => setModal(false)}>
                    X
                </button>
            </div>
            <div className="load-trip-content">
                <h1>Load Trip Content</h1>
            </div>
            <div className="load-trip-footer">
                <button className="std-button" onClick={() => setModal(false)}>
                    Cancel
                </button>
            </div>
        </div>,
        document.body
    )
}

export default LoadTripModal;