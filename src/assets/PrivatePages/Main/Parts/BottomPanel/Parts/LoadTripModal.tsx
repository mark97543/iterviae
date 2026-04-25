import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { useDirectus } from '../../../../../../context/DirectusContext';
import { useStops } from '../../../../../../context/DataContext';

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

    .std-table {
        width: 100%;
        border-collapse: collapse;
        font-family: var(--font-main);
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
    }

    .std-table thead {
        background-color: rgba(0, 0, 0, 0.4);
    }

    .std-table th {
        padding: var(--gap-medium);
        text-align: left;
        color: var(--color-primary);
        font-size: var(--font-size-medium);
        font-weight: bold;
        border-bottom: 2px solid var(--color-accent);
        white-space: nowrap;
    }

    .std-table td {
        padding: var(--gap-small) var(--gap-medium);
        border-bottom: 1px solid var(--color-border);
    }

    .std-table tbody tr {
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .std-table tbody tr:nth-child(even) {
        background-color: rgba(255, 255, 255, 0.03);
    }

    .std-table tbody tr:hover {
        background-color: rgba(255, 255, 255, 0.08);
    }

    .std-table button {
        background: none;
        border: none;
        color: var(--color-primary);
        font-family: var(--font-main);
        font-size: var(--font-size-medium);
        cursor: pointer;
        text-align: left;
        padding: var(--gap-xsmall) 0;
        transition: color 0.2s ease;
    }
    
    .std-table button:hover {
        color: var(--color-accent);
    }
`

const LoadTripModal = ({setModal}: {setModal: (show: boolean) => void}) => {

    const {loadTrips, loadTripData} = useDirectus();
    const [tripSelections, setTripSelections] = useState([]);
    const {setSelectedTrip, selectedTrip, setStops} = useStops();

   
    useEffect(() => {
        const loadAll = async () => {
            let trips = await loadTrips();
            setTripSelections(trips);
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
                <table className="std-table">
                    <thead>
                        <tr>
                            <th>Trip Name</th>
                            {/* Placeholder headers for future columns */}
                            <th>Status</th>
                            <th>Date Created</th>
                            <th></th> {/* Empty header for delete button */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tripSelections.map((trip: any) => (
                                <tr 
                                    key={trip.id} 
                                    onClick={async () => {
                                        setSelectedTrip(trip.id);
                                        let data = await loadTripData(trip.id);
                                        if (data) setStops(data.stop);
                                        setModal(false);
                                    }}
                                >
                                    <td>{trip.trip_name}</td>
                                    {/* Placeholder data cells for future columns*/}
                                    <td>Draft</td>
                                    <td>{new Date().toLocaleDateString()}</td>
                                    <td>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevents row click when clicking delete
                                                console.log('Delete clicked for:', trip.trip_name); // TODO: Implement Delete Trip Functionality
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

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