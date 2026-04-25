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
    const {stops, route} = useStops();


    return(
        <div className="left-panel-stops-wrapper">
            <style>{LEFTPANELSTOPSSTYLE}</style>
            {stops.map((stop: any, index: number) => (
                <div key={stop.id}>
                    <div>
                        <p>{Number(stop.longitude).toFixed(5)}, {Number(stop.latitude).toFixed(5)}</p>
                    </div>
                    {/* Only show the leg stats if Valhalla returned legs, and if this isn't the final stop */}
                    {route?.legs && index < route.legs.length && (
                        <div>
                            <p>{route.legs[index]?.summary?.length?.toFixed(2)} miles</p>
                            <p>{route.legs[index]?.summary?.time} seconds</p>                        
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

export default LeftPanelStops;