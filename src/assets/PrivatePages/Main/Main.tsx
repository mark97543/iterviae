// import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import './Main.css';
// import { useEffect, useState } from 'react';
import MapComponent from './Parts/Map/Map';
import LeftPanel from './Parts/Left Panel/LeftPanel';
import MemberPanel from './Parts/MemberPanel/MemberPanel';
import BottomPanel from './Parts/BottomPanel/BottomPanel';




const Dashboard = () => {
    const { user } = useAuth();


    if (!user) return null; // Component should not render if not authenticated; ProtectedRoute will catch it

    return (
        <div className="dashboard-container">
            <MapComponent />
            <LeftPanel />
            <MemberPanel />
            <BottomPanel />
        </div>
    );
};

export default Dashboard;