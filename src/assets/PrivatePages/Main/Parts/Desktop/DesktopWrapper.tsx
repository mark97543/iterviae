import BottomPanel from "./BottomPanel/BottomPanel";
import LeftPanel from "./Left Panel/LeftPanel";
import MapComponent from ".././Map/Map";
import MemberPanel from "./MemberPanel/MemberPanel";

const DesktopWrapper = () => {
    return (
        <>
            <MapComponent />
            <LeftPanel />
            <MemberPanel />
            <BottomPanel />
        </>
    );
}

export default DesktopWrapper;
