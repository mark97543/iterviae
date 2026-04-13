import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DASHBOARD_STYLES = `
    .dashboard-container {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: column;
        background-color: #000;
        color: #fff;
    }
    .debug-panel {
        background: #111;
        border: 1px solid #333;
        padding: 15px;
        margin: 20px;
        font-family: monospace;
        font-size: 11px;
        color: #666;
        border-radius: 4px;
        max-width: 90vw;
        overflow-x: auto;
    }
    .error-screen {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        padding: 20px;
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
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // DEBUG LOGS
        const fullUrl = window.location.href;
        const searchParams = window.location.search;
        console.log("Full Redirect URL:", fullUrl);

        const params = new URLSearchParams(searchParams);
        const urlToken = params.get('access_token');
        const urlReason = params.get('reason');

        if (urlReason) {
            setError(`Directus Error: ${urlReason}`);
            setLoading(false);
            return;
        }

        // Clean URL to remove any residual parameters
        if (searchParams) {
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        const fetchUserAndSetState = (token) => {
            fetch('https://api.wade-usa.com/users/me', { 
                headers: { 'Authorization': `Bearer ${token}` } 
            })
            .then(res => res.ok ? res.json() : Promise.reject("Token invalid or expired"))
            .then(result => {
                setUser(result.data);
                localStorage.setItem('instrumentum_token', token);
                setLoading(false);
            })
            .catch(err => {
                setError(`API Verify Failed: ${err}`);
                localStorage.removeItem('instrumentum_token');
                setLoading(false);
            });
        };

        // Try to get a new access token using the HttpOnly directus_refresh_token cookie.
        // We set mode: 'cookie' so Directus reads from the cookie rather than JSON body.
        fetch('https://api.wade-usa.com/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'cookie' }),
            credentials: 'include' // Important for cross-origin cookies
        })
        .then(res => res.ok ? res.json() : Promise.reject("No valid session cookie"))
        .then(data => {
            if (data?.data?.access_token) {
                fetchUserAndSetState(data.data.access_token);
            } else {
                throw new Error("Missing access_token in response");
            }
        })
        .catch(refreshErr => {
            console.log("Refresh via cookie failed:", refreshErr);
            // Fallback: try existing token from storage if we had one
            const existingToken = localStorage.getItem('instrumentum_token');
            if (existingToken) {
                fetchUserAndSetState(existingToken);
            } else {
                setError("No login session found. Please login.");
                setLoading(false);
            }
        });
    }, []);

    if (loading) return <div className="error-screen"><h3>LOADING...</h3></div>;

    if (error) {
        return (
            <div className="error-screen">
                <style>{DASHBOARD_STYLES}</style>
                <h2 style={{ color: '#ef4444' }}>Auth Error</h2>
                <p>{error}</p>
                
                <div className="debug-panel">
                    <strong>DEBUG INFO:</strong><br/>
                    URL: {window.location.origin + window.location.pathname}<br/>
                    SEARCH: {window.location.search || "(empty)"}<br/>
                    LOCAL_TOKEN: {localStorage.getItem('instrumentum_token') ? "Present" : "Missing"}
                </div>

                <button className="btn" onClick={() => navigate('/login')}>Try Login Again</button>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <style>{DASHBOARD_STYLES}</style>
            <div style={{ padding: '20px' }}>
                <h1>Welcome, {user.first_name}</h1>
                <p>Email: {user.email}</p>
                <button className="btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
            </div>
        </div>
    );
};

export default Dashboard;