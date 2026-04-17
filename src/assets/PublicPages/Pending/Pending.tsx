import React from 'react';
import { useNavigate } from 'react-router-dom';

const PENDING_STYLE = `
    .pending-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--color-bg, #000);
        color: var(--color-text, #fff);
        text-align: center;
        padding: var(--gap-medium, 1rem);
        height: 100vh;
    }

    .pending-card {
        background: var(--color-surface, #111);
        padding: var(--gap-xlarge, 2.5rem);
        border-radius: 8px;
        border: 1px solid var(--color-border, #333);
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        max-width: 450px;
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: var(--gap-medium, 1rem);
    }

    h1 {
        color: var(--color-primary, #f97316);
        margin-bottom: var(--gap-xxsmall, 0.25rem);
        letter-spacing: -1px;
    }

    p {
        color: var(--color-text, #ccc);
        font-size: var(--font-size-small, 0.875rem);
        opacity: 0.8;
        line-height: 1.5;
        margin: 0;
        margin-bottom: var(--gap-small, 0.5rem);
    }

    .std-button {
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
        margin-top: var(--gap-small);
        width: 100%;
    }

    .std-button:hover {
        background-color: #f00000;
        box-shadow: 0 0 20px rgba(208, 0, 0, 0.4);
        transform: translateY(-1px);
    }

    .std-button:active {
        transform: translateY(1px);
    }
`;

const Pending = () => {
    const navigate = useNavigate();

    return (
        <div className="pending-wrapper">
            <style>{PENDING_STYLE}</style>
            <div className="pending-card">
                <h1>Verification Pending</h1>
                <p>Welcome to Iter Viae!</p>
                <p>
                    Your account has been successfully created. However, your account status is currently set to <strong>unverified</strong>.
                </p>
                <p>
                    Please wait for an administrator to approve your account before you can log in, or check your email for further instructions.
                </p>

                <button className="std-button" onClick={() => navigate('/login')}>
                    Return to Login
                </button>
            </div>
        </div>
    );
};

export default Pending;
