import { useDirectus } from "../../../../../context/DirectusContext";
import { useEffect, useState } from "react";
import { useStops } from "../../../../../context/DataContext";


const LoadTripScreenStyle = `

    .mobile-trip-wrapper {
        width: 100vw;
        height: 100vh;
        margin: calc(var(--gap-medium) * -1);
        display: flex;
        flex-direction: column;
        padding: var(--gap-medium);
        box-sizing: border-box;
        gap: var(--gap-medium);
        background-color: var(--color-bg);
        overflow: hidden;
    }

    .page-header {
        margin-bottom: var(--gap-small);
        flex-shrink: 0;
    }

    .page-title {
        font-size: var(--font-size-xxlarge);
        font-family: var(--font-main);
        color: var(--color-accent);
        text-transform: uppercase;
        letter-spacing: 2px;
        margin: 0;
    }

    .trip-list {
        display: flex;
        flex-direction: column;
        gap: var(--gap-medium);
        flex: 1;
        overflow-y: auto;
        padding-bottom: var(--gap-medium);
    }

    .trip-card {
        width: 100%;
        padding: var(--gap-medium);
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        display: flex;
        flex-direction: column;
        gap: var(--gap-small);
        cursor: pointer;
        transition: transform 0.2s, border-color 0.2s;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    }

    .trip-card:active {
        transform: scale(0.98);
        border-color: var(--color-accent);
    }

    .trip-card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .trip-name {
        font-size: var(--font-size-large);
        color: var(--color-primary);
        font-weight: bold;
        font-family: var(--font-main);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .status-date-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }

    .trip-status {
        font-size: 11px;
        text-transform: uppercase;
        padding: 6px 10px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        color: #aaa;
        letter-spacing: 1px;
        font-weight: bold;
    }

    .trip-status.published {
        color: #4ade80;
        border-color: rgba(74, 222, 128, 0.3);
        background: rgba(74, 222, 128, 0.1);
    }

    .trip-status.draft {
        color: #fb923c;
        border-color: rgba(251, 146, 60, 0.3);
        background: rgba(251, 146, 60, 0.1);
    }

    .trip-status.archived, .trip-status.archive {
        color: #94a3b8;
        border-color: rgba(148, 163, 184, 0.3);
        background: rgba(148, 163, 184, 0.1);
    }

    .trip-date {
        font-size: var(--font-size-xsmall);
        color: #888;
        font-family: var(--font-main);
    }

    .trip-meta {
        display: flex;
        gap: var(--gap-medium);
        color: #aaa;
        font-size: var(--font-size-xsmall);
    }

    .meta-item {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    .meta-label {
        color: #666;
        text-transform: uppercase;
        font-size: 10px;
    }

    .trip-actions {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--gap-xsmall);
        border-top: 1px solid rgba(255,255,255,0.05);
        padding-top: var(--gap-small);
    }

    .delete-btn {
        background: transparent;
        border: 1px solid #444;
        color: #888;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 10px;
        text-transform: uppercase;
        font-weight: bold;
        transition: all 0.2s;
    }

    .delete-btn:hover {
        border-color: var(--color-accent);
        color: var(--color-accent);
    }

    .back-button {
        width: 100%;
        margin-top: var(--gap-small);
        flex-shrink: 0;
    }

`;

const LoadTripScreen = () => {

    const { loadTrips, loadTripData, deleteTripByID, setCurrentTrip  } = useDirectus();
    const [tripSelections, setTripSelections] = useState([]);
    const {setSelectedTrip, setStops, setRoute} = useStops();

    useEffect(() => {
        const loadAll = async () => {
            let trips = await loadTrips();
            setTripSelections(trips || []);
        };
        loadAll();
    }, []);

    const deleteTrip = async (tripId: string) => {
        await deleteTripByID(tripId);
        setSelectedTrip(null);
        setStops([]);
        setRoute(null);
        setCurrentTrip(null);

        const reload = async () => {
            let trips = await loadTrips();
            setTripSelections(trips || []);
        };
        reload();
    }


    console.log(tripSelections);

    return (
        <div className="mobile-trip-wrapper">
            <style>{LoadTripScreenStyle}</style>

            <header className="page-header">
                <h1 className="page-title">Load Trip</h1>
            </header>

            <div className="trip-list">
                {tripSelections.map((trip: any) => (
                    <div className='trip-card' key={trip.id}>
                        <div className="trip-card-header">
                            <span className="trip-name">{trip.trip_name}</span>
                        </div>
                        <div className="status-date-row">
                            <span className={`trip-status ${trip.status?.toLowerCase()}`}>{trip.status}</span>
                            <span className="trip-date">{trip.start_date ? new Date(trip.start_date).toLocaleDateString() : '-'}</span>
                        </div>

                        <div className="trip-meta">
                            <div className="meta-item">
                                <span className="meta-label">Dist:</span>
                                <span>{Number(trip.distance).toFixed(1)} mi</span>
                            </div>
                            <div className="meta-item">
                                <span className="meta-label">Time:</span>
                                <span>{trip.ride_time ? (
                                    (() => {
                                        const d = Number(trip.ride_time);
                                        const h = Math.floor(d / 3600);
                                        const m = Math.floor(d % 3600 / 60);
                                        return h > 0 ? `${h}h ${m}m` : `${m}m`;
                                    })()
                                ) : "-"}</span>
                            </div>
                        </div>

                        <div className="trip-actions">
                            <button className='delete-btn' onClick={() => deleteTrip(trip.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            <button className='std-button back-button' onClick={() => window.history.back()}>Back to Dashboard</button>
        </div>
    )
}

export default LoadTripScreen;