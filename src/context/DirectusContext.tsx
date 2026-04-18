//Build basic Context here to call the Directus Database

import { createContext, useState } from 'react';
// import { useAuth } from './AuthContext';
// import { type Stop } from './DataContext';


// ** New Interface for Trips **
export interface Trip {
    id?: string;
    name?: string;

}


export const DirectusContext = createContext(null);

export const DirectusProvider = ({ children }: { children: React.ReactNode }) => {
    const [directus, setDirectus] = useState(null);
    const [trips, setTrips] = useState<Trip[]>([]); /// All Trips for for this user 
    const [currentTrip, setCurrentTrip] = useState<Trip | null>(null); /// Selected Trip for this user


    return (
        <DirectusContext.Provider value={{ directus, trips, currentTrip, setDirectus, setTrips, setCurrentTrip }}>
            {children}
        </DirectusContext.Provider>
    );
};
