import { useSearchParams } from "react-router-dom";
import {useDirectus} from "../../../context/DirectusContext"
import { useEffect, useState } from "react";
const A5PAGE_STYLE = `

    .a5-page{
        display: flex;
        flex-direction: column;
        width: 5.83in;
        height: 8.27in;
        background-color: white;
        margin: 20px auto;
        padding: 0.5in;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        border: 1px solid #dcdcdc;
        overflow: hidden;
        box-sizing: border-box;   
        page-break-after: always;
    }

    .trip-title{
        font-family: 'Georgia', 'Times New Roman', serif;
        font-size: 1.8rem;
        color: black;
        font-weight: bold;
        text-align: center;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 5px;
        padding-bottom: 10px;
        border-bottom: 2px solid black;
        width: 100%;
        box-sizing: border-box;   
    }

    .trip-summary{
        width: 100%;
        padding: 15px 0;
        margin-bottom: 10px;
        color: #222;
        font-size: 0.95rem;
        font-style: italic; 
        font-family: 'Georgia', 'Times New Roman', serif;
        line-height: 1.5;
        white-space: pre-wrap;
        text-align: center;
    }

    .trip-stats {
        width: 100%;
        margin-top: 10px;
        border-collapse: collapse;
        color: black;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }

    .trip-stats th {
        border-top: 1px solid black;
        border-bottom: 1px solid black;
        padding: 8px 4px;
        text-transform: uppercase;
        font-size: 0.65rem;
        letter-spacing: 1px;
        text-align: center;
        font-weight: bold;
    }

    .trip-stats td {
        padding: 12px 4px;
        text-align: center;
        font-size: 0.9rem;
        font-weight: bold;
        border-bottom: 1px solid black;
    }

    .notes-section {
        flex-grow: 1; 
        margin-top: 35px;
        width: 100%;
        position: relative;
        background-image: repeating-linear-gradient(
            transparent, 
            transparent 27px, 
            rgba(0,0,0,0.15) 27px, 
            rgba(0,0,0,0.15) 28px 
        );
        border-top: 1px solid rgba(0,0,0,0.15);
    }
    
    /* Adds a "NOTES" label to the top left of the notes section */
    .notes-section::before {
        content: "NOTES";
        position: absolute;
        top: -20px;
        left: 0;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 0.7rem;
        font-weight: bold;
        letter-spacing: 1px;
        color: black;
    }

    .page-number{
        color: black;
        text-align: right;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 0.75rem;
        margin-top: 15px;
    }

    @media print{
        body {
            background: none;
        }
        .a5-page {
            margin: 0 auto;
            box-shadow: none;
            border: 1px dashed #999; /* Dashed cut line */
        }
        @page{
            size: 5.83in 8.27in;
            margin: 0;
        }
    }
`;

export const A5Page = () => {
    const [searchParams] = useSearchParams();
    const tripId = searchParams.get("tripId");
    const {loadTripData} = useDirectus();
    const [currentTrip, setCurrentTrip] = useState(null);
    const STOPS_PER_PAGE = 4; // Your playground variable

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

    // Calculate Dates
    const startDate = currentTrip?.start_date ? new Date(currentTrip.start_date) : null;
    let endDate = null;
    if (startDate && currentTrip?.stop) {
        const hotelCount = currentTrip.stop.filter((s: any) => s.type === 'hotel').length;
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + hotelCount);
    }
    const formatDate = (d: Date | null) => d ? d.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }) : 'TBD';
    
    return (
        <div className="print-wrapps">
            <style>{A5PAGE_STYLE}</style>

            {/* First Page */}
            <div className="a5-page">
                
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
                        <td>{currentTrip?.distance} mi</td>
                        <td>{formatTime(currentTrip?.ride_time)}</td>
                        <td>{formatDate(startDate)}</td>
                        <td>{formatDate(endDate)}</td>
                        <td>$ {totalBudget.toFixed(2)}</td>
                    </tr>
                </table>
                {/* Flex-grow container for dynamic lines */}
                <div className="notes-section"></div>
                <div className="page-number">Page 1 of {totalPages}</div>
            </div>

            {/* Stop Pages */}
            
            {stopChunks.map((chunk,pageIndex) => (
                <div className="a5-page" key={pageIndex}>
                    <div className="trip-title">{currentTrip?.trip_name} - Stops</div>
                    {chunk.map((stop,index) => (
                        <div key={index}>
                            {/*This is where we forma the stops */}
                            {index + 1}. {stop.name}
                        </div>
                    ))}

                    <div className="notes-section"></div>
                    <div className="page-number">Page {pageIndex + 2} of {totalPages}</div>
                </div>
            ))}

            




            {/* The Last Page */}
            <div className="a5-page">
                <div className="notes-section"></div>
                <div className="page-number">Page {totalPages} of {totalPages}</div>
            </div>
        </div>
    );
}

export default A5Page;
