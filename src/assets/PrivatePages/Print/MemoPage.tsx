import { useSearchParams } from "react-router-dom";
import {useDirectus} from "../../../context/DirectusContext"
import { useEffect, useState } from "react";
const MEMO_PAGE_STYLE = `

    .memo-page{
        display: flex;
        flex-direction: column;
        width: 3.5in;
        height: 5.5in;
        background-color: white;
        margin: 10px auto;
        padding: 0.3in;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        border: 1px solid #dcdcdc;
        overflow: hidden;
        box-sizing: border-box;   
        page-break-after: always;
    }

    .trip-title{
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 1.1rem;
        color: black;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: 2px;
        padding-bottom: 6px;
        border-bottom: 1.5px solid black;
        width: 100%;
        box-sizing: border-box;   
    }

    .trip-summary{
        width: 100%;
        padding: 8px 0;
        margin-bottom: 5px;
        color: #222;
        font-size: 0.7rem;
        font-style: italic; 
        font-family: 'Georgia', 'Times New Roman', serif;
        line-height: 1.3;
        white-space: pre-wrap;
        text-align: center;
    }

    .trip-stats {
        width: 100%;
        margin-top: 5px;
        border-collapse: collapse;
        color: black;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .trip-stats th {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 4px 2px;
        text-transform: uppercase;
        font-size: 0.5rem;
        letter-spacing: 0.5px;
        text-align: center;
        font-weight: bold;
    }

    .trip-stats td {
        padding: 6px 2px;
        text-align: center;
        font-size: 0.65rem;
        font-weight: bold;
        border-bottom: 1px solid black;
    }

    .notes-section {
        flex-grow: 1; 
        margin-top: 25px;
        width: 100%;
        position: relative;
        background-image: repeating-linear-gradient(
            transparent, 
            transparent 19px, 
            rgba(0,0,0,0.15) 19px, 
            rgba(0,0,0,0.15) 20px 
        );
        border-top: 1px solid rgba(0,0,0,0.15);
    }
    
    /* Adds a "NOTES" label to the top left of the notes section */
    .notes-section::before {
        content: "NOTES";
        position: absolute;
        top: -15px;
        left: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 0.55rem;
        font-weight: bold;
        letter-spacing: 1px;
        color: black;
    }

    .page-number{
        color: black;
        text-align: right;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 0.6rem;
        margin-top: auto;
        margin-bottom: -10px;
        margin-right: -10px;
    }

    /* 1. The Stop Card - Minimalist Editorial Approach */
    .trip-stop {
        background-color: transparent; 
        margin: 0 0 2px 0;
        padding: 6px 0;
        min-height: 0.6in; 
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 2px; 
    }

    /* 2. Stop Header */
    .stop-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
    }

    .stop-header h4 {
        margin: 0; 
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 0.85rem;
        font-weight: 900;
        color: #000;
        letter-spacing: -0.3px; 
        text-transform: uppercase;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 65%;
    }

    .stop-meta {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 0.45rem;
        color: #666;
        font-weight: 600;
        text-align: right;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    /* 3. Arrival Time */
    .stop-time {
        margin: 1px 0 3px 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 0.55rem;
        color: #000; 
        font-weight: 700;
        text-transform: uppercase; 
        letter-spacing: 0.5px; 
    }

    /* 4. Notes Section */
    .stop-note {
        font-family: Georgia, 'Times New Roman', Times, serif;
        font-size: 0.65rem;
        color: #000;
        font-style: italic;
        line-height: 1.3;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        padding-left: 0;
        margin-top: 2px;
    }

    /* 5. The Distance Bar */
    .distance-bar {
        display: flex;
        align-items: center;
        margin: 8px 0; 
    }

    .distance-bar::before,
    .distance-bar::after {
        content: "";
        flex: 1;
        border-bottom: 1px dotted #888;
    }

    .distance-bar span {
        padding: 2px 8px;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 0.5rem;
        font-weight: 800;
        color: #888;
        background-color: white; 
        text-transform: uppercase;
        letter-spacing: 1px;
        border: 1px solid #ddd;
        border-radius: 20px;
    }

    @media print{
        body {
            background: none;
        }
        .memo-page {
            margin: 0 auto;
            box-shadow: none;
            border: 1px dashed #999; /* Dashed cut line */
        }
        @page{
            size: 3.5in 5.5in;
            margin: 0;
        }
    }
`;

export const MemoPage = () => {
    const [searchParams] = useSearchParams();
    const tripId = searchParams.get("tripId");
    const {loadTripData} = useDirectus();
    const [currentTrip, setCurrentTrip] = useState(null);
    const STOPS_PER_PAGE = 4; // Your playground variable
    
    //Finds the Travel Times -----------------------------------------------------------------This need to be finsihed 
    const routeTImesArrival = (chunkIndex: number, pageIndex: number) =>{
        const globalIndex = chunkIndex + (pageIndex * STOPS_PER_PAGE);

        if(!currentTrip?.stop) return null;

        const currentStop = currentTrip.stop[globalIndex];

        // If it's a starting point, just return their scheduled departure time!
        if(currentStop.type === 'start' ){
            if (currentStop.start_time) {
                const [h, m] = currentStop.start_time.split(':');
                const d = new Date();
                d.setHours(Number(h), Number(m), 0);
                return d; 
            }
            return new Date(); // Default fallback
        }

        // To calculate arrival time, we step backwards to find the most recent 'hotel' or 'start'
        let baseIndex = globalIndex-1;
        while (baseIndex > 0 && currentTrip.stop[baseIndex].type !== 'start' && currentTrip.stop[baseIndex].type !== 'hotel') {
            baseIndex--;
        }

        // Parse that base departure time into seconds-from-midnight
        const baseStartTime = currentTrip.stop[baseIndex]?.start_time || "08:00";
        const [hours, minutes] = baseStartTime.split(':').map(Number);
        let totalSecondsFromMidnight = (hours * 3600) + (minutes * 60);

        // Add all driving legs and stay durations from the base stop up to THIS stop
        for (let i = baseIndex; i < globalIndex; i++) {
            // 1. Add the driving time from stop i to stop i+1
            const driveSeconds = currentTrip.route_data?.legs?.[i]?.summary?.time || 0;
            totalSecondsFromMidnight += driveSeconds;

            // 2. Add the stay duration at the intermediate stops
            if (i > baseIndex) {
                const stayMinutes = currentTrip.stop[i].stay_duration || 0;
                totalSecondsFromMidnight += (stayMinutes * 60);
            }
        }

        // Convert the final seconds back to a Date object
        const arrivalDate = new Date();
        arrivalDate.setHours(0, 0, 0, 0);
        arrivalDate.setSeconds(totalSecondsFromMidnight);
        
        return arrivalDate;
    }

    //Adds arrivaltime with stay times 
    const routeTImesDeparture = (arrival_time: any, stay_duration: number) => {
        if (!arrival_time || !stay_duration) return null;

        let arrivalDate = new Date();
        
        // If arrival_time is a string like "09:00", parse it into today's Date
        if (typeof arrival_time === 'string') {
            const [h, m] = arrival_time.split(':');
            arrivalDate.setHours(Number(h), Number(m), 0);
        } else if (typeof arrival_time === 'number') {
            // If it's raw Valhalla seconds, just add them to midnight
            arrivalDate.setHours(0, 0, 0, 0);
            arrivalDate.setSeconds(arrival_time);
        } else {
            // If it's already a Date object
            arrivalDate = arrival_time;
        }

        let durationMS = stay_duration * 60 * 1000;
        let departure = new Date(arrivalDate.getTime() + durationMS);
        
        // Return a Date object, not a raw number!
        return departure;
    }

    //Finds the distance data
    const distanceData = (chunkIndex: number, pageIndex: number)=>{
        const globalIndex = chunkIndex + (pageIndex * STOPS_PER_PAGE);

        if(currentTrip.stop[globalIndex].type ==='end' ){
            return null;
        }
        
        // Valhalla stores this in legs[index].summary.length!
        const distance = currentTrip?.route_data?.legs?.[globalIndex]?.summary?.length || 0;
        const time = currentTrip?.route_data?.legs?.[globalIndex]?.summary?.time || 0;
        
        let data = {distance:distance, time:time}
        
        return data;
    }

    const stopChunks = [];

    if (currentTrip?.stop) {
        for (let i = 0; i < currentTrip.stop.length; i += STOPS_PER_PAGE) {
            stopChunks.push(currentTrip.stop.slice(i, i + STOPS_PER_PAGE));
        }
    }

    // Helpful for your footers!
    const totalPages = 2 + stopChunks.length;

    useEffect(() => {
        if(tripId){
            loadTripData(tripId).then((trip) => {
                setCurrentTrip(trip);
            })
        }
    }, [tripId]);

    // Calculate budget up here!
    let totalBudget = 0;
    if (currentTrip?.stop) {
        currentTrip.stop.forEach((s: any) => {
            totalBudget += Number(s.budget) || 0;
        });
    }

    //Format seconds into XXhr XXmin
    function formatTime(seconds: number) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}hr ${minutes}min`;
    }

    // Calculate Dates (Pure string-based to avoid timezone shifts)
    const formatDateString = (str: string | undefined | null) => {
        if (!str) return 'TBD';
        const datePart = str.split('T')[0];
        const [y, m, d] = datePart.split('-');
        if (!y || !m || !d) return 'TBD';
        return `${m}/${d}/${y.slice(-2)}`;
    };

    const tripStartDateDisplay = formatDateString(currentTrip?.start_date);
    
    // For the End Date, we still need to calculate the offset based on hotel stays
    const tripEndDateDisplay = (() => {
        if (!currentTrip?.start_date) return 'TBD';
        const [y, m, d] = currentTrip.start_date.split('T')[0].split('-').map(Number);
        const date = new Date(y, m - 1, d);
        const hotelCount = currentTrip.stop?.filter((s: any) => s.type === 'hotel').length || 0;
        date.setDate(date.getDate() + hotelCount);
        return formatDateString(date.toISOString());
    })();

    const formatClockTime = (d: Date | null) => d ? d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'TBD';
    

    return (
        <div className="print-wrapps">
            <style>{MEMO_PAGE_STYLE}</style>

            {/* First Page */}
            <div className="memo-page">
                
                <div className="trip-title">{currentTrip?.trip_name}</div>
                <div className="trip-summary">
                    {currentTrip?.summary}
                </div>
                <table className="trip-stats">
                    <tr>
                        <th>Distance</th>
                        <th>Duration</th>
                        <th>Start</th>
                        <th>End</th>
                        <th>Budget</th>
                    </tr>
                    <tr>
                        <td>{Number(currentTrip?.distance).toFixed(1)} mi</td>
                        <td>{formatTime(currentTrip?.ride_time)}</td>
                        <td>{tripStartDateDisplay}</td>
                        <td>{tripEndDateDisplay}</td>
                        <td>$ {totalBudget.toFixed(2)}</td>
                    </tr>
                </table>
                {/* Flex-grow container for dynamic lines */}
                <div className="notes-section"></div>
                <div className="page-number">Page 1 of {totalPages}</div>
            </div>

            {/* Stop Pages */}
            
            {stopChunks.map((chunk,pageIndex) => (
                <div className="memo-page" key={pageIndex}>
                    <div className="trip-title">{currentTrip?.trip_name} - Stops</div>
                    {chunk.map((stop,index) => (
                        <div>
                            <div className="trip-stop" key={index}>
                                {/* Header: Title on the left, Meta on the right */}
                                <div className="stop-header">
                                    <h4>{stop.name}</h4>
                                    <span className="stop-meta">
                                        {Number(stop.latitude).toFixed(4)}, {Number(stop.longitude).toFixed(4)}
                                        {Number(stop.budget) > 0 && ` | Budget: $${Number(stop.budget).toFixed(2)}`}
                                    </span>
                                </div>
                                
                                {/* Time Bar */}
                                <div className="stop-time">
                                    {stop.type !== 'start' && (
                                        <><b>ARRIVE:</b> {formatClockTime(routeTImesArrival(index, pageIndex))}</>
                                    )}

                                    {stop.type !== 'start' && stop.type !== 'end' && stop.stay_duration ? (
                                        <><b> | BREAK:</b> {stop.stay_duration} MIN</>
                                    ) : null}

                                    {stop.type !== 'end' && (
                                        <>
                                            {stop.type !== 'start' ? ' | ' : ''}
                                            <b>DEPART:</b> {(stop.type === 'start' || stop.type === 'hotel') 
                                                ? stop.start_time + ' on ' + tripStartDateDisplay
                                                : formatClockTime(routeTImesDeparture(routeTImesArrival(index, pageIndex), stop.stay_duration || 0))
                                            }
                                        </>
                                    )}
                                </div>                

                                {/* Notes Section */}
                                {stop.note && (
                                    <div className="stop-note">
                                        <b>Note:</b> {stop.note}
                                    </div>
                                )}
                            </div>
                            <div className="distance-bar">
                                <span>
                                    {distanceData(index, pageIndex)?.distance?.toFixed(1)} mi | {formatTime(distanceData(index, pageIndex)?.time || 0)}
                                </span>
                            </div>
                  
                        </div>
                    ))}

                    {/* <div className="notes-section"></div> */}
                    <div className="page-number">Page {pageIndex + 2} of {totalPages}</div>
                </div>
            ))}

            




            {/* The Last Page */}
            <div className="memo-page">
                <div className="notes-section"></div>
                <div className="page-number">Page {totalPages} of {totalPages}</div>
            </div>
        </div>
    );
}

export default MemoPage;
