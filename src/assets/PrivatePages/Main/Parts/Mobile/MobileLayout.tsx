import MapComponent from "../Map/Map";
import MobileTopPanel from "./Parts/MobileTopPanel";

const MOBILE_UI_STYLE = `
    .mobile-layout-container {
        display: flex;
        flex-direction: column;
        height: 100%;
        width: 100%;
        overflow: hidden;
    }
    
    .map-container {
        width: 100%;
        height: 50vh;
        position: relative; /* Essential for absolute-positioned children like the map */
        background: #09090b; /* Match map background */
        display: flex;
        flex-direction: column;
        border-radius:var(--gap-large);
    }

`;

const MobileLayout = () => {
    return (
        <div className="mobile-layout-container">
            <style>{MOBILE_UI_STYLE}</style>
            <div className="top-panel">
                <MobileTopPanel />
            </div>
            <div className="map-container">
                <MapComponent />
            </div>
            <div className="bottom-panel">
                <h1>Testing</h1>
            </div>

        </div>
    );
};

export default MobileLayout;