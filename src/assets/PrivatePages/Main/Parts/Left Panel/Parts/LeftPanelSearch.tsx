import { useState } from "react";
import { useStops } from "../../../../../../context/DataContext";

const LEFT_PANEL_SEARCH_STYLE = `
    .left-panel-search-wrapper{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--gap-medium);
        position: relative;
    }

    .left-panel-search-wrapper input{
        width: 100%;
    }

    .panel-search-button{
        width: 40px;
        height: 40px;
        margin-left: var(--gap-xsmall);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .left-panel-search-bar{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--gap-medium);
        margin-top:var(--gap-small);
        width: 100%;
    }

    .left-bar-title{
        width:250px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        text-align: center;
    }
    
    /* Search Results Dropdown Styles */
    .search-results-dropdown {
        position: absolute;
        top: 60px; /* Right below the input */
        left: 0;
        width: 100%;
        background-color: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-medium);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        max-height: 250px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }

    .search-result-item {
        padding: var(--gap-small) var(--gap-medium);
        border-bottom: 1px solid var(--border-color);
        cursor: pointer;
        transition: background-color 0.2s ease;
        text-align: left;
    }

    .search-result-item:last-child {
        border-bottom: none;
    }

    .search-result-item:hover {
        background-color: var(--accent-color-transparent);
    }

    .search-result-name {
        font-weight: bold;
        color: var(--text-color);
        font-size: 0.95rem;
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .search-result-address {
        color: var(--text-muted);
        font-size: 0.8rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .search-loading {
        padding: var(--gap-small);
        text-align: center;
        color: var(--text-muted);
        font-size: 0.9rem;
    }
`;

interface NominatimResult {
    place_id: number;
    lat: string;
    lon: string;
    display_name: string;
    name: string;
}

const LeftPanelSearch = () => {
    const { setSearchStop, search, setSearch, editMode } = useStops();
    
    const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    //Enter Key event
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') handleSearch(); 
    };

    const handleSearch = async () => {
        if (!search.trim()) return;

        // Check if the user entered coordinates (e.g., "34.05, -118.24")
        const coords = search.split(',');
        if (coords.length === 2) {
            const lat = parseFloat(coords[0]);
            const long = parseFloat(coords[1]);
            if (!isNaN(lat) && !isNaN(long)) {
                setSearchStop({ lat, long });
                setSearchResults([]);
                return;
            }
        }

        // If not coordinates, treat as an address and query Nominatim API
        setIsSearching(true);
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=5`;
            const response = await fetch(url);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Error fetching location:", error);
            // Optionally could set an error state here
        } finally {
            setIsSearching(false);
        }
    }

    const handleSelectResult = (result: NominatimResult) => {
        setSearchStop({ 
            lat: parseFloat(result.lat), 
            long: parseFloat(result.lon) 
        });
        setSearch(result.name || result.display_name.split(',')[0]); // Update input with selected name
        setSearchResults([]); // Close dropdown
    }

    const parseDisplayName = (displayName: string) => {
        const parts = displayName.split(',');
        const name = parts[0].trim();
        const address = parts.slice(1).join(',').trim();
        return { name, address };
    }

    return(        
        <div className="left-panel-search-wrapper">
            <style>{LEFT_PANEL_SEARCH_STYLE}</style>
            {editMode ? (
                <>
                    <div className="left-panel-search-bar">
                        <input 
                            className="std-input" 
                            type="text" 
                            onFocus={(e) => e.target.select()} 
                            placeholder="Search for location or Lat, Lng" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}    
                        /> 
                        <button className="std-button panel-search-button" onClick={handleSearch} disabled={isSearching}>
                            {isSearching ? '...' : <img src="./search.png" alt="Search" style={{ width: '20px', height: '20px' }}/>}
                        </button>
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {(searchResults.length > 0 || isSearching) && (
                        <div className="search-results-dropdown">
                            {isSearching ? (
                                <div className="search-loading">Searching...</div>
                            ) : (
                                searchResults.map((result) => {
                                    const { name, address } = parseDisplayName(result.display_name);
                                    return (
                                        <div 
                                            key={result.place_id} 
                                            className="search-result-item"
                                            onClick={() => handleSelectResult(result)}
                                        >
                                            <div className="search-result-name">{result.name || name}</div>
                                            <div className="search-result-address">{address}</div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    )}
                </>
            ):(<></>)}
        </div>     
    )
}

export default LeftPanelSearch;