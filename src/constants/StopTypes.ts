export interface StopType {
    id: string;
    label: string;
    icon: string;
    color: string;
}

export const STOP_TYPES: StopType[] = [
    {
        id: 'start',
        label: 'Trip Start',
        icon: '🏁',
        color: '#22c55e' // Vibrant Green
    },
    {
        id: 'waypoint',
        label: 'Waypoint',
        icon: '📍',
        color: '#f97316' // Iter Viae Orange
    },
    {
        id: 'shaping',
        label: 'Shaping Point',
        icon: '💠',
        color: '#94a3b8' // Slate-400
    },
    {
        id: 'gas',
        label: 'Fuel / Gas',
        icon: '⛽',
        color: '#3b82f6' // Bright Blue
    },
    {
        id: 'food',
        label: 'Food / Rest',
        icon: '🍴',
        color: '#eab308' // Yellow
    },
    {
        id: 'hotel',
        label: 'Hotel / Stay',
        icon: '🏨',
        color: '#a855f7' // Purple
    },
    {
        id: 'attraction',
        label: 'Attraction',
        icon: '📸',
        color: '#ec4899' // Pink
    },
    {
        id: 'end',
        label: 'Final Destination',
        icon: '🏆',
        color: '#ef4444' // Red
    }
];

export const getStopType = (id: string): StopType => {
    return STOP_TYPES.find(t => t.id === id) || STOP_TYPES[1]; // Default to Waypoint
};
