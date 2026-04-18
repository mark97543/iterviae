import React from 'react'

const NEW_TRIP_MODAL_STYLE = `
    .new-trip-modal-overlay-transparent {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 90;
        cursor: default;
    }

    .new-trip-modal-wrapper {
        position: absolute;
        bottom: calc(100% + 15px); /* Position above the bottom panel */
        left: 50%;
        width: 300px;
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        padding: var(--gap-medium);
        box-sizing: border-box;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        display: flex;
        flex-direction: column;
        z-index: 100;
        
        /* Animation properties */
        transform-origin: bottom center;
        animation: menuExpand 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.2) forwards;
    }

    @keyframes menuExpand {
        0% {
            opacity: 0;
            transform: translateX(-50%) scale(0.8) translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateX(-50%) scale(1) translateY(0);
        }
    }

    .close-modal-btn {
        position: absolute;
        top: var(--gap-small);
        right: var(--gap-small);
        background: transparent;
        border: none;
        color: var(--color-text);
        font-size: 1.5rem;
        cursor: pointer;
    }
`;

const NewTripModal = ({setModal}: {setModal: (show: boolean) => void}) => {
  return (
    <>
        <style>{NEW_TRIP_MODAL_STYLE}</style>
        {/* Invisible overlay to catch clicks outside the menu */}
        <div className="new-trip-modal-overlay-transparent" onClick={() => setModal(false)}></div>
        
        <div className="new-trip-modal-wrapper" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setModal(false)}>&times;</button>
            <p>New Trip</p>
        </div>
    </>
  )
}

export default NewTripModal;
