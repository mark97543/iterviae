import React from 'react';

const LOGIN_STYLES = `
    .login-container {
        height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--color-bg, #000);
        color: var(--color-text, #fff);
        text-align: center;
        padding: var(--gap-medium, 1rem);
    }

    .login-card {
        background: var(--color-surface, #111);
        padding: var(--gap-xlarge, 2.5rem);
        border-radius: 8px;
        border: 1px solid var(--color-border, #333);
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        max-width: 400px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--gap-small, 0.5rem);
    }

    h1 {
        color: var(--color-primary, #f97316);
        margin-bottom: var(--gap-xsmall, 0.25rem);
        letter-spacing: -1px;
    }

    p {
        color: var(--color-text, #ccc);
        margin-bottom: var(--gap-large, 1.5rem);
        font-size: var(--font-size-small, 0.875rem);
        opacity: 0.8;
    }

    .google-btn {
        background-color: var(--color-accent, #ea4335);
        color: #FFFFFF;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        font-family: var(--font-main, sans-serif);
        font-weight: bold;
        font-size: var(--font-size-xsmall, 0.75rem);
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: 0.2s ease-in-out;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        width: 100%;
    }

    .google-btn:hover {
        background-color: #f00000;
        box-shadow: 0 0 20px rgba(208, 0, 0, 0.4);
        transform: translateY(-1px);
    }

    .google-btn:active {
        transform: translateY(1px);
    }
`;

const Login = () => {
    const handleLogin = () => {
        // Fixed syntax: using standard string concatenation
        const authUrl = "https://api.wade-usa.com/auth/login/google?mode=json&redirect=" + window.location.origin + "/dashboard";
        window.location.href = authUrl;
    };

    return (
        <div className="login-container">
            <style>{LOGIN_STYLES}</style>
            <div className="login-card">
                <h1>Iter Viae</h1>
                <p>The Way Of The Road</p>
                <button className="google-btn" onClick={handleLogin}>
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Login;