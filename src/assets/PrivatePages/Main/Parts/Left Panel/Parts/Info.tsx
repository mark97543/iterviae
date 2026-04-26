import {useStops} from "../../../../../../context/DataContext";
import {useDirectus} from "../../../../../../context/DirectusContext";

const InfoStyle = `
    .info-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const Info = () =>{
    const {editMode} = useStops();
    const {currentTrip,setCurrentTrip} = useDirectus();
    //const [editMode, setEditMode] = useState(false);
    console.log(currentTrip);

    return (
        <div className='info-wrapper'>
            <style>{InfoStyle}</style>
            {editMode ? (
                <div>
                    <input 
                        className="std-input" 
                        type="text" 
                        value={currentTrip?.trip_name}
                        onChange={(e) => setCurrentTrip({...currentTrip, trip_name: e.target.value})}
                    />
                </div>
            ):(
                <div>
                   <h3 style={{margin: 0, color: 'var(--color-primary)'}}>{currentTrip?.trip_name || 'Unnamed Trip'}</h3>
                </div>
            )}
        </div>
    )
}

export default Info;