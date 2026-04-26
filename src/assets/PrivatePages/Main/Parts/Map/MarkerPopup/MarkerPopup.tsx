import { useState, useEffect } from "react";
import { useStops } from "../../../../../../context/DataContext";

const MARKER_POPUP_STYLE=`
    .marker-popup-wrapper {
        width: 240px;
        background: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        z-index: 100;
        box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        padding: 16px;
        color: var(--color-text);
        font-family: var(--font-main);
        position: relative;
        overflow: hidden;
    }

    /* Accent Line */
    .marker-popup-wrapper::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--color-accent);
    }

    /* Hide the default MapLibre close button and styling */
    .maplibregl-popup-content {
        background: none !important;
        border: none !important;
        border-radius: 0 !important;
        box-shadow: none !important;
        padding: 0 !important;
    }
    
    .maplibregl-popup-tip {
        border-top-color: var(--color-surface) !important;
    }

    .marker-popup-edit, .marker-popup-view {
        display: flex;
        flex-direction: column;
        width: 100%;
        box-sizing: border-box;
    }

    .popup-title {
        margin: 0 0 8px 0;
        color: var(--color-primary);
        font-size: var(--font-size-medium);
        font-weight: 600;
        line-height: 1.2;
    }

    .popup-notes {
        margin: 0;
        color: rgba(229, 229, 229, 0.7);
        font-size: var(--font-size-xsmall);
        line-height: 1.4;
    }

    .input-dark {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        color: var(--color-primary);
        width: 100%;
        padding: 8px 10px;
        font-family: var(--font-main);
        font-size: var(--font-size-small);
        box-sizing: border-box;
        transition: var(--transition);
        margin-bottom: 12px;
    }

    .input-dark:focus {
        outline: none;
        border-color: var(--color-accent);
        background: rgba(0, 0, 0, 0.4);
    }

    .input-label {
        font-size: var(--font-size-xxsmall);
        text-transform: uppercase;
        color: rgba(229, 229, 229, 0.5);
        margin-bottom: 4px;
        font-weight: bold;
        letter-spacing: 0.5px;
    }
`;

const MarkerPopup = ({ point, stops, setStops, editMode, deleteWaypointByID }: { point: any, stops: any[], setStops: any, editMode: boolean, deleteWaypointByID: any }) =>{

    const [coordsText, setCoordsText] = useState(`${point.latitude}, ${point.longitude}`);

    const handleCoordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCoordsText(val); // Update UI text instantly

        // Only parse and update map data if it looks like a valid pair
        const parts = val.split(',');
        if (parts.length >= 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) {
                setStops(stops.map((s: any) => s.id === point.id ? { ...s, latitude: lat, longitude: lng } : s));
            }
        }
    }

    // Keep the input text strictly in sync if the marker is dragged
    useEffect(() => {
        setCoordsText(`${point.latitude}, ${point.longitude}`);
    }, [point.latitude, point.longitude]);



    return(
        <div className="marker-popup-wrapper">
            <style>{MARKER_POPUP_STYLE}</style>
            {editMode ? (
                <div className="marker-popup-edit">
                    <span className="input-label">Location Name</span>
                    <input 
                        className="input-dark" 
                        type="text" 
                        value={point.name || ''} 
                        placeholder="e.g. Grand Canyon"
                        onChange={(e) => setStops(stops.map((s: any) => s.id === point.id ? { ...s, name: e.target.value } : s))} 
                    />

                    <span className="input-label">Coordinates (Lat, Long)</span>
                    <input 
                        className="input-dark" 
                        type="text" 
                        value={coordsText} 
                        placeholder="e.g. 38.8951, -77.0369"
                        onChange={handleCoordsChange}
                    />
                    <span className="input-label" style={{marginTop: '4px'}}>Notes</span>
                    <textarea 
                        className="input-dark" 
                        style={{resize: 'none', height: '60px', marginBottom: 0}}
                        value={point.note    || ''} 
                        placeholder="Add details about this stop..."
                        onChange={(e) => setStops(stops.map((s: any) => s.id === point.id ? { ...s, note: e.target.value } : s))} 
                    />
                    <button className="std-button" style={{marginTop: '4px'}} onClick={async () => await deleteWaypointByID(point.id)}>Delete</button>
                </div>
            ) : (
                <div className="marker-popup-view">
                    <h4 className="popup-title">{point.name || 'Waypoint'}</h4>
                    <p className="popup-notes">{Number(point.latitude).toFixed(5)}, {Number(point.longitude).toFixed(5)}</p>
                    <p className="popup-notes">{point.note}</p>
                </div>
            )}
        </div>
    );
}

export default MarkerPopup;

