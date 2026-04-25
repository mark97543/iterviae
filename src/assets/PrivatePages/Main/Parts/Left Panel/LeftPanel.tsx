import LeftPanelStops from "./Parts/LeftPanelStops";
import LeftPanelSearch from "./Parts/LeftPanelSearch";
import { useDirectus } from "../../../../../context/DirectusContext";
import { useStops } from "../../../../../context/DataContext";

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

`;

const LeftPanel = () =>{
    const {saveTripByID} = useDirectus();
    const {selectedTrip} = useStops();

    return(
        <div className="left-panel-wrapper">
            <style>{LeftPanel_Style}</style> 
    
            <LeftPanelSearch/>
            <LeftPanelStops/>
            <button className="std-button" onClick={()=>saveTripByID(selectedTrip)}>Save</button>
        </div>
    )
}

export default LeftPanel;
