import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


const BOTTOM_PANEL_STYLE=`
    .bottom-panel-wrapper{
        position: fixed;
        bottom: 10px;
        left: calc(50% + 150px);
        transform: translateX(-50%);
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: var(--gap-small);
        box-sizing: border-box;
        z-index: 10;
        box-shadow: -4px 0 15px rgba(0,0,0,0.5);
    }

    .new-trip-btn{
        height: 50px;
        width: 50px;
        border-radius: 10px;
        background-color: var(--color-accent);
        border: none;
    }
`;

const BottomPanel = () => {
    return(
        <div className="bottom-panel-wrapper">
            <style>{BOTTOM_PANEL_STYLE}</style>
            <Tippy content="New Trip">
                <button className="std-button new-trip-btn">
                    <img src="./new.png"/>
                </button>
            </Tippy>
        </div>
    )
}

export default BottomPanel;