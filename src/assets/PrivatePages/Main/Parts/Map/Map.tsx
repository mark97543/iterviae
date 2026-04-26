import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useStops } from '../../../../../context/DataContext';
import TempMarker from './Temp Marker/TempMarker';
import polyline from '@mapbox/polyline';
import MarkerPopup from './MarkerPopup/MarkerPopup';
import { getTripDirections } from '../../valhala';
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
`;

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
    const {stops, route, setStops, editMode, setRoute} = useStops();


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
        if (!stops || stops.length < 2) return;
        
        const timer = setTimeout(async () => {
            try {
                const newRoute = await getTripDirections(stops);
                if (newRoute) setRoute(newRoute);
            } catch (err) {
                console.error("Failed to fetch route:", err);
            }
        }, 1000); // 1 second debounce
        
        return () => clearTimeout(timer);
    }, [stops, setRoute]);

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

        // 2. Create new markers or update existing ones
        stops.forEach((point: any) => {
            if (point.longitude && point.latitude) {
                if (!markerRoots.current.has(point.id)) {
                    const popupNode = document.createElement('div');
                    const root = createRoot(popupNode);
                    
                    const m = new (window as any).maplibregl.Marker({ color: '#000000ff', draggable: editMode })
                        .setLngLat([point.longitude, point.latitude])
                        .setPopup(new (window as any).maplibregl.Popup({ offset: 25 }).setDOMContent(popupNode))
                        .addTo(map.current);
                        
                    m.on('dragend', () => {
                        const lngLat = m.getLngLat();
                        // Use functional state update to prevent stale closures from when marker was created
                        setStops((prevStops: any[]) => prevStops.map((s: any) => 
                            s.id === point.id ? { ...s, latitude: lngLat.lat, longitude: lngLat.lng } : s
                        ));
                    });
                        
                    markerRoots.current.set(point.id, { root, marker: m, popupNode });
                }

                // Update the position and re-render the React Component with fresh props
                const data = markerRoots.current.get(point.id);
                data.marker.setLngLat([point.longitude, point.latitude]);
                data.marker.setDraggable(editMode); // Dynamically toggle draggable state
                data.root.render(<MarkerPopup point={point} stops={stops} setStops={setStops} editMode={editMode} />);
            }
        });
    }, [stops, editMode]);

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