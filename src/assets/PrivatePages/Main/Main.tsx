import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const DASHBOARD_STYLES = `
    .dashboard-container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        background-color: #000;
        color: #fff;
    }
    .btn {
        background: #f97316;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        margin-top: 20px;
    }
`;

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null; // Component should not render if not authenticated; ProtectedRoute will catch it

    return (
        <div className="dashboard-container">
            <style>{DASHBOARD_STYLES}</style>
            <div style={{ padding: '20px' }}>
                <h1>Welcome, {user.first_name}</h1>
                <p>Email: {user.email}</p>
                <button className="btn" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Dashboard;