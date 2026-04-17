import {type Stop} from "../../../context/DataContext";

/**
 * Gets the directions for the trip
 * @param stops Array of stops to get directions for
 * @returns Array of shapes for the trip
 */
const getTripDirections = async (stops: Stop[]) => {
    // A route requires at least a start and an end point.
    if (stops.length < 2) return null;

    // 1. Map your dataset into the Valhalla 'locations' format
    const locations = stops.map(stop => ({
        lon: stop.longitude,
        lat: stop.latitude,
        type: 'break', // Tells Valhalla to formally stop at this coordinate
    }));

    // 2. Build the query for the entire trip
    const query = {
        locations,
        costing: "motorcycle",
        units: "miles"
    };

    const response = await fetch(`https://valhalla.wade-usa.com/route`, {
        method: 'POST',
        body: JSON.stringify(query)
    });

    const data = await response.json();

    // 3. Valhalla returns an array of 'legs' (one for each segment between points)
    // We extract all shapes to create one continuous line
    // const fullShape = data.trip.legs.map((leg: any) => leg.shape);
    
    return {
        // 1. Array of shapes (same as before)
        shapes: data.trip.legs.map((leg: any) => leg.shape),
        // 2. Total distance in miles
        distance: data.trip.summary.length,
        // 3. Total time in seconds
        duration: data.trip.summary.time,
        // 4. Total time in seconds
        legs: data.trip.legs
    }; 
};

export {getTripDirections};
