import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Main.css';
import { useEffect, useState } from 'react';
import MapComponent from './Parts/Map';
import LeftPanel from './Parts/LeftPanel';
import MemberPanel from './Parts/MemberPanel';




const Dashboard = () => {
    const { user } = useAuth();


    if (!user) return null; // Component should not render if not authenticated; ProtectedRoute will catch it

    return (
        <div className="dashboard-container">
            {/* <div style={{ padding: '20px' }}>
                <h1>Welcome, {user.first_name}</h1>
                <p>Email: {user.email}</p>
                <button className="btn" onClick={handleLogout}>Logout</button>
            </div> */}
            <MapComponent />
            <LeftPanel />
            <MemberPanel />
        </div>
    );
};

export default Dashboard;