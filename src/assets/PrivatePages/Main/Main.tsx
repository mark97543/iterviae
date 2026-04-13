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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: #09090b;
        color: #f97316;
        font-family: monospace;
        gap: 20px;
    }

    .error-box {
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #ef4444;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
    }

    .return-btn {
        background: white;
        color: black;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        font-weight: bold;
        cursor: pointer;
        text-transform: uppercase;
    }
`;

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Check for tokens or errors in URL
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('access_token');
        const urlRefresh = params.get('refresh_token');
        const urlReason = params.get('reason');

        // Catch Directus OAuth errors gracefully
        if (urlReason) {
            setError(`Authentication Failed: ${urlReason}`);
            setLoading(false);
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        if (urlToken) {
            localStorage.setItem('instrumentum_token', urlToken);
            if (urlRefresh) localStorage.setItem('instrumentum_refresh', urlRefresh);
            // Clean the URL so tokens aren't visible
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // 2. Retrieve token for session verification
        const token = localStorage.getItem('instrumentum_token');

        if (!token) {
            navigate('/login');
            return;
        }

        // 3. Verify session using Authorization header instead of cookies
        fetch('https://api.wade-usa.com/users/me', { 
            headers: { 'Authorization': `Bearer ${token}` } 
        })
            .then(res => {
                if (!res.ok) throw new Error('Unauthorized');
                return res.json();
            })
            .then(result => {
                setUser(result.data);
                setLoading(false);
            })
            .catch(() => {
                localStorage.removeItem('instrumentum_token');
                localStorage.removeItem('instrumentum_refresh');
                navigate('/login');
            });
    }, [navigate]);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('instrumentum_refresh');
            
            // Clean server-side logout using the explicit refresh token
            if (refreshToken) {
                await fetch('https://api.wade-usa.com/auth/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refresh_token: refreshToken })
                });
            }
        } catch (err) {
            console.error("Logout network request failed:", err);
        } finally {
            // Guarantee local cleanup and redirect
            localStorage.removeItem('instrumentum_token');
            localStorage.removeItem('instrumentum_refresh');
            navigate('/login');
        }
    };

    if (error) {
        return (
            <div className="loading-screen">
                <style>{DASHBOARD_STYLES}</style>
                <div className="error-box">
                    <h3>{error}</h3>
                    <p style={{ fontSize: '12px', marginTop: '10px', opacity: 0.8 }}>
                        Check your Directus .env settings for AUTH_PROVIDERS.
                    </p>
                </div>
                <button className="return-btn" onClick={() => navigate('/login')}>
                    Return to Login
                </button>
            </div>
        );
    }

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
                    <p style={{ opacity: 0.5 }}>JWT Session Verified</p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;