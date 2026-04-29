import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../../context/AuthContext';
import Hamburger_Button from '../../../../../../components/HamButton/HamburgerButton';

const MobileTopPanel_Style = `

    .mobile-top-panel{
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: var(--gap-small);
        padding-bottom: var(--gap-small);
        padding-left: var(--gap-small);
        padding-right: var(--gap-small);
        box-sizing: border-box;     
    }

    .welcome-message{
        font-size: var(--font-size-large);
        padding-left: var(--gap-small);
        padding-right: var(--gap-small);
    }

`;

const listItems = [
    { id: '1', label: 'Load Trip', link: '/mobile_loadtrip' }
];


const MobileTopPanel = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();


    return (
        <div className="mobile-top-panel">
            <style>{MobileTopPanel_Style}</style>
            <span className="welcome-message">Welcome Back, {user?.first_name}</span> 
            <Hamburger_Button  
                listItems={listItems} 
                lastItem={<button className='std-button' onClick={logout}>Sign Out</button>}
            />
        </div>
    );
};


export default MobileTopPanel;
