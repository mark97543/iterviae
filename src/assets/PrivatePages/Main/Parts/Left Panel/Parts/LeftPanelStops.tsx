import { useStops } from "../../../../../../context/DataContext";

const LEFTPANELSTOPSSTYLE = `
    .left-panel-stops-wrapper{
        display: flex;
        flex-direction: column;
        width: 100%;
        flex: 1;
        background-color: var(--color-bg);
        gap: 0;
        padding: 0;
    }
    
    .stop-item-container {
        display: flex;
        flex-direction: column;
    }

    .stop-name-location {
        display: flex;
        flex-direction: column;
        background-color: var(--color-surface);
        padding: 12px 16px;
        border-radius: 8px;
        border: 1px solid var(--color-border);
        transition: all 0.2s ease;
        border-left: 3px solid transparent;
    }

    .stop-name-location:hover {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.05);
        border-left: 3px solid var(--color-accent);
    }

    .stop-name {
        margin: 0 0 4px 0;
        color: var(--color-primary);
        font-weight: 600;
        font-size: var(--font-size-small);
        letter-spacing: 0.5px;
    }

    .stop-coords {
        margin: 0;
        color: rgba(229, 229, 229, 0.4);
        font-size: var(--font-size-xsmall);
        font-family: monospace;
    }

    .left-panel-stop-stats {
        display: flex;
        flex-direction: row;
        align-items: center;
        padding: 4px 0 4px 20px; 
        color: var(--color-accent);
        font-size: var(--font-size-xxsmall);
        font-weight: 600;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        opacity: 0.9;
    }
    
    .stat-line {
        width: 2px;
        height: 24px;
        background-color: var(--color-border);
        margin-right: 16px;
        border-radius: 2px;
    }

    .stat-dot {
        color: var(--color-border);
        margin: 0 8px;
    }
`;

const LeftPanelStops =()=>{
    const {stops, route} = useStops();

    //Seconds to XXhr XXmin format
    function secondsToHms(d: number) {
        d = Number(d);
        const h = Math.floor(d / 3600);
        const m = Math.floor(d % 3600 / 60);
        if (h > 0) {
            return h + " hr " + m + " min";
        }
        return m + " min";
    }

    return(
        <div className="left-panel-stops-wrapper">
            <style>{LEFTPANELSTOPSSTYLE}</style>
            {stops.map((stop: any, index: number) => (
                <div key={stop.id} className="stop-item-container">
                    <div className="stop-name-location">
                        <p className="stop-name">{stop.name || 'Unnamed Stop'}</p>
                        <p className="stop-coords">{Number(stop.longitude).toFixed(5)}, {Number(stop.latitude).toFixed(5)}</p>
                    </div>
                    {/* Only show the leg stats if Valhalla returned legs, and if this isn't the final stop */}
                    {route?.legs && index < route.legs.length && (
                        <div className="left-panel-stop-stats">
                            <div className="stat-line"></div>
                            <span>{route.legs[index]?.summary?.length?.toFixed(1)} mi</span>
                            <span className="stat-dot">•</span>
                            <span>{secondsToHms(route.legs[index]?.summary?.time)}</span>                        
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default LeftPanelStops;