import { useStops } from "../../../../context/DataContext";
const LEFTPANELSTOPSSTYLE=`
    .left-panel-stops-wrapper{
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background-color: var(--color-bg);
        gap: var(--gap-small);
    }
`;

const LeftPanelStops =()=>{
    // const {setStops,stops}=useStops();




    return(
        <div className="left-panel-stops-wrapper">
            <style>{LEFTPANELSTOPSSTYLE}</style>
            <input className="std-input" placeholder="Start"></input>
            <input className="std-input" placeholder="End"></input>
        </div>
    )
}

export default LeftPanelStops;