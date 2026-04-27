# 🛰️ MISSION CONTROL - IterViae

## 🤝 The Partnership Protocol
- **Role**: Pair-Programming Team (User = Architect/Driver, Antigravity = Navigator/Engine).
- **Workflow**: 
    1. Discuss logic via **Pseudo-code** and syntax explanations first.
    2. Collaborative scripting with **Heavy Documentation** (Explain the "Why").
    3. **Bug Hunting**: Antigravity adds comments to explained issues before fixing.
- **Goal**: Build a premium motorcycle trip planner while learning the "scripting" behind it.

---

## 🛠️ Current Project State
- **Dashboard (`Info.tsx`)**: Upgraded to a sleek **2x2 Grid**.
    - Stats: Distance, Total Budget (Green), Ride Time, and Trip Dates.
    - Logic: "End Date" is automatically calculated based on the number of **Hotel Stops**.
- **Stabilization**: 
    - Fixed **500 Error** when deleting trip dates (now sends a clean `null` to Directus).
    - Squashed syntax "ghost brackets" in the Ride Time display.
- **Marker Popups (`MarkerPopup.tsx`)**:
    - Refactored for **Live Sync**: Changes show up in the Itinerary instantly.
    - Manual Save: Database updates only happen when the main **"Save Trip"** button is hit.
    - Added **Coordinate Entry**: Users can paste `Lat, Lng` to jump the marker.

---

## 🎯 Next Objectives (Priority Order)
1. **[ ] Copy Coordinates**: Add a one-click "Copy to Clipboard" feature for Lat/Long in the `MarkerPopup` and the `Stops` list.
2. **[ ] Mobile/Tablet View**: Begin responsive design refactor for the sidebar and map.
3. **[ ] Search Enhancements**: Allow addresses and location names in the search bar.
4. **[ ] POI Integration**: Add "Points of Interest" layer to the map.

---

## 🗺️ Tech Stack Cheat Sheet
- **Frontend**: React (Vite) + MapLibre GL JS.
- **Styling**: Vanilla CSS (Premium Dark Mode Aesthetic).
- **Backend**: Directus (api.wade-usa.com).
- **Contexts**:
    - `DataContext.tsx`: Global `stops` and `route` state.
    - `DirectusContext.tsx`: Database sync logic (`saveTripByID`, `loadTrips`).
    - `AuthContext.tsx`: User session management.

---

*Last Updated: 2026-04-27 11:07 AM*
