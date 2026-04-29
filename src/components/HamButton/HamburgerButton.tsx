import {useState} from "react";

const HAMBUTTON_STYLE = `

    .ham_menu{
        margin-right: 5px;
        margin-left: 5px;
        position: relative;
        cursor: pointer;
        z-index: 100;
    }

    .bar1, .bar2, .bar3 {
        width: 30px;
        height: 4px;
        background-color: var(--color-accent, #f97316);
        margin: 5px 0;
        transition: 0.4s;
        border-radius: 2px;
    }

    .change .bar1 {
        transform: translate(0, 9px) rotate(-45deg);
    }

    .change .bar2 {opacity: 0;}

    .change .bar3 {
        transform: translate(0, -9px) rotate(45deg);
    }

    .ham_dropdown {
        display: none;
        border-radius: 8px;
        position: absolute;
        top: 45px;
        right: 0px;
        background-color: var(--color-surface, #1a1a1a);
        padding: 15px;
        width: 200px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        border: 1px solid var(--color-border, #333);
        z-index: 1000;
    }

    .ham_dropdown.change {
        display: flex;
        flex-direction: column;
        gap: 5px;
    }

    .ham_dropdown a {
        text-align: left !important;
        color: var(--color-text, #fff) !important;
        font-size: var(--font-size-small, 14px);
        padding: 10px 15px;
        text-decoration: none;
        border-radius: 4px;
        transition: background 0.2s;
    }

    .ham_dropdown a:hover{
        background-color: var(--color-accent, #f97316);
        color: white !important;
    }

    .menu_divider{
        height: 1px;
        background-color: var(--color-border, #333);
        margin: 10px 0;
        width: 100%;
    }
`

/**
 * HAMBURGER NAVIGATION COMPONENT
 * 
 * A premium, animated hamburger menu button that toggles a dropdown navigation list.
 * Designed for mobile and tablet views to maximize map real estate while maintaining 
 * easy access to application sections.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.lastItem - An optional React element to display at the very bottom of the menu (e.g., a Logout button).
 * @param {Array<{id: string, label: string, link: string}>} props.listItems - An array of navigation objects defining the menu links.
 * 
 * @example
 * <Hamburger_Button 
 *    listItems={[
 *      { id: '1', label: 'Dashboard', link: '/dashboard' },
 *      { id: '2', label: 'My Trips', link: '/trips' }
 *    ]} 
 *    lastItem={<button onClick={logout}>Sign Out</button>}
 * />
 * 
 * @returns {JSX.Element} The rendered hamburger button and dropdown menu.
 */
export const Hamburger_Button = ({lastItem, listItems}) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const hamFunction = () => {
        setIsOpen(!isOpen);
    }

    return(
        <div className="ham_menu">
            <style>{HAMBUTTON_STYLE}</style>
            <div className={`ham_container ${isOpen ? 'change' : ''}`} onClick={hamFunction}>
                <div className='bar1'></div>
                <div className='bar2'></div>
                <div className='bar3'></div>
            </div>
            
            <nav className={`ham_dropdown ${isOpen ? 'change' : ''}`} onClick={hamFunction}>

                {listItems.map((tag) => (
                    <a key={tag.id} className="active" href={tag.link}>{tag.label}</a>
                ))}

                <div className="menu_divider"></div>
                {lastItem}
            </nav>

        </div>
    )

}

export default Hamburger_Button;


