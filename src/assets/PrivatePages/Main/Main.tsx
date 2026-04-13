import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Main.css';
import { useState } from 'react';
import MapComponent from './Parts/Map';



const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [waypoints, setWaypoints] = useState([]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null; // Component should not render if not authenticated; ProtectedRoute will catch it

    return (
        <div className="dashboard-container">
            {/* <div style={{ padding: '20px' }}>
                <h1>Welcome, {user.first_name}</h1>
                <p>Email: {user.email}</p>
                <button className="btn" onClick={handleLogout}>Logout</button>
            </div> */}
            <MapComponent waypoints={waypoints} />
        </div>
    );
};

export default Dashboard;