import {useStops} from '../../../../../../context/DataContext'
import { useDirectus } from '../../../../../../context/DirectusContext';
import { useState, useEffect } from 'react';

const MOBILE_CONTROLS_STYLE = `
    .mobile-controls {
        display: flex;
        flex-direction: column;
        height: 100%;
        background-color: var(--color-bg);
        color: var(--color-text);
        padding: 12px;
        box-sizing: border-box;
        overflow: hidden;
    }

    .compact-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        flex-shrink: 0;
    }

    .compact-header h4 {
        margin: 0;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: var(--color-primary);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 80%;
    }

    .progress-pill {
        font-size: 10px;
        background: rgba(255,255,255,0.05);
        padding: 2px 8px;
        border-radius: 10px;
        color: var(--color-accent);
        font-weight: bold;
    }

    .progress-bar-container {
        width: 100%;
        height: 4px;
        background: rgba(255,255,255,0.05);
        border-radius: 2px;
        margin-bottom: 12px;
        flex-shrink: 0;
        overflow: hidden;
    }

    .progress-bar-fill {
        height: 100%;
        background: var(--color-accent);
        box-shadow: 0 0 8px var(--color-accent);
        transition: width 0.6s ease;
    }

    .controls-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
        overflow: hidden;
    }

    .dashboard-card {
        background: linear-gradient(145deg, #1a1a1a, #111);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        padding: 20px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    }

    .card-label {
        font-size: 11px;
        text-transform: uppercase;
        color: var(--color-accent);
        font-weight: 800;
        letter-spacing: 1.5px;
        margin-bottom: 6px;
        display: block;
    }

    .current-name {
        font-size: 1.8rem;
        font-weight: 800;
        color: white;
        margin: 0 0 16px 0;
        line-height: 1.1;
    }

    .stats-row {
        display: flex;
        justify-content: space-between;
        gap: 10px;
    }

    .stat-item {
        display: flex;
        flex-direction: column;
    }

    .stat-label {
        font-size: 11px;
        color: #666;
        text-transform: uppercase;
        font-weight: bold;
    }

    .stat-value {
        font-size: 14px;
        color: #eee;
        font-weight: 600;
    }

    .next-leg-preview {
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid rgba(255,255,255,0.08);
    }

    .next-name {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--color-primary);
        margin: 4px 0;
    }

    .metric-bubble {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(255,255,255,0.05);
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 12px;
        color: #fff;
        border: 1px solid rgba(255,255,255,0.1);
    }

    .actions-footer {
        padding-top: 12px;
        flex-shrink: 0;
    }

    .action-grid {
        display: grid;
        grid-template-columns: 50px 1fr 50px;
        gap: 8px;
    }

    .btn-base {
        height: 60px;
        border-radius: 14px;
        font-weight: 900;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-primary {
        background: var(--color-accent) !important;
        color: white !important;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .btn-secondary {
        background: #222 !important;
        color: #777 !important;
        border: 1px solid #333 !important;
    }

    .btn-icon {
        background: #4285F4 !important;
        font-size: 18px;
    }
    
    .btn-base:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }

    .note-card {
        background: rgba(255,255,255,0.05);
        padding: 16px 16px;
        border-radius: 16px;
        font-size: 16px;
        color: #eee;
        border: 1px solid rgba(255,255,255,0.1);
    }
`;

const MobileControls = () => {
    const { stops, route } = useStops();
    const { currentTrip } = useDirectus();
    const [currentStop, setCurrentStop] = useState(0);
    const [disablePrevious, setDisablePrevious] = useState(true);
    const [disableNext, setDisableNext] = useState(false);
    const [numberStops, setNumberStops] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(0);
    const [timeline, setTimeline] = useState<any[]>([]);

    const formatDateTime = (date: Date) => {
        if (!date) return "";
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + " @ " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h > 0 ? h + 'h ' : ''}${m}m`;
    };

    const openInGoogleMaps = () => {
        const stop = stops[currentStop+1];
        if (stop?.latitude && stop?.longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${stop.latitude},${stop.longitude}`, '_blank');        
        }
    };

    useEffect(() => {
        setCurrentStop(0);
        setDisablePrevious(true);
        setDisableNext(false);
        setNumberStops(stops.length);
    }, [currentTrip]);

    useEffect(() => {
        if (currentStop === 0) setDisablePrevious(true);
        else setDisablePrevious(false);

        if (currentStop === numberStops - 1) setDisableNext(true);
        else setDisableNext(false);

        if (route && route.legs && currentTrip) {
            const limit = currentStop;
            const sumLength = route.legs.slice(0, limit).reduce((acc: number, leg: any) => acc + (leg.summary?.length || 0), 0);
            const totalDist = route.distance || Number(currentTrip?.distance) || 1;
            setPercentage((sumLength / totalDist) * 100);
        }

        if (stops && stops.length > 0 && currentTrip) {
            const calculatedTimeline: any[] = [];
            const days: any[] = [];
            let currentDayStops: any[] = [];
            
            stops.forEach((stop, index) => {
                currentDayStops.push({ ...stop, globalIndex: index });
                if (stop.type === 'hotel' && index !== 0 && index !== stops.length - 1) {
                    days.push({ stops: currentDayStops });
                    currentDayStops = [];
                }
            });
            if (currentDayStops.length > 0) days.push({ stops: currentDayStops });

            let runningTime = new Date();
            
            days.forEach((day, dayIndex) => {
                const baseDate = (() => {
                    if (!currentTrip?.start_date) return new Date();
                    const [y, m, d] = currentTrip.start_date.split('T')[0].split('-').map(Number);
                    return new Date(y, m - 1, d);
                })();
                baseDate.setDate(baseDate.getDate() + dayIndex);
                const baseDateStr = baseDate.getFullYear() + '-' + String(baseDate.getMonth() + 1).padStart(2, '0') + '-' + String(baseDate.getDate()).padStart(2, '0');

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

                if (dayIndex > 0) {
                    const previousDay = days[dayIndex - 1];
                    const lastStopOfPrevDay = previousDay.stops[previousDay.stops.length - 1];
                    const legFromHotel = route?.legs?.[lastStopOfPrevDay.globalIndex];
                    if (legFromHotel) {
                        runningTime.setSeconds(runningTime.getSeconds() + legFromHotel.summary.time);
                    }
                }

                day.stops.forEach((stop: any) => {
                    const arrivalTime = new Date(runningTime);
                    let departureTime: Date;
                    
                    if (stop.type === 'hotel' && stop.start_time) {
                        const nextDay = new Date(baseDate);
                        nextDay.setDate(nextDay.getDate() + 1);
                        const nextDayStr = nextDay.toISOString().split('T')[0];
                        departureTime = new Date(`${nextDayStr}T${stop.start_time}:00`);
                        runningTime = new Date(departureTime); 
                    } else if (stop.type === 'start' && stop.start_time) {
                        departureTime = new Date(`${baseDateStr}T${stop.start_time}:00`);
                        runningTime = new Date(departureTime);
                    } else {
                        departureTime = new Date(arrivalTime);
                        departureTime.setMinutes(departureTime.getMinutes() + (stop.stay_duration || 0));
                        runningTime = new Date(departureTime);
                    }

                    calculatedTimeline[stop.globalIndex] = {
                        arrival: arrivalTime,
                        departure: departureTime
                    };

                    const nextLeg = route?.legs?.[stop.globalIndex];
                    if (nextLeg) {
                        runningTime.setSeconds(runningTime.getSeconds() + nextLeg.summary.time);
                    }
                });
            });
            setTimeline(calculatedTimeline);
        }
    }, [currentStop, route, currentTrip, numberStops, stops]);

    const nextStop = () => setCurrentStop(currentStop + 1);
    const previousStop = () => setCurrentStop(currentStop - 1);

    const nextLeg = route?.legs?.[currentStop];

    return (
        <div className="mobile-controls">
            <style>{MOBILE_CONTROLS_STYLE}</style>
            
            <header className="compact-header">
                <h4>{currentTrip?.trip_name}</h4>
                <span className="progress-pill">{percentage.toFixed(0)}%</span>
            </header>

            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
            </div>

            <div className="controls-content">
                <div className="dashboard-card">
                    <span className="card-label">Current Location</span>
                    <h2 className="current-name">{stops[currentStop]?.name || "No stop selected"}</h2>
                    
                    <div className="stats-row">
                        <div className="stat-item">
                            <span className="stat-label">Departing At</span>
                            <span className="stat-value">{timeline[currentStop] ? formatDateTime(timeline[currentStop].departure) : "--:--"}</span>
                        </div>
                        <div className="stat-item" style={{textAlign: 'right'}}>
                            <span className="stat-label">Budget</span>
                            <span className="stat-value">${Number(stops[currentStop]?.budget || 0).toFixed(2)}</span>
                        </div>
                    </div>

                    {currentStop < numberStops - 1 && (
                        <div className="next-leg-preview">
                            <span className="card-label">Next Destination</span>
                            <h3 className="next-name">{stops[currentStop + 1]?.name}</h3>
                            <div className="stats-row" style={{marginTop: '4px'}}>
                                <div className="stat-item">
                                    <span className="stat-label">Est. Arrival</span>
                                    <span className="stat-value">{timeline[currentStop + 1] ? formatDateTime(timeline[currentStop + 1].arrival) : "--:--"}</span>
                                </div>
                                <div className="stat-item" style={{textAlign: 'right'}}>
                                    <div className="metric-bubble">
                                        {nextLeg ? `${nextLeg.summary.length.toFixed(1)}mi • ${formatDuration(nextLeg.summary.time)}` : "---"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {stops[currentStop]?.note && (
                    <div className="note-card">
                        {stops[currentStop].note}
                    </div>
                )}
            </div>
            
            <footer className="actions-footer">
                <div className="action-grid">
                    <button className="btn-base btn-secondary" disabled={disablePrevious} onClick={previousStop}>
                        ←
                    </button>
                    <button className="btn-base btn-primary" disabled={disableNext} onClick={nextStop}>
                        {currentStop === numberStops - 1 ? "Finish Trip" : "Next Leg"}
                    </button>
                    <button className="btn-base btn-icon" onClick={openInGoogleMaps} title="Google Maps">
                        🗺️
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default MobileControls;