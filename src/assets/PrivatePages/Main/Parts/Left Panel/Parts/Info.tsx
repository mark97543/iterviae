import {useStops} from "../../../../../../context/DataContext";
import {useDirectus} from "../../../../../../context/DirectusContext";


const Info = () =>{
    const {editMode} = useStops();
    const {currentTrip} = useDirectus();
    //const [editMode, setEditMode] = useState(false);
    console.log(currentTrip);

    return (
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {editMode ? (
                <div>
                    <h3>{currentTrip}</h3>
                </div>
            ):(
                <div>
                    <input type="text" value={currentTrip.trip_name} />
                </div>
            )}
        </div>
    )
}

export default Info;