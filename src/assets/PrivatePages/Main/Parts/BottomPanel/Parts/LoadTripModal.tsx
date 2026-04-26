import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';
import { useDirectus } from '../../../../../../context/DirectusContext';
import { useStops } from '../../../../../../context/DataContext';
import { getTripDirections } from '../../../valhala';


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
        flex-direction: column;
        align-items: left;
        justify-content: top;
        padding: var(--gap-small);
        box-sizing: border-box;
        gap: var(--gap-small);
        background-color:var(--color-surface)
    }

    .std-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-family: var(--font-main);
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 30px;
        overflow: hidden;
    }

    .std-table th:first-child {
        border-top-left-radius: 28px;
    }
    
    .std-table th:last-child {
        border-top-right-radius: 28px;
    }
    
    .std-table tbody tr:last-child td:first-child {
        border-bottom-left-radius: 28px;
    }
    
    .std-table tbody tr:last-child td:last-child {
        border-bottom-right-radius: 28px;
    }

    .std-table tbody tr:last-child td {
        border-bottom: none;
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
        background-color: transparent;
    }

    .std-table tbody tr:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.3);
    }

    .std-table tbody tr:nth-child(odd) {
        background-color: rgba(255, 255, 255, 0.02);
    }

    .std-table tbody tr:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .std-table tbody tr td:first-child {
        border-left: 3px solid transparent;
        transition: border-left-color 0.2s ease;
    }

    .std-table tbody tr:hover td:first-child {
        border-left-color: var(--color-accent);
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

    const {loadTrips, loadTripData, deleteTripByID, setCurrentTrip} = useDirectus();
    const [tripSelections, setTripSelections] = useState([]);
    const {setSelectedTrip, setStops, setRoute} = useStops();
    const [reload, setReload] = useState(1);

   
    useEffect(() => {
        const loadAll = async () => {
            let trips = await loadTrips();
            setTripSelections(trips || []);
        };
        loadAll();
    }, []);

    useEffect(() => {
        const loadAll = async () => {
            let trips = await loadTrips();
            setTripSelections(trips || []);
        };
        loadAll();
    }, [reload]);

    const deleteTrip = async (tripId: string) => {
        await deleteTripByID(tripId);
        setSelectedTrip(null);
        setStops([]);
        setRoute(null);
        setCurrentTrip(null);
        setReload(reload + 1);
    }


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
                                        let route = await getTripDirections(data.stop);
                                        setRoute(route);
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
                                                deleteTrip(trip.id);
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