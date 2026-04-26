import { useState, createContext, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

// 1. Data Structure for a Stop
export interface Stop {
    id?: string;
    name?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    type?: 'waypoint' | 'hotel' | 'gas' | 'food' | 'attraction' | 'start' | 'end';
    order?: number;
}

// Interface for the trip data structure
export interface TripData {
    id: string;
    trip_name: string;
    summary?: string;
    stop: Stop[];
}

// 2. Context Type
interface StopsContextType {
    stops: Stop[];
    setStops: React.Dispatch<React.SetStateAction<Stop[]>>;
    searchStop: {long?:any, lat?:any, address?:any};
    setSearchStop: React.Dispatch<React.SetStateAction<{long?:any, lat?:any}>>;
    showSearchMenu: boolean;
    setShowSearchMenu: React.Dispatch<React.SetStateAction<boolean>>;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    route: any;
    setRoute: React.Dispatch<React.SetStateAction<any>>;
    selectedTrip: string;
    setSelectedTrip: React.Dispatch<React.SetStateAction<string>>;
    editMode: boolean;
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
    focusedID: string;
    setFocusedID: React.Dispatch<React.SetStateAction<string>>;
}

// 3. Create the Context
export const StopsContext = createContext<StopsContextType | null>(null);

// 4. Create the Provider Component
export const StopsProvider = ({ children }: { children: React.ReactNode }) => {
    const [stops, setStops] = useState<Stop[]>([]); //The stops for the current trip 
    const [searchStop, setSearchStop] = useState({long:null, lat:null}); // The stop that is being searched for 
    const [showSearchMenu, setShowSearchMenu] = useState(false); // Whether the search menu is open 
    const [search, setSearch] = useState(""); // The search term for waypoints
    const [route, setRoute] = useState(null); // The route for the current trip 
    const [selectedTrip, setSelectedTrip] = useState(""); // The selected trip to load this is the trip ID
    const [editMode,setEditMode]=useState(false) // Whether the trip is in edit mode 
    const { user } = useAuth();
    const [focusedID, setFocusedID] = useState(null); // The focused ID for the map to use

    // SIDE EFFECT: Wipe all mapping data out of memory on Logout
    useEffect(() => {
        if (!user) {
            setStops([]);
            setSearchStop({long:null, lat:null});
            setShowSearchMenu(false);
            setSearch("");
            setRoute(null);
            setSelectedTrip("");
            setEditMode(false);
        }
    }, [user]);

    

    return (
        <StopsContext.Provider value={{ 
            stops, 
            setStops, 
            searchStop, 
            setSearchStop, 
            showSearchMenu, 
            setShowSearchMenu, 
            search, 
            setSearch,
            route,
            setRoute,
            selectedTrip,
            setSelectedTrip,
            editMode,
            setEditMode,
            focusedID,
            setFocusedID
            }}>
            {children}
        </StopsContext.Provider>
    );
};

// 5. Custom hook — use this in any component
export const useStops = (): StopsContextType => {
    const context = useContext(StopsContext);
    if (!context) throw new Error('useStops must be used within a StopsProvider');
    return context;
};