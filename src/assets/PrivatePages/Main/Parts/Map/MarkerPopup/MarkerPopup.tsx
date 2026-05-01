import { useState, useEffect, memo } from "react";
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
        font-size: 1rem;
        font-weight: 700;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .popup-subtitle {
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.4);
        margin-top: 2px;
        font-family: monospace;
    }

    .input-group {
        margin-bottom: 12px;
    }

    .input-dark {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        color: #fff;
        width: 100%;
        padding: 8px 10px;
        font-size: 0.8rem;
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

const MarkerPopup = memo(({ 
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

    const [nameText, setNameText] = useState(point.name || '');
    const [noteText, setNoteText] = useState(point.note || '');
    const [budgetText, setBudgetText] = useState(point.budget?.toString() || '');
    const [coordsText, setCoordsText] = useState(`${point.latitude}, ${point.longitude}`);
    const stopType = getStopType(point.type);

    const handleCoordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setCoordsText(val);

        const parts = val.split(',');
        if (parts.length >= 2) {
            const lat = parseFloat(parts[0].trim());
            const lng = parseFloat(parts[1].trim());
            if (!isNaN(lat) && !isNaN(lng)) {
                setStops(stops.map((s: any) => s.id === point.id ? { ...s, latitude: lat, longitude: lng } : s));
            }
        }
    }

    const formatTime24 = (date?: Date) => {
        if (!date) return "--:--";
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    };

    // Sync local state from props when they change externally (e.g. from sidebar or dragging)
    useEffect(() => {
        if (point.name !== nameText) setNameText(point.name || '');
    }, [point.name]);

    useEffect(() => {
        if (point.note !== noteText) setNoteText(point.note || '');
    }, [point.note]);

    useEffect(() => {
        setBudgetText(point.budget?.toString() || '');
    }, [point.budget]);

    useEffect(() => {
        setCoordsText(`${point.latitude}, ${point.longitude}`);
    }, [point.latitude, point.longitude]);

    // DEBOUNCED SYNC: Push local changes up to the global stops state
    useEffect(() => {
        const timer = setTimeout(() => {
            if (nameText !== (point.name || '')) {
                setStops((prev: any[]) => prev.map((s: any) => s.id === point.id ? { ...s, name: nameText } : s));
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [nameText, point.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (noteText !== (point.note || '')) {
                setStops((prev: any[]) => prev.map((s: any) => s.id === point.id ? { ...s, note: noteText } : s));
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [noteText, point.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const val = budgetText;
            if (val === '' || /^\d*\.?\d*$/.test(val)) {
                if (val === '') {
                    if (point.budget !== undefined) setStops((prev: any[]) => prev.map((s: any) => s.id === point.id ? { ...s, budget: undefined } : s));
                } else if (!val.endsWith('.')) {
                    const parsed = parseFloat(val);
                    if (parsed !== point.budget) setStops((prev: any[]) => prev.map((s: any) => s.id === point.id ? { ...s, budget: parsed } : s));
                }
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [budgetText, point.id]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const parts = coordsText.split(',');
            if (parts.length >= 2) {
                const lat = parseFloat(parts[0].trim());
                const lng = parseFloat(parts[1].trim());
                if (!isNaN(lat) && !isNaN(lng)) {
                    if (lat !== point.latitude || lng !== point.longitude) {
                        setStops((prev: any[]) => prev.map((s: any) => s.id === point.id ? { ...s, latitude: lat, longitude: lng } : s));
                    }
                }
            }
        }, 800);
        return () => clearTimeout(timer);
    }, [coordsText, point.id]);

    return(
        <div className="marker-popup-wrapper">
            <style>{MARKER_POPUP_STYLE}</style>
            
            <div className="popup-header">
                <h4 className="popup-title">
                    {stopType.icon} {point.name || (editMode ? 'Edit Stop' : 'Waypoint')}
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
                                value={nameText} 
                                placeholder="e.g. Scenic Overlook"
                                onChange={(e) => setNameText(e.target.value)} 
                            />
                        </div>

                        <div className="input-group">
                            <span className="input-label">Location (Lat, Lng)</span>
                            <input 
                                className="input-dark" 
                                type="text" 
                                value={coordsText} 
                                placeholder="40.7128, -74.0060"
                                onChange={(e) => setCoordsText(e.target.value)} 
                            />
                        </div>

                        <div style={{display: 'flex', gap: '10px', marginBottom: '15px'}}>
                            <div style={{flex: 1.5}}>
                                <span className="input-label">Type</span>
                                <select 
                                    className="input-dark" 
                                    value={point.type || 'waypoint'}
                                    onChange={(e) => {
                                        const newType = e.target.value;
                                        setStops(stops.map((s: any) => s.id === point.id ? { ...s, type: newType, stay_duration: newType === 'shaping' ? 0 : s.stay_duration } : s));
                                    }}
                                >
                                    {STOP_TYPES.map(type => (
                                        <option key={type.id} value={type.id}>{type.icon} {type.label}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {(point.type === 'start' || point.type === 'hotel') ? (
                                <div style={{flex: 1}}>
                                    <span className="input-label">Departs</span>
                                    <input 
                                        className="input-dark" 
                                        type="time" 
                                        value={point.start_time || '09:00'}
                                        onChange={(e) => setStops(stops.map((s: any) => s.id === point.id ? { ...s, start_time: e.target.value } : s))} 
                                    />
                                </div>
                            ) : (
                                <div style={{flex: 1}}>
                                    <span className="input-label">Stay (min)</span>
                                    <input 
                                        className="input-dark" 
                                        type="number" 
                                        min="0"
                                        value={point.stay_duration ?? ''}
                                        onChange={(e) => setStops(stops.map((s: any) => s.id === point.id ? { ...s, stay_duration: e.target.value === '' ? undefined : parseInt(e.target.value) } : s))} 
                                    />
                                </div>
                            )}
                        </div>

                        <div className="input-group">
                            <span className="input-label">Notes</span>
                            <textarea 
                                className="input-dark" 
                                style={{resize: 'none', height: '60px'}}
                                value={noteText} 
                                placeholder="Add details..."
                                onChange={(e) => setNoteText(e.target.value)} 
                            />
                        </div>

                        <div className="input-group" style={{marginBottom: '15px'}}>
                            <span className="input-label">Budget ($)</span>
                            <input 
                                className="input-dark" 
                                type="text" 
                                value={budgetText}
                                placeholder="0.00"
                                onChange={(e) => setBudgetText(e.target.value)} 
                            />
                        </div>

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
}, (prev, next) => {
    // Custom Comparison: Only re-render if visual/timing data changed
    return prev.point.latitude === next.point.latitude &&
           prev.point.longitude === next.point.longitude &&
           prev.point.type === next.point.type &&
           prev.point.name === next.point.name &&
           prev.point.stay_duration === next.point.stay_duration &&
           prev.point.start_time === next.point.start_time &&
           prev.point.budget === next.point.budget &&
           prev.point.note === next.point.note &&
           prev.editMode === next.editMode &&
           prev.arrivalTime?.getTime() === next.arrivalTime?.getTime() &&
           prev.departureTime?.getTime() === next.departureTime?.getTime();
});

export default MarkerPopup;
