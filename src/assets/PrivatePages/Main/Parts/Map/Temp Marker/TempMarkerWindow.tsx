import { useState } from "react";
import { useStops, type Stop } from "../../../../../../context/DataContext";
import { useDirectus } from "../../../../../../context/DirectusContext";
import { getTripDirections } from "../../../valhala";

const TEMP_MARKER_WINDOW_STYLE=`
    .temp-marker-window{
        width: 200px;
        background: rgba(18, 18, 21, 0.95);
        border: 1px solid #3f3f46;
        border-radius: 6px;
        z-index: 100;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
        padding: 10px
    }

    /* Hide the default MapLibre close button and styling */
    .maplibregl-popup-content {
        background: none !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
    }
    .maplibregl-popup-tip {
        border-top-color: #3f3f46 !important;
    }

    .close-button-div{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
    }

    .temp-marker-window h3{
        color: var(--color-accent);
        margin: 0;
        border-left: 3px solid var(--color-accent);
        padding-left: 10px;
    }

    .temp-marker-window-close-button{
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 1px solid #3f3f46;
        background: var(--color-accent);
        color: #0000ffff;
        display: flex;
        justify-content: center;
        align-items: center;    
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .temp-marker-window-close-button:hover{
        background: #3f3f46;
        color: #fff;
    }

    .temp-marker-window h4{
        color: var(--color-primary);
        margin-top: 10px;
        margin-bottom: 10px;
        text-align: center;
    }

    .add-waypoint-button{
        width: 100%;
        margin-top: 10px;
}

`

const TempMarkerWindow = () =>{

    const {stops,setStops,searchStop, setShowSearchMenu, setSearchStop, setSearch, route, setRoute, editMode} = useStops();
    // const {currentTrip, saveTripByID} = useDirectus();

    const [isAdding, setIsAdding] = useState(false);

    const addStop = async () =>{
        if (isAdding) return;
        setIsAdding(true);

        const newStop: Stop = {
            id: 'temp_' + Date.now().toString(),
            name: "New Point",
            address: "",
            latitude: searchStop.lat,
            longitude: searchStop.long,
            type: "waypoint",
            stay_duration: 0,
            sort: (stops.length > 0 ? Math.max(...stops.map(s => s.sort || 0)) : 0) + 1
        }
        
        // Calculate the brand new array of stops synchronously
        const updatedStops = [...stops, newStop];
        
        setStops(updatedStops);
        setSearchStop(null);
        setShowSearchMenu(false);
        setSearch("");
        setRoute(null);
        
        // Pass the calculated array so Valhalla sees the new stop instantly!
        const m = await getTripDirections(updatedStops);
        if (m) {
            setRoute(m);
            //console.log(m);
        }
    }


    const closeWindow = () =>{
        setShowSearchMenu(false);
        setSearchStop({long: null, lat: null});
    }

    if (!searchStop) return null;

    return(
        <div className="temp-marker-window">
            <style>{TEMP_MARKER_WINDOW_STYLE}</style>
            <div className="close-button-div">
                <h3>New Point </h3>
                <button className="temp-marker-window-close-button" onClick={closeWindow}>X</button>
            </div>
            <h4>{searchStop.long.toFixed(5)}, {searchStop.lat.toFixed(5)}</h4>
            {editMode && (
                <button 
                    className="std-button add-waypoint-button" 
                    onClick={addStop}
                    disabled={isAdding}
                    style={{ opacity: isAdding ? 0.5 : 1, cursor: isAdding ? 'not-allowed' : 'pointer' }}
                >
                    {isAdding ? "Adding..." : "Add to Route"}
                </button>
            )}
        </div>
    )
}

export default TempMarkerWindow;