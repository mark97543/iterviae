import {useStops} from '../../../../../../context/DataContext'
import { useDirectus } from '../../../../../../context/DirectusContext';
import { useState, useEffect } from 'react';

const MOBILE_CONTROLS_STYLE = `
    .mobile-controls{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-around;
        padding-top: var(--gap-small);
        padding-bottom: var(--gap-small);
        padding-left: var(--gap-small);
        padding-right: var(--gap-small);
        box-sizing: border-box;
        gap:10px;     
    }

    .previous-stop{
        width: 100%; 
        height: 50px;   
    }

    .next-stop{
        width: 100%;
        height: 50px;
        background-color: green;
    }

    .mobile-controls h4{
        width: 100%;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;


const MobileControls = () => {
    const {stops } = useStops();
    const {currentTrip} = useDirectus()
    const [currentStop, setCurrentStop] = useState(0);
    const [disablePrevious, setDisablePrevious] = useState(true);
    const [disableNext, setDisableNext] = useState(false);


    useEffect(() => {
        setCurrentStop(0);
        setDisablePrevious(true);
        setDisableNext(false);
    }, [currentTrip]);

    useEffect(()=>{
        let size = stops.length;
        //Condition to not go below 0
        if(currentStop === 0){
            setDisablePrevious(true);
        }else{
            setDisablePrevious(false);
        }

        //Condition to not go above the last stop
        if(currentStop === size - 1){
            setDisableNext(true);
        }else{
            setDisableNext(false);
        }
    },[currentStop])

    const nextStop =() =>{
        setCurrentStop(currentStop + 1);
    }

    const previousStop =() =>{
        setCurrentStop(currentStop - 1);
    }


    return (
        <div className="mobile-controls">
            <style>{MOBILE_CONTROLS_STYLE}</style>
            <h4>{currentTrip?.trip_name}</h4>
            {/*Add here ride percentage bar */}

            <button className="std-button previous-stop" disabled={disablePrevious} onClick={previousStop}>Previous Stop</button>

            <span>
                Current Stop: {stops[currentStop]?.name}
            </span>

            <span>
                Next Stop: {stops[currentStop + 1]?.name}
            </span>
            
            {/*Add here current Stop Details */}
            {/*Add here Next Stop Details */}
            {/*Add here time and distance next stop */}
            
            
            <button className="std-button next-stop" disabled={disableNext} onClick={nextStop}>Next Stop</button>

            
        </div>
    );
};

export default MobileControls;