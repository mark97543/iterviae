import { useEffect, useRef } from 'react';
import { useStops } from '../../../../context/DataContext';

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
`;

/**
 * THE CARTESIAN PLANE: MAP COMPONENT
 * This internal component handles the MapLibre engine.
 * It translates the "Classical" data from the database into the "Romantic" visual map.
 */
const MapComponent = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<any>(null);
    const markers = useRef<any[]>([]);
    const {stops}=useStops();

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
        }
        document.head.appendChild(script);

        return ()=>{
            if (map.current) map.current.remove();
        }

    },[])

    // SIDE EFFECT: Sync Markers with Directus Data
    // Whenever 'waypoints' change, we clear the old world and render the new one
    useEffect(()=>{
        if(!map.current || !(window as any).maplibregl) return;

        // Classical Maintenance: Clear existing markers to prevent memory leaks
        markers.current.forEach((marker: any) => marker.remove());
        markers.current = [];

        // Romantic Expression: Plot the path
        stops.forEach((point: any) => {
            if (point.longitude && point.latitude) {
                const m = new (window as any).maplibregl.Marker({ color: '#f91616ff' })
                    .setLngLat([point.longitude, point.latitude])
                    .setPopup(new (window as any).maplibregl.Popup().setHTML(`
                        <div style="color: #000; padding: 5px;">
                            <h4 style="margin: 0;">${point.name || 'Waypoint'}</h4>
                            <p style="margin: 5px 0 0 0; font-size: 12px;">${point.description || ''}</p>
                        </div>
                    `))
                    .addTo(map.current);
                markers.current.push(m);
            }
        });
    }, [stops]);



    return (
        <div className="map-wrapper">
            <style>{MAP_STYLES}</style>
            <div id="map-container" ref={mapContainer} />
        </div>
    );
}

export default MapComponent;