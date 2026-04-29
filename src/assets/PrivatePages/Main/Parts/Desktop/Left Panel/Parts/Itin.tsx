import { useStops } from "../../../../../../../context/DataContext";
import { useDirectus } from "../../../../../../../context/DirectusContext";
import { getStopType } from "../../../../../../../constants/StopTypes";

const ITIN_STYLE = `
    .itin-container {
        padding: 10px;
        color: var(--color-text);
        font-family: 'Inter', sans-serif;
    }

    .itin-header {
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .itin-header h3 {
        color: var(--color-accent);
        font-size: 0.9rem;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 8px;
    }

    .date-display {
        font-size: 1.1rem;
        font-weight: 600;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    /* Timeline Styling */
    .timeline {
        position: relative;
        padding-left: 30px;
        margin-top: 20px;
    }

    .timeline::before {
        content: '';
        position: absolute;
        left: 5px;
        top: 0;
        bottom: 0;
        width: 1px;
        background: rgba(255, 255, 255, 0.08); /* Dimmer vertical line */
        z-index: 1;
    }

    .day-header {
        margin: 40px 0 20px -30px;
        color: var(--color-accent);
        font-weight: 800;
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 12px;
        text-transform: uppercase;
        letter-spacing: 2px;
    }

    .day-header::after {
        content: '';
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, rgba(249, 115, 22, 0.2), transparent);
    }

    .stop-entry {
        position: relative;
        margin-bottom: 12px; /* Tighter gap to metrics */
    }

    .stop-dot {
        position: absolute;
        left: -30px;
        top: 10px;
        width: 10px;
        height: 10px;
        background: #09090b;
        border: 2px solid var(--color-accent);
        border-radius: 50%;
        z-index: 2;
    }

    .stop-card {
        background: #18181b; /* Lighter than panel for contrast */
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 16px;
        transition: all 0.2s ease;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .stop-card:hover {
        background: #27272a;
        border-color: var(--color-accent);
        transform: translateX(4px);
    }

    .stop-top {
        margin-bottom: 2px;
    }

    .stop-name {
        font-weight: 700;
        color: #fff;
        font-size: 0.95rem;
        margin-bottom: 2px;
    }

    .stop-meta {
        font-size: 0.65rem;
        color: rgba(255, 255, 255, 0.4);
        text-transform: uppercase;
        letter-spacing: 0.8px;
        font-weight: 600;
        margin-bottom: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .stop-bottom {
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 12px;
    }

    .stop-time {
        font-size: 0.75rem;
        color: var(--color-accent);
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
    }

    .stop-budget {
        color: #4ade80; /* Brighter green */
        font-size: 0.75rem;
    }

    .travel-metrics {
        margin: 20px 0 20px 0; /* More vertical space */
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 500;
    }

    .travel-metrics::before {
        content: '↓';
        font-size: 0.9rem;
        color: rgba(249, 115, 22, 0.4);
    }

    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: rgba(255,255,255,0.3);
        font-style: italic;
    }

    /* Fix for the black-on-black calendar icon in dark mode */
    input[type="date"]::-webkit-calendar-picker-indicator {
        filter: invert(1);
        opacity: 0.6;
        cursor: pointer;
    }

    input[type="date"]::-webkit-calendar-picker-indicator:hover {
        opacity: 1;
    }
`;

const Itin = () => {
    const { currentTrip } = useDirectus();
    const { editMode, stops, route, setFocusedID } = useStops();

    // Helper to format duration from seconds to XXh XXm
    const formatDuration = (seconds: number) => {
        if (!seconds) return "";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h > 0 ? h + 'h ' : ''}${m}m`;
    };

    // Helper to format distance to miles
    const formatDistance = (meters: number) => {
        if (!meters) return "";
        const miles = meters * 0.000621371;
        return miles.toFixed(1) + " mi";
    };

    // Helper to format time (e.g. 10:30 AM)
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Logic to chunk stops into days
    const days: any[] = [];
    let currentDayStops: any[] = [];
    
    stops.forEach((stop, index) => {
        currentDayStops.push({ ...stop, globalIndex: index });
        // If it's a hotel (and not the very first stop), it marks the end of the day
        if (stop.type === 'hotel' && index !== 0 && index !== stops.length - 1) {
            days.push({ dayNumber: days.length + 1, stops: currentDayStops });
            currentDayStops = [];
        }
    });
    if (currentDayStops.length > 0) {
        days.push({ dayNumber: days.length + 1, stops: currentDayStops });
    }

    // Time Tracking Logic
    let runningTime = new Date(); // Will be set per day

    return (
        <div className="itin-container">
            <style>{ITIN_STYLE}</style>
            
            <div className="itin-header">
                <h3>Trip Itinerary</h3>
                {editMode ? <EditMode /> : <ViewMode />}
            </div>

            {stops.length === 0 ? (
                <div className="empty-state">No waypoints added to this trip yet.</div>
            ) : (
                <div className="timeline">
                    {days.map((day, dayIndex) => {
                        const baseDate = (() => {
                            if (!currentTrip?.start_date) return new Date();
                            const [y, m, d] = currentTrip.start_date.split('T')[0].split('-').map(Number);
                            return new Date(y, m - 1, d);
                        })();
                        baseDate.setDate(baseDate.getDate() + dayIndex);
                        const baseDateStr = baseDate.getFullYear() + '-' + String(baseDate.getMonth() + 1).padStart(2, '0') + '-' + String(baseDate.getDate()).padStart(2, '0');

                        // LOGIC: If this is Day 2+, and Day 1 ended with a Hotel, use that Hotel's start_time.
                        // Otherwise use the first stop of THIS day's start_time.
                        let startTimeStr = "09:00";
                        if (dayIndex > 0) {
                            const previousDay = days[dayIndex - 1];
                            const lastStopOfPrevDay = previousDay.stops[previousDay.stops.length - 1];
                            if (lastStopOfPrevDay.type === 'hotel' && lastStopOfPrevDay.start_time) {
                                startTimeStr = lastStopOfPrevDay.start_time;
                            }
                        } else {
                            startTimeStr = day.stops[0].start_time || "09:00";
                        }

                        runningTime = new Date(`${baseDateStr}T${startTimeStr}:00`);

                        // FIX: If we are continuing from a hotel on a previous day, 
                        // we need to add the travel time from that hotel to the first stop of THIS day.
                        if (dayIndex > 0) {
                            const previousDay = days[dayIndex - 1];
                            const lastStopOfPrevDay = previousDay.stops[previousDay.stops.length - 1];
                            const legFromHotel = route?.legs?.[lastStopOfPrevDay.globalIndex];
                            if (legFromHotel) {
                                runningTime.setSeconds(runningTime.getSeconds() + legFromHotel.summary.time);
                            }
                        }
                        
                        return (
                            <div key={`day-${day.dayNumber}`}>
                                <div className="day-header">
                                    Day {day.dayNumber} 
                                    <span style={{fontSize: '0.8rem', opacity: 0.5, marginLeft: '10px', textTransform: 'none', letterSpacing: 'normal'}}>
                                        {baseDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                
                                {day.stops.map((stop: any, dIndex: number) => {
                                    const stopType = getStopType(stop.type);
                                    const arrivalTime = new Date(runningTime);
                                    
                                    // If this is a start/hotel, we might have reset the time above
                                    // but we still need to handle stay duration for other stops
                                    const stayMins = stop.stay_duration || 0;
                                    
                                    // If it's a hotel or start, departure is the set start_time
                                    // Otherwise it's Arrival + Stay
                                    let departureTime: Date;
                                    if (stop.type === 'hotel' && stop.start_time) {
                                        // Hotel departure is the MORNING of the NEXT day
                                        const nextDay = new Date(baseDate);
                                        nextDay.setDate(nextDay.getDate() + 1);
                                        const nextDayStr = nextDay.toISOString().split('T')[0];
                                        departureTime = new Date(`${nextDayStr}T${stop.start_time}:00`);
                                        runningTime = new Date(departureTime); 
                                    } else if (stop.type === 'start' && stop.start_time) {
                                        departureTime = new Date(`${baseDateStr}T${stop.start_time}:00`);
                                        runningTime = new Date(departureTime);
                                    } else {
                                        runningTime.setMinutes(runningTime.getMinutes() + stayMins);
                                        departureTime = new Date(runningTime);
                                    }

                                    // Add travel time to next stop for the NEXT iteration
                                    const leg = route?.legs?.[stop.globalIndex];
                                    if (leg) {
                                        runningTime.setSeconds(runningTime.getSeconds() + leg.summary.time);
                                    }

                                    return (
                                        <div key={stop.id} className="stop-wrapper">
                                            <div className="stop-entry">
                                                <div className="stop-dot" style={{borderColor: stopType.color}}></div>
                                                <div className="stop-card" onClick={() => setFocusedID(stop.id)}>
                                                    <div className="stop-top">
                                                        <div className="stop-name">{stopType.icon} {stop.name || (stop.type === 'start' ? 'Trip Start' : 'Waypoint')}</div>
                                                    </div>
                                                    <div className="stop-meta">
                                                        <span>{stopType.label}</span>
                                                        {stop.budget > 0 && (
                                                            <span className="stop-budget">
                                                                ${Number(stop.budget).toLocaleString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="stop-bottom">
                                                        <div className="stop-time">
                                                            {formatTime(arrivalTime)}
                                                            {stayMins > 0 && ` - ${formatTime(departureTime)}`}
                                                        </div>
                                                    </div>
                                                    {stop.note && <div style={{marginTop: '10px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px'}}>{stop.note}</div>}
                                                </div>
                                            </div>

                                            {/* Show travel metrics between stops */}
                                            {leg && (
                                                <div className="travel-metrics">
                                                    <span>{formatDistance(leg.summary.length * 1000)}</span>
                                                    <span>•</span>
                                                    <span>{formatDuration(leg.summary.time)}</span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Itin;

const EditMode = () => {
    const { currentTrip, setCurrentTrip } = useDirectus();
    return (
        <div className="date-display">
            <input
                type='date'
                value={currentTrip?.start_date || ""}
                className="std-input"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                onChange={(e) => setCurrentTrip({ ...currentTrip, start_date: e.target.value })}
            />
        </div>
    );
}

const ViewMode = () => {
    const { currentTrip } = useDirectus();
    
    // Format date nicely
    const formatDate = (dateStr: string) => {
        if (!dateStr) return "Select Start Date";
        const [y, m, d] = dateStr.split('T')[0].split('-').map(Number);
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[m-1]} ${d}, ${y}`;
    }

    return (
        <div className="date-display">
            <span>📅</span>
            <span>{formatDate(currentTrip?.start_date)}</span>
        </div>
    );
}
