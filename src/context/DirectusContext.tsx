import axios from 'axios';
import { useStops } from './DataContext';
import { useAuth } from './AuthContext';
import { createContext, useContext, useState } from 'react';

// ** New Interface for Trips **
export interface Trip {
    id?: string;
    trip_name?: string; 
}


export const DirectusContext = createContext<any>(null);

export const useDirectus = () => useContext(DirectusContext);

export const DirectusProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [directus, setDirectus] = useState(null);
    const [trips, setTrips] = useState<Trip[]>([]); /// All Trips for for this user 
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null); /// Selected Trip for this user
    const {stops} = useStops();

    //Save Trip to Directus Database
    const saveTrip = async (tripName: string) => {
        try {
            const token = sessionStorage.getItem('instrumentum_token');
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
            const token = sessionStorage.getItem('instrumentum_token');
            if (!token || !user?.id) return null;

            const result = await axios.get(`https://api.wade-usa.com/items/trip`, {
                params: {
                    fields: 'id,trip_name',
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
            const token = sessionStorage.getItem('instrumentum_token');
            if (!token || !tripId) return null;

            const result = await axios.get(`https://api.wade-usa.com/items/trip`, {
                params: {
                    fields: 'id,trip_name,stop.id,stop.sort,stop.name,stop.longitude,stop.latitude',
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
    const saveTripByID = async (tripId: string) => {
        console.log(tripId)
        try {
            const token = sessionStorage.getItem('instrumentum_token');
            if (!token || !tripId) return null;

            const createStops: any[] = [];
            const updateStops: any[] = [];

            stops.forEach((stop: any) => {
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
                stop: {
                    create: createStops,
                    update: updateStops
                }
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(result.status === 200){
                console.log("Trip Updated Successfully");
                const updatedTrip = result.data.data;
                setTrips(trips.map(t => t.id === updatedTrip.id ? updatedTrip : t));
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
            const token = sessionStorage.getItem('instrumentum_token');
            if (!token || !tripId) return null;

            const result = await axios.delete(`https://api.wade-usa.com/items/trip/${tripId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if(result.status === 200){
                console.log("Trip Deleted Successfully");
                const deletedTrip = result.data.data;
                setTrips(trips.filter(t => t.id !== deletedTrip.id));
                return deletedTrip;
            } else {
                console.log("Error Deleting Trip");
                return null;
            }
        } catch (error) {
            console.error("Failed to delete trip:", error);
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
            deleteTripByID
        }}>
            {children}
        </DirectusContext.Provider>
    );
};
