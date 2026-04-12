import React from 'react';

const LOGIN_STYLES = `
    .login-container {

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--color-bg);
        color: var(--color-text);
        text-align: center;
        padding: var(--gap-medium);
    }

    .login-card {
        background: var(--color-surface);
        padding: var(--gap-xlarge);
        border-radius: 8px;
        border: 1px solid var(--color-border);
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        max-width: 400px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--gap-small);
    }

    h1 {
        color: var(--color-primary);
        margin-bottom: var(--gap-xsmall);
        letter-spacing: -1px;
    }

    p {
        color: var(--color-text);
        margin-bottom: var(--gap-large);
        font-size: var(--font-size-small);
        opacity: 0.8;
    }

    .google-btn {
        background-color: var(--color-accent);
        color: #FFFFFF;
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0.8rem 1.5rem;
        border-radius: 4px;
        font-family: var(--font-main);
        font-weight: bold;
        font-size: var(--font-size-xsmall);
        text-transform: uppercase;
        letter-spacing: 1px;
        cursor: pointer;
        transition: var(--transition);
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
        // Append /dashboard to the redirect origin
        const authUrl = `https://api.wade-usa.com/auth/login/google?redirect=${window.location.origin}/dashboard`;
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