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
}

// 3. Create the Context
export const StopsContext = createContext<StopsContextType | null>(null);

// 4. Create the Provider Component
export const StopsProvider = ({ children }: { children: React.ReactNode }) => {
    const [stops, setStops] = useState<Stop[]>([]);

    return (
        <StopsContext.Provider value={{ stops, setStops }}>
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