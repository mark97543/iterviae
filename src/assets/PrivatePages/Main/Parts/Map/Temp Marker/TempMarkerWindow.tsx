import { useStops } from "../../../../../../context/DataContext";

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

`

const TempMarkerWindow = () =>{

    const {searchStop, setShowSearchMenu} = useStops();

    const closeWindow = () =>{
        setShowSearchMenu(false);
    }

    return(
        <div className="temp-marker-window">
            <style>{TEMP_MARKER_WINDOW_STYLE}</style>
            <div className="close-button-div">
                <h3>New Point</h3>
                <button className="temp-marker-window-close-button" onClick={closeWindow}>X</button>
            </div>
            <h4>{searchStop.long.toFixed(5)}, {searchStop.lat.toFixed(5)}</h4>
        </div>
    )
}

export default TempMarkerWindow;