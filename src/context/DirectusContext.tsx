import axios from 'axios';


import { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
// import { type Stop } from './DataContext';


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
                setTrips([...trips, result.data.data]);
                return true;
            } else {
                console.log("Error Saving Trip");
                return false;
            }
        } catch (error) {
            console.error("Failed to save trip:", error);
            return false;
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
            saveTrip 
        }}>
            {children}
        </DirectusContext.Provider>
    );
};
