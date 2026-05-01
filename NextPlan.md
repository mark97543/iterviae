# Next Item: Version 1.3 - Search UI Refinement

The goal of this version is to polish the map search experience by improving legibility and adding an "auto-hide" feature when the user finished their search.

---

## 1. Feature: Dark Overlay for Search Results

Currently, the search results might be hard to read if they appear over a light part of the map or other UI elements. We will add a "Glassmorphism" dark background.

### The Strategy:
- Wrap the search results in a container with a semi-transparent dark background.
- Apply `backdrop-filter: blur(8px)` to make it look premium.

---

## 2. Feature: Auto-Hide Results

The search results should disappear when:
1.  The user clicks a result.
2.  The user clicks anywhere else on the map or sidebar.
3.  The user clears the search input.

### The Strategy: "Click Outside" Hook
We will implement a simple "detect click outside" logic using a `ref` on the search container.

---

## 3. Files to Edit

1.  **`src/assets/PrivatePages/Main/Parts/Desktop/Left Panel/Parts/LeftPanelSearch.tsx`**: This is where the search input and the results list live.

---

## 4. Step-by-Step Implementation

### Step 1: Add the "Click Outside" logic
Inside `LeftPanelSearch.tsx`, add a `useEffect` that listens for clicks on the `document`.

```tsx
const searchRef = useRef<HTMLDivElement>(null);

useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setResults([]); // Clear results if clicking outside
        }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
```

### Step 2: Apply the Premium Styling
In your CSS section, update the results container to use a dark, blurred background.

```css
.search-results-container {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(18, 18, 18, 0.9); /* Dark background */
    backdrop-filter: blur(12px);       /* Glass effect */
    border: 1px solid var(--color-border);
    border-radius: 8px;
    z-index: 1000;                     /* Stay on top */
    max-height: 300px;
    overflow-y: auto;
}
```

---

## 🛠 Troubleshooting

### Troubleshooting 1: "The results are hidden behind the map"
**Check**: Make sure the `z-index` of the results container is higher than the map container. Usually `z-index: 1000` is enough, but you might need to check the parent container's `overflow` property.

### Troubleshooting 2: "Clicking the 'Clear' button hides the results too fast"
**Check**: If you have a "X" button to clear search, make sure it is *inside* the `searchRef` container, otherwise the "Click Outside" logic will trigger when you click the "X".

### Troubleshooting 3: "Blur effect isn't working"
**Check**: `backdrop-filter` requires a semi-transparent background to be visible. Ensure your background color uses `rgba(...)` with an alpha value like `0.8` or `0.9`.
