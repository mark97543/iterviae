import { useState, createContext, useContext } from "react";

// 1. Data Structure for a Stop
export interface Stop {
    id: string;
    name: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
    type: 'waypoint' | 'hotel' | 'gas' | 'food' | 'attraction' | 'start' | 'end';
    order: number;
}

// 2. Context Type
interface StopsContextType {
    stops: Stop[];
    setStops: React.Dispatch<React.SetStateAction<Stop[]>>;
    searchStop: {long?:any, lat?:any, address?:any};
    setSearchStop: React.Dispatch<React.SetStateAction<{long?:any, lat?:any}>>;
    showSearchMenu: boolean;
    setShowSearchMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

// 3. Create the Context
export const StopsContext = createContext<StopsContextType | null>(null);

// 4. Create the Provider Component
export const StopsProvider = ({ children }: { children: React.ReactNode }) => {
    const [stops, setStops] = useState<Stop[]>([]);
    const [searchStop, setSearchStop] = useState({long:null, lat:null});
    const [showSearchMenu, setShowSearchMenu] = useState(false);

    return (
        <StopsContext.Provider value={{ stops, setStops, searchStop, setSearchStop, showSearchMenu, setShowSearchMenu}}>
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