import {useStops} from "../../../../../../context/DataContext";
import {useDirectus} from "../../../../../../context/DirectusContext";

const InfoStyle = `
    .info-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        color: var(--color-text);
        font-family: var(--font-main);
    }

    .info-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding-top: var(--gap-small);
        min-height: 0;
    }

    .info-label {
        font-size: var(--font-size-xxsmall);
        text-transform: uppercase;
        color: rgba(229, 229, 229, 0.5);
        font-weight: bold;
        letter-spacing: 0.5px;
        margin-bottom: var(--gap-xsmall);
    }

    .info-edit-group {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--gap-medium);
    }

    .info-description-group {
        display: flex;
        flex-direction: column;
        flex: 1;
        margin-bottom: var(--gap-medium);
        min-height: 0;
        overflow-y: auto;
        direction: rtl; /* Moves scrollbar to left */
        padding-left: 4px;
    }

    .info-description-group::-webkit-scrollbar {
        width: 4px;
    }

    .info-description-group::-webkit-scrollbar-track {
        background: transparent;
    }

    .info-description-group::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 10px;
    }

    .info-description-group::-webkit-scrollbar-thumb:hover {
        background: var(--color-accent);
    }

    .info-summary-textarea {
        flex: 1;
        resize: none;
        width: 100%;
        box-sizing: border-box;
        direction: ltr; /* Resets text direction */
        border: none;
        background: transparent;
        box-shadow: none;
        padding-left: var(--gap-small);
        border-left: 2px solid var(--color-accent);
        font-size: var(--font-size-xsmall);
        font-style: italic;
        color: var(--color-text);
        font-family: var(--font-main);
    }

    .info-summary-textarea:focus {
        border-left: 2px solid var(--color-primary);
        box-shadow: none;
    }

    .info-summary-text {
        color: var(--color-primary);
        opacity: 0.8;
        font-size: var(--font-size-xsmall);
        font-style: italic;
        line-height: 1.5;
        white-space: pre-wrap;
        margin: 0;
        padding-left: var(--gap-small);
        border-left: 2px solid var(--color-accent);
        direction: ltr; /* Resets text direction */
    }

    .info-title {
        margin: 0 0 var(--gap-medium) 0;
        color: var(--color-primary);
        font-size: var(--font-size-xlarge);
        font-weight: 600;
    }

    .info-stats-container {
        margin-top: auto;
        display: flex;
        flex-direction: column;
        gap: var(--gap-small);
        margin-bottom: var(--gap-medium);
        padding-top: var(--gap-medium);
        border-top: 1px solid var(--color-border);
    }

    .info-stats-grid {
        display: flex;
        gap: var(--gap-small);
    }

    .info-stat-card {
        flex: 1;
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 8px;
        padding: var(--gap-medium) var(--gap-small);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        transition: var(--transition);
        white-space: nowrap;
        overflow: hidden;
    }

    .info-stat-card:hover {
        border-color: var(--color-accent);
        background-color: rgba(255, 255, 255, 0.02);
    }

    .info-stat-value {
        color: var(--color-primary);
        font-size: 1.4rem;
        font-weight: 600;
        margin: 0;
        white-space: nowrap;
    }

    .info-stat-label {
        color: rgba(229, 229, 229, 0.5);
        font-size: var(--font-size-xsmall);
        text-transform: uppercase;
        letter-spacing: 1px;
        margin: 0;
        white-space: nowrap;
    }

    .info-status-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: var(--gap-medium);
        width: 100%;
        box-sizing: border-box;
    }
`;

export const STATUS_DROPDOWN = [
    {
        label:'Planning',
        value:'draft',
        color:'var(--color-accent)',
        bar:'yellow'
    },
    {
        label:'Planned',
        value:'published',
        color:'var(--color-secondary)',
        bar:'green'
    },
    {
        label:'Ride Complete',
        value:'archived',
        color:'var(--color-tertiary)',
        bar:'blue'
    }
];

const Info = () =>{
    const {editMode, route} = useStops();
    const {currentTrip,setCurrentTrip} = useDirectus();

    return (
        <div className='info-wrapper'>
            <style>{InfoStyle}</style>
            {editMode ? (
                <div className="info-content">
                    <div className="info-edit-group">
                        <span className="info-label">Trip Name</span>
                        <input 
                            className="std-input" 
                            type="text" 
                            placeholder="e.g. Cross Country Tour"
                            value={currentTrip?.trip_name || ''}
                            onChange={(e) => setCurrentTrip({...currentTrip, trip_name: e.target.value})}
                        />
                    </div>

                    <div className="info-edit-group">
                        <span className="info-label">Status</span>
                        <select 
                            className="std-input"
                            value={currentTrip?.status || 'Draft'}
                            onChange={(e) => setCurrentTrip({...currentTrip, status: e.target.value})}
                        >
                            {STATUS_DROPDOWN.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="info-description-group">
                        <span className="info-label">Trip Summary</span>
                        <textarea 
                            className="std-input info-summary-textarea" 
                            placeholder="Add details, goals, or notes about this trip..."
                            value={currentTrip?.summary || ''}
                            onChange={(e) => setCurrentTrip({...currentTrip, summary: e.target.value})}
                        />
                    </div>
                    
                    <div className='info-stats-container'>
                        <span className="info-label">Route Statistics</span>
                        <div className='info-stats-grid'>
                            <div className="info-stat-card">
                                <p className="info-stat-label">Distance</p>
                                <p className="info-stat-value">{route?.distance ? route.distance.toFixed(0) : '0'}<span style={{fontSize: '0.9rem', marginLeft: '3px', color: 'rgba(229, 229, 229, 0.5)'}}>mi</span></p>
                            </div>
                            <div className="info-stat-card">
                                <p className="info-stat-label">Ride Time</p>
                                <p className="info-stat-value">{route?.duration ? (
                                    (() => {
                                        const d = Number(route.duration);
                                        const h = Math.floor(d / 3600);
                                        const m = Math.floor(d % 3600 / 60);
                                        return h > 0 ? (
                                            <>{h}<span style={{fontSize: '0.9rem', margin: '0 3px', color: 'rgba(229, 229, 229, 0.5)'}}>h</span> {m}<span style={{fontSize: '0.9rem', marginLeft: '3px', color: 'rgba(229, 229, 229, 0.5)'}}>m</span></>
                                        ) : (
                                            <>{m}<span style={{fontSize: '0.9rem', marginLeft: '3px', color: 'rgba(229, 229, 229, 0.5)'}}>m</span></>
                                        );
                                    })()
                                ) : '0m'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            ):(
                <div className="info-content">
                    {(() => {
                        const statusObj = STATUS_DROPDOWN.find(s => s.value === (currentTrip?.status || 'Draft')) || STATUS_DROPDOWN[0];
                        return (
                            <div 
                                className="info-status-badge" 
                                style={{ 
                                    backgroundColor: `${statusObj.bar}`, 
                                    color: statusObj.color
                                }}
                            >
                                {statusObj.label}
                            </div>
                        );
                    })()}

                    <h3 className="info-title" style={{marginTop: 0}}>{currentTrip?.trip_name || 'Unnamed Trip'}</h3>
                    
                    {currentTrip?.summary && (
                        <div className="info-description-group">
                            <p className="info-summary-text">{currentTrip.summary}</p>
                        </div>
                    )}
                    
                    <div className='info-stats-container'>
                        <span className="info-label">Route Statistics</span>
                        <div className='info-stats-grid'>
                            <div className="info-stat-card">
                                <p className="info-stat-label">Distance</p>
                                <p className="info-stat-value">{route?.distance ? route.distance.toFixed(0) : '0'}<span style={{fontSize: '0.9rem', marginLeft: '3px', color: 'rgba(229, 229, 229, 0.5)'}}>mi</span></p>
                            </div>
                            <div className="info-stat-card">
                                <p className="info-stat-label">Ride Time</p>
                                <p className="info-stat-value">{route?.duration ? (
                                    (() => {
                                        const d = Number(route.duration);
                                        const h = Math.floor(d / 3600);
                                        const m = Math.floor(d % 3600 / 60);
                                        return h > 0 ? (
                                            <>{h}<span style={{fontSize: '0.9rem', margin: '0 3px', color: 'rgba(229, 229, 229, 0.5)'}}>h</span> {m}<span style={{fontSize: '0.9rem', marginLeft: '3px', color: 'rgba(229, 229, 229, 0.5)'}}>m</span></>
                                        ) : (
                                            <>{m}<span style={{fontSize: '0.9rem', marginLeft: '3px', color: 'rgba(229, 229, 229, 0.5)'}}>m</span></>
                                        );
                                    })()
                                ) : '0m'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Info;