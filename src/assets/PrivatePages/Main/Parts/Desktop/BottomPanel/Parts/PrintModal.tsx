import {useDirectus} from '../../../../../../../context/DirectusContext';

const PRINT_TRIP_MODAL_STYLE = `
    .print-trip-modal-overlay-transparent {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 90;
        cursor: default;
    }

    .print-trip-modal-wrapper {
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
        top: var(--gap-xxsmall);
        right: var(--gap-xxsmall);
        background: transparent;
        border: none;
        color: var(--color-text);
        font-size: 1.5rem;
        cursor: pointer;
        
    }

    .print-btn-wrapper{
        margin-top: var(--gap-small);
        align-self: center;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--gap-small);
    }
`;

const PrintModal = ({setModal}: {setModal: (show: boolean) => void}) => {
    const {currentTrip} = useDirectus();

    const printA4 = () => {
        setModal(false);
        window.open(`/a4print?tripId=${currentTrip?.id}`, '_blank');
    }

    const printMemo = () => {
        setModal(false);
        window.open(`/memoprint?tripId=${currentTrip?.id}`, '_blank');
    }

    return (
        <>
            <style>{PRINT_TRIP_MODAL_STYLE}</style>
            {/* Invisible overlay to catch clicks outside the menu */}
            <div className="print-trip-modal-overlay-transparent" onClick={() => setModal(false)}></div>
            
            <div className="print-trip-modal-wrapper" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={() => setModal(false)}>&times;</button>
                <div className="print-btn-wrapper">
                    <button className="std-button" onClick={() => printMemo()} >
                        Feild Notes (3.5 x 5.5) 
                    </button>
                    <button className="std-button" onClick={() => printA4()}>
                        Print A4 (5.5 x 8.5)
                    </button>
                </div>
            </div>
        </>
    )
}

export default PrintModal;
