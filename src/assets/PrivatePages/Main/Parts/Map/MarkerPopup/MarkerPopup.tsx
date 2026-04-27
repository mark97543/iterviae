import { useState, useEffect } from "react";
import { STOP_TYPES, getStopType } from "../../../../../../constants/StopTypes";
import { useDirectus } from "../../../../../../context/DirectusContext";


const MARKER_POPUP_STYLE=`
    .marker-popup-wrapper {
        width: 320px;
        background: rgba(9, 9, 11, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        z-index: 100;
        box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        padding: 0; /* Removing padding to use internal sections */
        color: var(--color-text);
        font-family: var(--font-main);
        position: relative;
        overflow: hidden;
    }

    .popup-header {
        background: rgba(255, 255, 255, 0.03);
        padding: 16px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .popup-body {
        padding: 16px;
    }

    /* Accent Line */
    .marker-popup-wrapper::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, var(--color-accent), #f97316);
        z-index: 10;
    }

    .popup-title {
        margin: 0;
        color: #fff;
        font-size: 1.1rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .popup-subtitle {
        font-size: 0.7rem;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 4px;
        font-family: monospace;
    }

    .input-group {
        margin-bottom: 15px;
    }

    .input-dark {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #fff;
        width: 100%;
        padding: 10px 12px;
        font-size: 0.85rem;
        box-sizing: border-box;
        transition: all 0.2s ease;
    }

    .input-dark:focus {
        outline: none;
        border-color: var(--color-accent);
        background: rgba(0, 0, 0, 0.5);
        box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.2);
    }

    .input-label {
        font-size: 0.65rem;
        text-transform: uppercase;
        color: var(--color-accent);
        margin-bottom: 6px;
        font-weight: 800;
        letter-spacing: 1px;
        display: block;
    }

    .stay-badge {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        background: rgba(249, 115, 22, 0.1);
        color: var(--color-accent);
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.7rem;
        font-weight: bold;
        border: 1px solid rgba(249, 115, 22, 0.2);
        margin-top: 10px;
    }

    /* Fix for the black-on-black clock icon in dark mode */
    input[type="time"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        opacity: 0.6;
        cursor: pointer;
    }

    input[type="time"]::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
    }

    .btn-delete {
        background: transparent;
        color: #ef4444;
        border: 1px solid rgba(239, 68, 68, 0.3);
        width: 100%;
        padding: 8px;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        margin-top: 5px;
    }

    .btn-delete:hover {
        background: rgba(239, 68, 68, 0.1);
        border-color: #ef4444;
    }
`;

const MarkerPopup = ({ 
    point, 
    stops, 
    setStops, 
    editMode, 
    deleteWaypointByID,
    saveTripByID,
    currentTrip,
    arrivalTime,
    departureTime 
}: { 
    point: any, 
    stops: any[], 
    setStops: any, 
    editMode: boolean, 
    deleteWaypointByID: any,
    saveTripByID: any,
    currentTrip: any,
    arrivalTime?: Date,
    departureTime?: Date
}) =>{

    const [draftPoint, setDraftPoint] = useState({...point});
    const [coordsText, setCoordsText] = useState(`${point.latitude}, ${point.longitude}`);
    const [budgetText, setBudgetText] = useState(point.budget?.toString() || '');
    const [isSaving, setIsSaving] = useState(false);
    
    const stopType = getStopType(draftPoint.type);

    const handleSave = async () => {
        setIsSaving(true);
        // 1. Update the global stops array in DataContext
        const updatedStops = stops.map((s: any) => s.id === point.id ? draftPoint : s);
        setStops(updatedStops);

        // 2. Persist to Directus
        if (currentTrip?.id) {
            await saveTripByID(currentTrip.id, true, updatedStops);
        }
        setIsSaving(false);
    };

    const handleCoordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCoordsText(val);

        const parts = val.split(',');
        if (parts.length >= 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) {
                setDraftPoint({ ...draftPoint, latitude: lat, longitude: lng });
            }
        }
    }

    const formatTime24 = (date?: Date) => {
        if (!date) return "--:--";
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    useEffect(() => {
        setDraftPoint({...point});
    }, [point]);

    useEffect(() => {
        setCoordsText(`${draftPoint.latitude}, ${draftPoint.longitude}`);
    }, [draftPoint.latitude, draftPoint.longitude]);

    useEffect(() => {
        setBudgetText(draftPoint.budget?.toString() || '');
    }, [draftPoint.budget]);

    return(
        <div className="marker-popup-wrapper">
            <style>{MARKER_POPUP_STYLE}</style>
            
            <div className="popup-header">
                <h4 className="popup-title">
                    {stopType.icon} {draftPoint.name || (editMode ? 'Edit Stop' : 'Waypoint')}
                </h4>
                <div className="popup-subtitle">
                    {Number(point.latitude).toFixed(5)}, {Number(point.longitude).toFixed(5)}
                </div>
            </div>

            <div className="popup-body">
                {editMode ? (
                    <div className="marker-popup-edit">
                        <div className="input-group">
                            <span className="input-label">Stop Name</span>
                            <input 
                                className="input-dark" 
                                type="text" 
                                value={draftPoint.name || ''} 
                                placeholder="e.g. Scenic Overlook"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setDraftPoint({ ...draftPoint, name: e.target.value })} 
                            />
                        </div>

                        <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                            <div style={{flex: 1.5}}>
                                <span className="input-label">Type</span>
                                <select 
                                    className="input-dark" 
                                    value={draftPoint.type || 'waypoint'}
                                    onChange={(e) => setDraftPoint({ ...draftPoint, type: e.target.value })}
                                >
                                    {STOP_TYPES.map(type => (
                                        <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {(draftPoint.type === 'start' || draftPoint.type === 'hotel') ? (
                                <div style={{flex: 1}}>
                                    <span className="input-label">Departs</span>
                                    <input 
                                        className="input-dark" 
                                        type="time" 
                                        value={draftPoint.start_time || '09:00'}
                                        onChange={(e) => setDraftPoint({ ...draftPoint, start_time: e.target.value })} 
                                    />
                                </div>
                            ) : (
                                <div style={{flex: 1}}>
                                    <span className="input-label">Stay (min)</span>
                                    <input 
                                        className="input-dark" 
                                        type="number" 
                                        min="0"
                                        value={draftPoint.stay_duration ?? ''}
                                        onChange={(e) => setDraftPoint({ ...draftPoint, stay_duration: e.target.value === '' ? undefined : parseInt(e.target.value) })} 
                                    />
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <span className="input-label">Notes</span>
                            <textarea 
                                className="input-dark" 
                                style={{resize: 'none', height: '60px'}}
                                value={draftPoint.note || ''} 
                                placeholder="Add details..."
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => setDraftPoint({ ...draftPoint, note: e.target.value })} 
                            />
                        </div>

                        <div className="input-group" style={{marginBottom: '15px'}}>
                            <span className="input-label">Budget ($)</span>
                            <input 
                                className="input-dark" 
                                type="text" 
                                value={budgetText}
                                placeholder="0.00"
                                onFocus={(e) => e.target.select()}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    // Only allow numbers and one decimal point
                                    if (val === '' || /^\d*\.?\d*$/.test(val)) {
                                        setBudgetText(val);
                                        // Update the main state only if it's a valid complete number or empty
                                        if (val === '') {
                                            setDraftPoint({ ...draftPoint, budget: undefined });
                                        } else if (!val.endsWith('.')) {
                                            setDraftPoint({ ...draftPoint, budget: parseFloat(val) });
                                        }
                                    }
                                }} 
                            />
                        </div>

                        <button 
                            className="std-button" 
                            style={{width: '100%', marginBottom: '10px'}} 
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save Stop Details'}
                        </button>

                        <button className="btn-delete" onClick={async () => await deleteWaypointByID(point.id)}>
                            Delete Waypoint
                        </button>
                    </div>
                ) : (
                    <div className="marker-popup-view">
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '12px'}}>
                            <div>
                                <span className="input-label">Arrival</span>
                                <div style={{fontSize: '1rem', fontWeight: 'bold', color: '#fff'}}>{formatTime24(arrivalTime)}</div>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <span className="input-label">Departure</span>
                                <div style={{fontSize: '1rem', fontWeight: 'bold', color: 'var(--color-accent)'}}>{formatTime24(departureTime)}</div>
                            </div>
                        </div>

                        {(point.budget > 0 || point.stay_duration > 0) && (
                            <div style={{display: 'flex', gap: '10px', marginBottom: '12px'}}>
                                {point.stay_duration > 0 && (
                                    <div className="stay-badge" style={{margin: 0, flex: 1}}>
                                        ⏱️ {point.stay_duration}m
                                    </div>
                                )}
                                {point.budget > 0 && (
                                    <div className="stay-badge" style={{margin: 0, flex: 1, borderColor: 'rgba(74, 222, 128, 0.3)', color: '#4ade80'}}>
                                        💰 ${Number(point.budget).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        )}

                        <div style={{fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.5', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px'}}>
                            {point.note || 'No notes for this stop.'}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}



export default MarkerPopup;

