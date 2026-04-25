const EDIT_TRIP_STYLE=`
    .edit-trip-modal-overlay-transparent {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 90;
        cursor: default;
    }
`


const EditTripModal = ({setModal}: {setModal: (show: boolean) => void})=>{

    return(
        <>
            <style>{EDIT_TRIP_STYLE}</style>
            {/* Invisible overlay to catch clicks outside the menu */}
            <div className="edit-trip-modal-overlay-transparent" onClick={() => setModal(false)}></div>



        </>
    )
}

export default EditTripModal;