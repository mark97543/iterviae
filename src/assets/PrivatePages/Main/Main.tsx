import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DASHBOARD_STYLES = `
    .dashboard-container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        background-color: var(--color-bg);
        color: var(--color-text);
    }

    .top-nav {
        height: 60px;
        background-color: var(--color-surface);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 var(--gap-medium);
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: var(--gap-medium);
    }

    .logout-link {
        font-family: var(--font-main);
        font-size: 10px;
        color: var(--color-text);
        cursor: pointer;
        opacity: 0.6;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: bold;
    }

    .logout-link:hover {
        color: #ef4444;
        opacity: 1;
    }

    .loading-screen {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #09090b;
        color: #f97316;
        font-family: monospace;
    }
`;

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('https://api.wade-usa.com/users/me', { credentials: 'include' })
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(result => {
                setUser(result.data);
                setLoading(false);
            })
            .catch(() => {
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = () => {
        // Directus GET logout endpoint clears cookies and redirects back
        const redirect = window.location.origin + '/login';
        window.location.href = `https://api.wade-usa.com/auth/logout?redirect=${redirect}`;
    };

    if (loading) {
        return (
            <div className="loading-screen">
                <style>{DASHBOARD_STYLES}</style>
                <h3>INITIALIZING INSTRUMENTUM...</h3>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <style>{DASHBOARD_STYLES}</style>
            
            <header className="top-nav">
                <div style={{ color: '#f97316', fontWeight: 'bold' }}>INSTRUMENTUM</div>
                <div className="nav-actions">
                    <span style={{ fontSize: '12px', opacity: 0.8 }}>{user.email}</span>
                    <div className="logout-link" onClick={handleLogout}>Logout</div>
                </div>
            </header>

            <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1>Welcome, {user.first_name || 'Rider'}</h1>
                    <p style={{ opacity: 0.5 }}>OAuth2 Session Verified</p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;