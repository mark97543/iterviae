import axios from 'axios';
import { useStops } from './DataContext';
import { useAuth } from './AuthContext';
import { createContext, useContext, useState, useEffect } from 'react';
import { type Stop } from './DataContext';

// ** New Interface for Trips **
export interface Trip {
    id?: string;
    trip_name?: string;
    summary?: string;
    status?: string;
    distance?: number;
    ride_time?: number;
    stop?: Stop[];
}


export const DirectusContext = createContext<any>(null);

export const useDirectus = () => useContext(DirectusContext);

export const DirectusProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [directus, setDirectus] = useState(null);
    const [trips, setTrips] = useState<Trip[]>([]); /// All Trips for for this user 
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null); /// Selected Trip for this user
    const {stops,setEditMode, setStops, route} = useStops();

    // Wipe session data when user logs out
    useEffect(() => {
        if (!user) {
            setTrips([]);
            setCurrentTrip(null);
        }
    }, [user]);

    //Save Trip to Directus Database
    const saveTrip = async (tripName: string) => {
        try {
            const token = localStorage.getItem('instrumentum_token');
            const result = await axios.post(`https://api.wade-usa.com/items/trip`, {
                trip_name: tripName,
                user_id: user?.id,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(result.status === 200){
                console.log("Trip Saved Successfully");
                const newTrip = result.data.data;
                setTrips([...trips, newTrip]);
                return newTrip;
            } else {
                console.log("Error Saving Trip");
                return null;
            }
        } catch (error) {
            console.error("Failed to save trip:", error);
            return null;
        }
    }

    //Load Trips from Directus Database
    const loadTrips = async () => {
        try {
            const token = localStorage.getItem('instrumentum_token');
            if (!token || !user?.id) return null;

            const result = await axios.get(`https://api.wade-usa.com/items/trip`, {
                params: {
                    fields: 'id,trip_name, distance, ride_time, status',
                    filter: {
                        user_created: {
                            _eq: user.id
                        }
                    }
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(result.status === 200){
                console.log("Trips Loaded Successfully");
                const loadedTrips = result.data.data;
                setTrips(loadedTrips);
                return loadedTrips;
            } else {
                console.log("Error Loading Trips");
                return null;
            }
        } catch (error) {
            console.error("Failed to load trips:", error);
            return null;
        }
    }

    //Load data by selected trip ID
    const loadTripData = async (tripId: string) => {
        try {
            const token = localStorage.getItem('instrumentum_token');
            if (!token || !tripId) return null;

            const result = await axios.get(`https://api.wade-usa.com/items/trip`, {
                params: {
                    fields: '*,stop.*',
                    filter: {
                        id: {
                            _eq: tripId
                        }
                    }
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            
            if(result.status === 200){
                // console.log("Trip Data Loaded Successfully", result.data.data[0].stop);
                const loadedTripData = result.data.data[0];
                setCurrentTrip(loadedTripData);
                return loadedTripData;
            } else {
                console.log("Error Loading Trip Data");
                return null;
            }
        } catch (error) {
            console.error("Failed to load trip data:", error);
            return null;
        }
    }

    //Save Trip by ID
    const saveTripByID = async (tripId: string, silent: boolean = false, stopsToSave?: Stop[]) => {
        try {
            const token = localStorage.getItem('instrumentum_token');
            if (!token || !tripId) return null;

            const createStops: any[] = [];
            const updateStops: any[] = [];

            // Use the provided stops or fall back to the context state
            const finalStops = stopsToSave || stops;

            finalStops.forEach((stop: any) => {
                const isTemp = !stop.id || 
                               stop.id.toString().startsWith('temp_') || 
                               (!isNaN(Number(stop.id)) && stop.id.toString().length > 10);
                
                if (isTemp) {
                    const { id, trip, trip_id, ...rest } = stop;
                    createStops.push(rest);
                } else {
                    const { trip, trip_id, ...rest } = stop; // Clean up just in case
                    updateStops.push(rest);
                }
            });

            const result = await axios.patch(`https://api.wade-usa.com/items/trip/${tripId}`, {
                trip_name: currentTrip?.trip_name,
                status: currentTrip?.status,
                summary: currentTrip?.summary,
                distance: route?.distance,
                ride_time: route?.duration,
                stop: {
                    create: createStops,
                    update: updateStops
                }
            }, {
                params: {
                    fields: '*,stop.*' // Ensure we get the full updated trip back
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(result.status === 200){
                console.log("Trip Updated Successfully");
                const updatedTrip = result.data.data;
                
                // Update local trips list
                setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
                
                // Sync local stops with the new IDs from the database
                if (updatedTrip.stop) {
                    setStops(updatedTrip.stop);
                }

                if (!silent) {
                    setEditMode(false); // Only exit edit mode if NOT a silent save
                }
                
                return updatedTrip;
            } else {
                console.log("Error Saving Trip");
                return null;
            }
        } catch (error) {
            console.error("Failed to save trip:", error);
            return null;
        }
    }

    //Delete Trip By ID
    const deleteTripByID = async (tripId: string) => {
        try {
            const token = localStorage.getItem('instrumentum_token');
            if (!token || !tripId) return null;

            const result = await axios.delete(`https://api.wade-usa.com/items/trip/${tripId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(result.status === 200 || result.status === 204){
                console.log("Trip Deleted Successfully");
                setTrips((prevTrips: any[]) => prevTrips.filter((t: any) => t.id !== tripId));
                return true;
            } else {
                console.log("Error Deleting Trip");
                return null;
            }
        } catch (error) {
            console.error("Failed to delete trip:", error);
            return null;
        }
    }

    //Delete Waypoint By ID
    const deleteWaypointByID = async (waypointId: string) => {
        try {
            const token = localStorage.getItem('instrumentum_token');
            if (!token || !waypointId) return null;

            const result = await axios.delete(`https://api.wade-usa.com/items/stops/${waypointId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(result.status === 200 || result.status === 204){
                console.log("Waypoint Deleted Successfully");
                setStops((prevStops: any[]) => prevStops.filter((s: any) => s.id !== waypointId));
                return true;
            } else {
                console.log("Error Deleting Waypoint");
                return null;
            }
        } catch (error: any) {
            console.error("Failed to delete waypoint:", error);
            if (error.response && error.response.data && error.response.data.errors) {
                console.error("Directus Error Details:", error.response.data.errors);
            }
            return null;
        }
    }

    return (
        <DirectusContext.Provider value={{ 
            directus, 
            trips, 
            currentTrip, 
            setDirectus, 
            setTrips, 
            setCurrentTrip,
            saveTrip,
            loadTrips,
            loadTripData,
            saveTripByID,
            deleteTripByID,
            deleteWaypointByID
        }}>
            {children}
        </DirectusContext.Provider>
    );
};
