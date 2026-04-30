import MapComponent from "../Map/Map";
import MobileTopPanel from "./Parts/MobileTopPanel";
import MobileControls from "./Parts/MobileControls";

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
        height: 40vh;
        position: relative;
        background: #09090b;
        display: flex;
        flex-direction: column;
        border-bottom: 2px solid var(--color-accent);
        flex-shrink: 0;
    }

    .bottom-panel {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
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
                <MobileControls />
            </div>

        </div>
    );
};

export default MobileLayout;