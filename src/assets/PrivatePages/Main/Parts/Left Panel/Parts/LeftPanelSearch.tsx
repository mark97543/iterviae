import { useState } from "react";
import { useStops } from "../../../../../../context/DataContext";


const LEFT_PANEL_SEARCH_STYLE = `
    .left-panel-search-wrapper{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--gap-medium);
    }

    .left-panel-search-wrapper input{
        width: 100%;
    }

    .panel-search-button{
        width: 40px;
        height: 40px;
        margin-left: var(--gap-xsmall);
    }

`;


const LeftPanelSearch = () => {
    const [search, setSearch] = useState("");
    const {setSearchStop} = useStops();

    //Enter Key event
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') handleSearch(); 
    };

    const handleSearch = () =>{
        //Break the long/lat up based on comma and convert to numbers
        const coords = search.split(',');
        if(coords.length === 2){
            setSearchStop({lat: parseFloat(coords[0]), long: parseFloat(coords[1])});
        }
    }

    return(        
        <div className="left-panel-search-wrapper">
            <style>{LEFT_PANEL_SEARCH_STYLE}</style>
            <input 
                className="std-input" 
                type="text" 
                onFocus={(e) => e.target.select()} 
                placeholder="Search for location" 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}    
            /> 
            <button className="std-button panel-search-button" onClick={handleSearch}><img src="./search.png" alt="Search" /></button>
        </div>     
    )
}

export default LeftPanelSearch;