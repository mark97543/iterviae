import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useStops } from '../../../../../context/DataContext';
import TempMarker from './Temp Marker/TempMarker';
import polyline from '@mapbox/polyline';
import MarkerPopup from './MarkerPopup/MarkerPopup';
import { getTripDirections } from '../../valhala';
import { useDirectus } from '../../../../../context/DirectusContext';
import { getStopType } from '../../../../../constants/StopTypes';
/**
 * CLASSICAL MECHANICS: UI STYLING
 * Defining the visual boundaries of the application.
 * Using a high-contrast dark theme to ensure readability in sunlight.
 */
const MAP_STYLES = `

    .top-nav {
        height: 60px;
        background-color: rgba(9, 9, 11, 0.9);
        border-bottom: 1px solid #27272a;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        z-index: 10;
    }

    .map-wrapper {
        flex: 1;
        position: relative;
        width: 100%;
        background: #09090b;
    }

    #map-container {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
    }

    .custom-marker {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 32px;
        height: 42px; /* Taller to accommodate the tip */
        cursor: pointer;
        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.4));
    }

    .marker-head {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        z-index: 2;
    }

    .marker-tip {
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 10px solid #fff; /* We will color this with JS to match the head */
        margin-top: -1px; /* Slight overlap to prevent gaps */
    }

    .map-overlay-card {
        position: absolute;
        top: 20px;
        left: 20px;
        z-index: 5;
        background: rgba(9, 9, 11, 0.85);
        backdrop-filter: blur(8px);
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #333;
        width: 280px;
        pointer-events: auto;
    }

    .btn-orange {
        background: #f97316;
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        font-size: 12px;
        text-transform: uppercase;
        transition: opacity 0.2s;
    }

    .btn-orange:hover {
        opacity: 0.9;
    }

    .status-dot {
        height: 8px;
        width: 8px;
        background-color: #22c55e;
        border-radius: 50%;
        display: inline-block;
        margin-right: 8px;
    }

    .maplibregl-marker {
        cursor: pointer;
    }

    /* POPUP RESET: Kill the default MapLibre white box */
    .maplibregl-popup-content {
        background: none !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
    }

    .maplibregl-popup-tip {
        display: none !important; /* Hide the default tip since we have our own needle */
    }

    .maplibregl-popup-close-button {
        display: none !important; /* Hide the default close button */
    }
`;

const MAP_POINT_ZOOM = 15;

/**
 * THE CARTESIAN PLANE: MAP COMPONENT
 * This internal component handles the MapLibre engine.
 * It translates the "Classical" data from the database into the "Romantic" visual map.
 */
const MapComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const markerRoots = useRef<Map<string, any>>(new Map());
    const [mapLoaded, setMapLoaded] = useState(false);
    const {stops, route, setStops, editMode, setRoute, focusedID, setFocusedID, setSearchStop, setShowSearchMenu} = useStops();
    const { deleteWaypointByID, currentTrip, saveTripByID } = useDirectus();

    // Use a ref for editMode so the map listeners (which are set once) can always see the current value
    const editModeRef = useRef(editMode);
    useEffect(() => {
        editModeRef.current = editMode;
    }, [editMode]);


    // SIDE EFFECT: Load External Map Assets
    // We dynamically inject the MapLibre CSS and JS to keep the bundle clean.
    useEffect(()=>{
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.js';
        script.onload = () =>{
            if(map.current) return;
            // Initializing the Map instance centered on the Western US
            map.current = new (window as any).maplibregl.Map({
                container:'map-container',
                // style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json', //Dark Matter Style
                // style: 'https://basemaps.cartocdn.com/gl/positron-nolabels-dark-v1/style.json', //Dark Style No Labels
                // style: 'https://basemaps.cartocdn.com/gl/voyager-nolabels-v1/style.json', //Voyager Style No Labels
                // style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', //Voyager Style labels
                // style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', //Light Theme Labels
                // style: 'https://basemaps.cartocdn.com/gl/positron-nolabels-v1/style.json', //Light Theme No Labels  
                // style: 'https://tiles.openfreemap.org/styles/bright', //Liberty
                style: 'https://tiles.openfreemap.org/styles/bright',//Open Free Map Bright
                // style:'https://tiles.openfreemap.org/styles/dark',//Open Free Map Dark

                center: [-114.35, 43.5], // Centered on the Western US
                zoom: 5, // Zoomed out to show the region
            });

            //Right Clck Add Point to route
            map.current.on('contextmenu', (e:any)=>{
                // Only allow adding points if we are in Edit Mode
                if (!editModeRef.current) return;

                // This prevents default browser menu
                e.preventDefault();

                // Close any open popups to prevent unexpected zooming to previous points
                for (const [id, markerData] of markerRoots.current.entries()) {
                    const popup = markerData.marker.getPopup();
                    if (popup && popup.isOpen()) {
                        popup.remove();
                    }
                }

                //The coordinated of where clicked  
                const lngLat = e.lngLat;

                //Use context functions to trigger temp marker
                setSearchStop({lat: lngLat.lat, long: lngLat.lng});
                setShowSearchMenu(true);
            });

            // Left Click to clear the temporary marker and break focus
            map.current.on('click', () => {
                console.log("Map background clicked! Clearing temp marker...");
                setSearchStop(null);
                setShowSearchMenu(false);
                setFocusedID(null);
            });

            // If the user manually drags the map, break the focus so they can click the sidebar to re-center
            map.current.on('dragstart', () => {
                setFocusedID(null);
            });
            
           map.current.addControl(new (window as any).maplibregl.FullscreenControl(), 'bottom-right');
           map.current.addControl(new (window as any).maplibregl.NavigationControl(), 'bottom-right');
           
           map.current.on('load', () => {
               setMapLoaded(true);
           });
        }
        document.head.appendChild(script);

        return ()=>{
            if (map.current) map.current.remove();
        }



    },[])

    // SIDE EFFECT: Fetch Valhalla Route
    // We debounce this so we don't spam the API while the user is typing coordinates
    useEffect(() => {
        if (!stops || stops.length < 2) {
            setRoute(null);
            return;
        }

        // PERFORMANCE OPTIMIZATION: 
        // If we already have a route loaded from Directus and we ARE NOT editing,
        // do not waste time/bandwidth fetching a new one from Valhalla.
        if (route && !editMode) {
            return;
        }
        
        const timer = setTimeout(async () => {
            try {
                const newRoute = await getTripDirections(stops);
                if (newRoute) setRoute(newRoute);
            } catch (err) {
                console.error("Failed to fetch route:", err);
            }
        }, 1000); // 1 second debounce
        
        return () => clearTimeout(timer);
    }, [stops, setRoute, editMode, route]); // Added editMode and route to dependencies

    // SIDE EFFECT: Sync Markers with Directus Data
    useEffect(()=>{
        if(!map.current || !(window as any).maplibregl) return;

        const currentStopIds = new Set(stops.map((s: any) => s.id));

        // 1. Remove markers that no longer exist in the stops array
        for (const [id, data] of markerRoots.current.entries()) {
            if (!currentStopIds.has(id)) {
                data.marker.remove();
                setTimeout(() => data.root.unmount(), 0); // Safely unmount React tree
                markerRoots.current.delete(id);
            }
        }

        // Time Tracking Logic for Popups
        let currentDayOffset = 0;
        const getBaseDateStr = (offset: number) => {
            const d = (() => {
                if (!currentTrip?.start_date) return new Date();
                const [y, m, dPart] = currentTrip.start_date.split('T')[0].split('-').map(Number);
                return new Date(y, m - 1, dPart);
            })();
            d.setDate(d.getDate() + offset);
            return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
        };

        let runningTime = new Date(`${getBaseDateStr(0)}T09:00:00`);

        // 2. Create new markers or update existing ones
        stops.forEach((point: any, index: number) => {
            if (point.longitude && point.latitude) {
                const stopType = getStopType(point.type);

                // Handle Time Tracking
                const arrivalTime = new Date(runningTime);
                const stayMins = point.stay_duration || 0;
                
                let departureTime: Date;
                if (point.type === 'hotel' && index !== 0 && index !== stops.length - 1) {
                    currentDayOffset++;
                    const nextDayStr = getBaseDateStr(currentDayOffset);
                    departureTime = new Date(`${nextDayStr}T${point.start_time || '09:00'}:00`);
                    runningTime = new Date(departureTime); 
                } else if (point.type === 'start' && point.start_time) {
                    departureTime = new Date(`${getBaseDateStr(currentDayOffset)}T${point.start_time}:00`);
                    runningTime = new Date(departureTime);
                } else {
                    runningTime.setMinutes(runningTime.getMinutes() + stayMins);
                    departureTime = new Date(runningTime);
                }

                const leg = route?.legs?.[index];
                if (leg) {
                    runningTime.setSeconds(runningTime.getSeconds() + leg.summary.time);
                }

                const existing = markerRoots.current.get(point.id);

                if (!existing) {
                    const popupNode = document.createElement('div');
                    const root = createRoot(popupNode);
                    
                    const el = document.createElement('div');
                    el.className = 'custom-marker';
                    el.innerHTML = `
                        <div class="marker-head" style="background-color: ${stopType.color};">
                            <span>${stopType.icon}</span>
                        </div>
                        <div class="marker-tip" style="border-top-color: ${stopType.color};"></div>
                    `;

                    const popup = new (window as any).maplibregl.Popup({ offset: 25, maxWidth: 'none' }).setDOMContent(popupNode);

                    const m = new (window as any).maplibregl.Marker({ element: el, draggable: editMode, anchor: 'bottom' })
                        .setLngLat([point.longitude, point.latitude])
                        .setPopup(popup)
                        .addTo(map.current);
                        
                    // Race condition fix: If this is the focusedID (but wasn't loaded yet), fly to it now!
                    if (point.id === focusedID) {
                        map.current.flyTo({
                            center: [point.longitude, point.latitude],
                            zoom: MAP_POINT_ZOOM,
                            duration: 2500,
                            essential: true,
                        });
                        m.togglePopup();
                    }
                        
                    m.on('dragend', () => {
                        const lngLat = m.getLngLat();
                        setStops((prevStops: any[]) => prevStops.map((s: any) => 
                            s.id === point.id ? { ...s, latitude: lngLat.lat, longitude: lngLat.lng } : s
                        ));
                    });

                    root.render(
                        <MarkerPopup 
                            point={point} 
                            stops={stops} 
                            setStops={setStops} 
                            editMode={editMode} 
                            deleteWaypointByID={deleteWaypointByID}
                            saveTripByID={saveTripByID}
                            currentTrip={currentTrip}
                            arrivalTime={arrivalTime}
                            departureTime={departureTime}
                        />
                    );

                    markerRoots.current.set(point.id, { marker: m, root: root, popupNode: popupNode });
                } else {
                    // Update Existing
                    existing.marker.setLngLat([point.longitude, point.latitude]);
                    existing.marker.setDraggable(editMode);
                    
                    const el = existing.marker.getElement();
                    const head = el.querySelector('.marker-head') as HTMLElement;
                    const tip = el.querySelector('.marker-tip') as HTMLElement;
                    if (head) {
                        head.style.backgroundColor = stopType.color;
                        head.innerHTML = `<span>${stopType.icon}</span>`;
                    }
                    if (tip) tip.style.borderTopColor = stopType.color;

                    existing.root.render(
                        <MarkerPopup 
                            point={point} 
                            stops={stops} 
                            setStops={setStops} 
                            editMode={editMode} 
                            deleteWaypointByID={deleteWaypointByID}
                            saveTripByID={saveTripByID}
                            currentTrip={currentTrip}
                            arrivalTime={arrivalTime}
                            departureTime={departureTime}
                        />
                    );
                }
            }
        });
    }, [stops, editMode, route, currentTrip?.start_date, deleteWaypointByID, setStops]);

    // SIDE EFFECT: Listen for focus requests from the sidebar
    useEffect(() => {
        if (!mapLoaded || !map.current || !focusedID) return;

        // Close all other popups first to prevent multiple popups showing at once
        for (const [id, markerData] of markerRoots.current.entries()) {
            const popup = markerData.marker.getPopup();
            if (id !== focusedID && popup && popup.isOpen()) {
                popup.remove(); // This safely closes the popup in MapLibre
            }
        }

        const data = markerRoots.current.get(focusedID);
        if (data && data.marker) {
            const lngLat = data.marker.getLngLat();
            map.current.flyTo({
                center: [lngLat.lng, lngLat.lat],
                zoom: MAP_POINT_ZOOM, // Zoom in to see the stop
                duration: 2500, // Slightly longer duration for the dramatic fly animation
                essential: true,
            });
            
            // Optional: Automatically open the popup when focused
            if (!data.marker.getPopup().isOpen()) {
                data.marker.togglePopup();
            }
        }
    }, [focusedID, mapLoaded]); // Removed stops here so typing DOES NOT trigger the camera snap

    // SIDE EFFECT: Draw Valhalla Route Polyline
    useEffect(() => {
        if (!mapLoaded || !map.current || !route || !route.shapes || !Array.isArray(route.shapes)) return;

        // Route is an array of encoded polyline shapes (one for each leg of the trip).
        // Decode them using @mapbox/polyline (Valhalla precision is 6).
        let allCoords: number[][] = [];
        route.shapes.forEach((shapeStr: string) => {
            const decoded = polyline.decode(shapeStr, 6);
            const segmentCoords = decoded.map(([lat, lon]: number[]) => [lon, lat]);
            allCoords = [...allCoords, ...segmentCoords];
        });

        // Push data to a GeoJSON layer on MapLibre
        const geojsonData = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: allCoords
            }
        };

        if (map.current.getSource('route-source')) {
            // If the source exists, update the data dynamically
            map.current.getSource('route-source').setData(geojsonData);
        } else {
            // First time loading the route, build the source and styling
            map.current.addSource('route-source', {
                type: 'geojson',
                data: geojsonData
            });
            map.current.addLayer({
                id: 'route-layer',
                type: 'line',
                source: 'route-source',
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#0d4a7cff', // Vibrant Iter Viae Orange
                    'line-width': 5,
                    'line-opacity': 0.8
                }
            });
        }
    }, [route, mapLoaded]);

    return (
        <div className="map-wrapper">
            <style>{MAP_STYLES}</style>
            <div id="map-container" ref={mapContainer} />
            <TempMarker map={map} />
        </div>
    );
}

export default MapComponent;