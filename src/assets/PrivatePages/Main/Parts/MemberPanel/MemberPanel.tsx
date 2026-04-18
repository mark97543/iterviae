import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';

const MemberPanel_Style = `

    .member-panel-wrapper{
        position: absolute;
        top: 10px;
        right: 10px;
        width: 200px;
        height: 65px;
        background-color: var(--color-bg);
        border: 1px solid var(--color-border);
        border-radius: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding-top: var(--gap-small);
        padding-bottom:var(--gap-small);
        padding-left: var(--gap-small);
        padding-right: var(--gap-xxsmall);
        box-sizing: border-box;
        z-index: 10;
        box-shadow: -4px 0 15px rgba(0,0,0,0.5);
    }

    .logout-btn{
        width: 40px;
        height: 40px;
        padding: var(--gap-xxsmall);
        border-radius: var(--gap-small);
        background-color: var(--color-accent);
        border: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .logout-btn img{
        width: 100%;
        height: 100%;
    }
`;

const MemberPanel = () =>{
    const {logout, user } = useAuth();
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    
    return(
        <div className="member-panel-wrapper">
            <style>{MemberPanel_Style}</style>
            <p>Welcome, {user.first_name}</p>
            {/* Add logout function here */}
            <button className='logout-btn std-button' onClick={handleLogout}><img src="/logout.png" alt="logout" /></button>
        </div>
    )
}

export default MemberPanel;