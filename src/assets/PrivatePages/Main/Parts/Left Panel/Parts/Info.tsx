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
    }

    .info-summary-textarea {
        flex: 1;
        resize: none;
        width: 100%;
        box-sizing: border-box;
    }

    .info-summary-text {
        color: var(--color-primary);
        opacity: 0.8;
        font-size: var(--font-size-small);
        line-height: 1.5;
        white-space: pre-wrap;
        margin: 0 0 var(--gap-medium) 0;
        padding-left: var(--gap-small);
        border-left: 2px solid var(--color-accent);
    }

    .info-title {
        margin: 0 0 var(--gap-medium) 0;
        color: var(--color-primary);
        font-size: var(--font-size-xlarge);
        font-weight: 600;
    }

    .info-stats {
        margin-top: auto;
        margin-bottom: var(--gap-medium);
        padding-top: var(--gap-medium);
        border-top: 1px solid var(--color-border);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        font-size: var(--font-size-small);
        color: rgba(229, 229, 229, 0.6);
    }
`;

const Info = () =>{
    const {editMode} = useStops();
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

                    <div className="info-description-group">
                        <span className="info-label">Trip Summary</span>
                        <textarea 
                            className="std-input info-summary-textarea" 
                            placeholder="Add details, goals, or notes about this trip..."
                            value={currentTrip?.summary || ''}
                            onChange={(e) => setCurrentTrip({...currentTrip, summary: e.target.value})}
                        />
                    </div>
                    
                    <div className='info-stats'>
                        <span>Trip Statistics</span>
                        <span>(Coming Soon)</span>
                    </div>
                </div>
            ):(
                <div className="info-content">
                    <h3 className="info-title">{currentTrip?.trip_name || 'Unnamed Trip'}</h3>
                    {currentTrip?.summary && (
                        <p className="info-summary-text">{currentTrip.summary}</p>
                    )}
                    
                    <div className='info-stats'>
                        <span>Trip Statistics</span>
                        <span>(Coming Soon)</span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Info;