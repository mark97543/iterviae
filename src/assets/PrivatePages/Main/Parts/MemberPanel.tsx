
const MemberPanel_Style = `

    .member-panel-wrapper{
        position: absolute;
        top: 10px;
        right: 10px;
        width: 200px;
        height: 50px;
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: center;
        padding: var(--gap-small);
        box-sizing: border-box;
        z-index: 10;
        box-shadow: -4px 0 15px rgba(0,0,0,0.5);
    }
`;

const MemberPanel = () =>{
    return(
        <div className="member-panel-wrapper">
            <style>{MemberPanel_Style}</style>
            <p>Member Panel</p>
            {/* Add logout function here */}
        </div>
    )
}

export default MemberPanel;