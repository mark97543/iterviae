import { useStops } from "../../../../../../context/DataContext";
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
    const {setStops,stops}=useStops();




    return(
        <div className="left-panel-stops-wrapper">
            <style>{LEFTPANELSTOPSSTYLE}</style>
            {stops.map((stop: any) => (
                <div key={stop.id}>
                    <p>{stop.longitude.toFixed(5)}, {stop.latitude.toFixed(5)}</p>
                </div>
            ))}
        </div>
    )
}

export default LeftPanelStops;