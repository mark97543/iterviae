
const LeftPanel_Style = `

    .left-panel-wrapper{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: var(--gap-small);
        width: 300px;
        height: 99%;
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        padding: var(--gap-medium);
        box-sizing: border-box;
        z-index: 10;
        box-shadow: 4px 0 15px rgba(0,0,0,0.5);
    }

`;

const LeftPanel = () =>{

    return(
        <div className="left-panel-wrapper">
            <style>{LeftPanel_Style}</style>          
            <h1>LP Panel </h1>
        </div>
    )
}

export default LeftPanel;
