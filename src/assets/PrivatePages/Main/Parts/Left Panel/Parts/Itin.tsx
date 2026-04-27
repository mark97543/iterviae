import {useStops} from "../../../../../../context/DataContext";
import { useDirectus } from "../../../../../../context/DirectusContext";

const ITIN_STYLE = `

`;

const Itin = () =>{

    const {currentTrip, setCurrentTrip} = useDirectus();
    const {editMode} = useStops();
    console.log(currentTrip);

    return(
        <div>
            <style>{ITIN_STYLE}</style>
            {editMode ? <EditMode /> : <ViewMode />}
        </div>
    )
}

export default Itin;

const EditMode =() =>{
    const {currentTrip, setCurrentTrip} = useDirectus();
    return(
        <div>
            <style>{ITIN_STYLE}</style>
            <input
                type='date'
                value={currentTrip?.start_date}
                className="std-input"
                onChange={(e) => setCurrentTrip({...currentTrip, start_date: e.target.value})}
            />
        </div>
    )
}

const ViewMode =() =>{
    const {currentTrip} = useDirectus();
    return(
        <div>
            <style>{ITIN_STYLE}</style>
            <h4>{currentTrip?.start_date || "Select Date"}</h4>
        </div>
    )
}
