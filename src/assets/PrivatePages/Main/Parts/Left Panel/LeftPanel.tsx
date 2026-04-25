import LeftPanelStops from "./Parts/LeftPanelStops";
import LeftPanelSearch from "./Parts/LeftPanelSearch";
import { useDirectus } from "../../../../../context/DirectusContext";
import { useStops } from "../../../../../context/DataContext";
import { useState } from "react";


const LeftPanel_Style = `

    .left-panel-wrapper{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: var(--gap-small);
        width: 300px;
        height: 99%;
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        padding: var(--gap-medium);
        box-sizing: border-box;
        z-index: 10;
        box-shadow: 4px 0 15px rgba(0,0,0,0.5);
    }

    .left-panel-tabs {
        display: flex;
        border-bottom: 2px solid var(--color-border);
        margin-bottom: var(--gap-medium);
        flex-shrink: 0;
    }

    .tab-btn {
        flex: 1;
        background: transparent;
        color: rgba(229, 229, 229, 0.6); /* Muted text */
        border: none;
        border-bottom: 2px solid transparent;
        padding: var(--gap-small) 0;
        margin-bottom: -2px; /* Pull down to overlap container border */
        font-family: var(--font-main);
        font-size: var(--font-size-small);
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: var(--transition);
    }

    .tab-btn:hover {
        color: var(--color-primary);
        background: rgba(255, 255, 255, 0.03);
    }

    .tab-btn.active {
        color: var(--color-primary);
        border-bottom: 2px solid var(--color-accent);
    }

    .tab-content {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        gap: var(--gap-small);
        overflow-y: auto;
    }
`;

const LeftPanel = () =>{
    const {saveTripByID} = useDirectus();
    const {selectedTrip, editMode} = useStops();
    const [selectedTab, setSelectedTab] = useState(1); // Default to Stops tab


    return(
        <div className="left-panel-wrapper">
            <style>{LeftPanel_Style}</style> 
            <div className='left-panel-tabs'>
                <button className={`tab-btn ${selectedTab === 0 ? 'active' : ''}`} onClick={()=>setSelectedTab(0)}>Info</button>
                <button className={`tab-btn ${selectedTab === 1 ? 'active' : ''}`} onClick={()=>setSelectedTab(1)}>Stops</button>
                <button className={`tab-btn ${selectedTab === 2 ? 'active' : ''}`} onClick={()=>setSelectedTab(2)}>Itinerary</button>
            </div>
    
            <div className="tab-content">
                {selectedTab === 0 && (
                    <div style={{color: 'var(--color-primary)', textAlign: 'center', marginTop: '20px'}}>
                        <h4 style={{marginBottom: '5px'}}>Trip Info & Stats</h4>
                        <small style={{opacity: 0.6}}>(Coming Soon)</small>
                    </div>
                )}
                
                {selectedTab === 1 && (
                    <>
                        <LeftPanelSearch/>
                        <LeftPanelStops/>
                    </>
                )}

                {selectedTab === 2 && (
                    <div style={{color: 'var(--color-primary)', textAlign: 'center', marginTop: '20px'}}>
                        <h4 style={{marginBottom: '5px'}}>Detailed Itinerary</h4>
                        <small style={{opacity: 0.6}}>(Coming Soon)</small>
                    </div>
                )}
            </div>
            {editMode ? <button className="std-button" style={{marginTop: 'auto'}} onClick={()=>saveTripByID(selectedTrip)}>Save Trip</button> : null}
        </div>
    )
}

export default LeftPanel;
