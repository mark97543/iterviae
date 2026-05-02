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
            costing: "auto",
            costing_options: {
                auto: {
                    top_speed: 130,
                    use_primary: 1.0,
                    use_highways: 1.0,
                    use_roads: 1.0,
                    use_secondary: 1.0,
                    ignore_closures: true
                }
            },
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
                const data = await res.json();
                return data;
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

    for (let i = 0; i < results.length; i++) {
        const data = results[i];
        if (!data || !data.trip || !data.trip.legs) {
            console.error(`Valhalla returned invalid data structure for segment ${i + 1}`);
            return null; 
        }

        let segmentDistance = data.trip.summary.length; // miles
        let segmentDuration = data.trip.summary.time;   // seconds

        // NEVADA SPEED HACK (Refined for Universal use): 
        // We only trigger if the segment is very long (> 20 miles) and the speed is "Impossible" slow (< 35 mph).
        // This prevents accidentally speeding up winding mountain roads or backroads in the East.
        const avgSpeed = (segmentDistance / (segmentDuration / 3600));
        
        // console.log(`[DEBUG] Segment ${i + 1}: Distance=${segmentDistance.toFixed(1)}mi, Time=${segmentDuration}s, Speed=${avgSpeed.toFixed(1)} mph`);

        if (segmentDistance > 20 && avgSpeed < 35) {
            // Recalculate based on 65 mph (Conservative national highway average)
            const correctedDuration = Math.round((segmentDistance / 65) * 3600);
            
            console.warn(`[Speed Hack] Segment ${i + 1}: Corrected unrealistic speed (${avgSpeed.toFixed(1)} mph) to 65 mph. Time: ${segmentDuration}s -> ${correctedDuration}s`);
            
            segmentDuration = correctedDuration;
            
            // Patch BOTH the summary and the individual leg so the A5 Print Page sees it!
            data.trip.summary.time = correctedDuration;
            if (data.trip.legs && data.trip.legs[0]) {
                data.trip.legs[0].summary.time = correctedDuration;
            }
        }

        allShapes.push(...data.trip.legs.map((leg: any) => leg.shape));
        totalDistance += segmentDistance;
        totalDuration += segmentDuration;
        
        // SLIM DOWN: We only need the summary (time/distance) for the itinerary, not the maneuvers!
        allLegs.push(...data.trip.legs.map((leg: any) => ({
            summary: leg.summary,
            // We don't even need the shape here since it's already in allShapes, 
            // but we keep it if any component needs leg-specific shapes.
            shape: leg.shape 
        })));
    }

    return {
        shapes: allShapes,
        distance: totalDistance,
        duration: totalDuration,
        legs: allLegs
    }; 
};

export {getTripDirections};
