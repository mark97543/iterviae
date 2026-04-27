import { useEffect, useRef} from "react"
import { useStops } from "../../../../../../context/DataContext";
import TempMarkerWindow from "./TempMarkerWindow";
import { createPortal } from "react-dom";


/**
 * This component is responsible for displaying a temporary marker on the map
 * @param map 
 * @returns 
 */
const TempMarker = ({map}: {map: any}) =>{
    const {searchStop, showSearchMenu, setShowSearchMenu} = useStops();
    const searchMarker = useRef<any>(null);
    const popupRef = useRef<any>(null);
    const popupContainerRef = useRef<HTMLDivElement>(document.createElement('div'));
  

    //SIDE EFFECT: Display Temporary Search Point
    useEffect(()=>{
        
        //Exit if map is not ready or coordinates are missing
        if(!map.current || !searchStop || typeof searchStop.long !== 'number' || typeof searchStop.lat !== 'number'){
            console.log("Removing Temp Marker...");
            if (searchMarker.current) searchMarker.current.remove();
            if (popupRef.current) popupRef.current.remove();
            return;
        }
        
        //Clear previous Temp Marker
        if(searchMarker.current) searchMarker.current.remove();
        if(popupRef.current) popupRef.current.remove();
        
        //Create new marker
        const marker = new (window as any).maplibregl.Marker({ color: '#f91616ff' })
            .setLngLat([searchStop.long, searchStop.lat])
            .addTo(map.current);

        //Create the popup but dont add it to the map yet
        const popup = new (window as any).maplibregl.Popup({ 
            closeButton: false, 
            closeOnClick: false,
            offset: 40, 
            anchor: 'bottom' 
        })
        .setLngLat([searchStop.long, searchStop.lat])
        .setDOMContent(popupContainerRef.current);

        popupRef.current = popup;

        //Listener to toggle the react window
        marker.getElement().addEventListener('click', (e: Event) => {
            e.stopPropagation();
            if(!popup.isOpen()){
                popup.addTo(map.current);
                setShowSearchMenu(true);
            }else{
                popup.remove();
                setShowSearchMenu(false);
            }
        });

        searchMarker.current = marker;
        popupRef.current = popup;

        // NEW: If the menu should be shown (e.g. from a right-click), add the popup to the map immediately
        if (showSearchMenu) {
            popup.addTo(map.current);
        }

        //Center map on new marker
        map.current.flyTo({
            center: [searchStop.long, searchStop.lat],
            zoom: 14,
            essential: true,
        });

    }, [searchStop]);

    return (
        <>
           {/* The Portal "teleports" your component into the MapLibre DOM element */}
            {showSearchMenu && popupRef.current && 
                createPortal(
                    <TempMarkerWindow />, 
                    popupContainerRef.current 
                )
            }
        </>
    );
}

export default TempMarker;