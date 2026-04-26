import {type Stop} from "../../../context/DataContext";

/**
 * Gets the directions for the trip
 * @param stops Array of stops to get directions for
 * @returns Array of shapes for the trip
 */
const getTripDirections = async (stops: Stop[]) => {
    // 1. Filter out any invalid stops that don't have coordinates yet
    const validStops = stops.filter(s => s.longitude != null && s.latitude != null && !isNaN(Number(s.longitude)) && !isNaN(Number(s.latitude)));
    
    // A route requires at least a start and an end point.
    if (validStops.length < 2) return null;

    // 2. Map your dataset into the Valhalla 'locations' format
    const locations = validStops.map(stop => ({
        lon: Number(stop.longitude),
        lat: Number(stop.latitude),
        type: 'break', // Tells Valhalla to formally stop at this coordinate
    }));

    // 3. To bypass the 500km server limit, break the trip into adjacent segments
    const promises = [];
    for (let i = 0; i < locations.length - 1; i++) {
        const chunk = [locations[i], locations[i + 1]];
        const query = {
            locations: chunk,
            costing: "motorcycle",
            units: "miles"
        };

        promises.push(
            fetch(`https://valhalla.wade-usa.com/route`, {
                method: 'POST',
                body: JSON.stringify(query)
            }).then(async res => {
                if (!res.ok) {
                    console.error(`Valhalla routing failed for segment ${i + 1} with status: ${res.status}`);
                    return null;
                }
                return await res.json();
            }).catch(error => {
                console.error(`Network error on segment ${i + 1}:`, error);
                return null;
            })
        );
    }

    // 4. Fetch all segments in parallel for maximum speed
    const results = await Promise.all(promises);

    // 5. Stitch the responses together
    let allShapes = [];
    let totalDistance = 0;
    let totalDuration = 0;
    let allLegs = [];

    for (const data of results) {
        if (!data || !data.trip || !data.trip.legs) {
            console.error("Valhalla returned invalid data structure for a segment.");
            return null; // Fail gracefully if any segment fails
        }
        allShapes.push(...data.trip.legs.map((leg: any) => leg.shape));
        totalDistance += data.trip.summary.length;
        totalDuration += data.trip.summary.time;
        allLegs.push(...data.trip.legs);
    }

    return {
        shapes: allShapes,
        distance: totalDistance,
        duration: totalDuration,
        legs: allLegs
    }; 
};

export {getTripDirections};
