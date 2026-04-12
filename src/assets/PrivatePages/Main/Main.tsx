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

    .logo {
        font-family: var(--font-main);
        font-size: var(--font-size-large);
        color: var(--color-primary);
        font-weight: bold;
        letter-spacing: 1px;
    }

    .nav-actions {
        display: flex;
        align-items: center;
        gap: var(--gap-medium);
    }

    .logout-link {
        font-family: var(--font-main);
        font-size: var(--font-size-xxsmall);
        color: var(--color-text);
        cursor: pointer;
        opacity: 0.6;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .logout-link:hover {
        color: var(--color-accent);
        opacity: 1;
    }

    .main-content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .map-placeholder {
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, #1a1a1a 0%, #121212 100%);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .status-badge {
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        padding: var(--gap-xsmall) var(--gap-medium);
        border-radius: 20px;
        font-size: var(--font-size-xxsmall);
        color: var(--color-accent);
        text-transform: uppercase;
        font-weight: bold;
        margin-top: var(--gap-medium);
    }

    .sidebar {
        position: absolute;
        top: var(--gap-medium);
        left: var(--gap-medium);
        width: 300px;
        background-color: var(--color-surface);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        padding: var(--gap-medium);
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        z-index: 10;
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: var(--gap-small);
        margin-bottom: var(--gap-medium);
        padding-bottom: var(--gap-small);
        border-bottom: 1px solid var(--color-border);
    }

    .avatar {
        width: 32px;
        height: 32px;
        background-color: var(--color-accent);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        color: white;
    }

    .loading-screen {
        height: 100vh;
        width: 100vw;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--color-bg);
        color: var(--color-primary);
        font-family: var(--font-main);
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

    const handleLogout = async () => {
        try {
            await fetch('https://api.wade-usa.com/auth/logout', { 
                method: 'POST',
                credentials: 'include' 
            });
            navigate('/login');
        } catch (err) {
            console.error("Logout failed", err);
            navigate('/login'); // Force redirect anyway
        }
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
                <div className="nav-actions">
                    <span>{user.email}</span>
                    <div className="logout-link" onClick={handleLogout}>Logout</div>
                </div>
            </header>

        </div>
    );
};

export default Dashboard;