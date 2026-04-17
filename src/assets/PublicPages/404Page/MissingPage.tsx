import React from 'react';
import { useNavigate } from 'react-router-dom';

const MISSING_STYLE = `
    .missing-wrapper {
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

    .missing-card {
        background: var(--color-surface, #111);
        padding: var(--gap-xlarge, 2.5rem);
        border-radius: 8px;
        border: 1px solid var(--color-border, #333);
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        max-width: 500px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--gap-medium, 1rem);
    }

    .cat-image {
        width: 100%;
        max-width: 300px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5);
        border: 2px solid var(--color-border);
        margin-bottom: var(--gap-small);
    }

    h1 {
        color: var(--color-primary, #f97316);
        margin-bottom: var(--gap-xxsmall, 0.25rem);
        letter-spacing: -1px;
        font-size: 2.5rem;
    }

    p {
        color: var(--color-text, #ccc);
        font-size: var(--font-size-small, 1rem);
        opacity: 0.8;
        line-height: 1.5;
        margin: 0;
        margin-bottom: var(--gap-small, 0.5rem);
    }
`;

const MissingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="missing-wrapper">
            <style>{MISSING_STYLE}</style>
            <div className="missing-card">
                <h1>404</h1>
                <img className="cat-image" src="/cat-404.png" alt="Confused 404 Cat with broken map" />
                <p>
                    <strong>Uh oh! </strong> It looks like your map blew away. We couldn't find the page you're looking for!
                </p>

                <button className="std-button" onClick={() => navigate('/dashboard')}>
                    Return to Safety (Dashboard)
                </button>
            </div>
        </div>
    );
};

export default MissingPage;
