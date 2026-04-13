import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const LOGIN_STYLES = `
    .login-container {

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
        margin: 0;
        margin-bottom: var(--gap-small, 0.5rem);
    }

    .input-grp {
        display: flex;
        flex-direction: column;
        text-align: left;
        gap: 5px;
    }

    .input-grp label {
        font-size: var(--font-size-xsmall, 0.75rem);
        color: var(--color-text, #aaa);
    }

    .std-input {
        background: rgba(0,0,0,0.2);
        border: 1px solid var(--color-border, #444);
        color: white;
        padding: 10px;
        border-radius: 4px;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
    }

    .std-input:focus {
        border-color: var(--color-accent, #f97316);
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
        margin-top: var(--gap-small);
        width: 100%;
    }

    .google-btn:hover:not(:disabled) {
        background-color: #f00000;
        box-shadow: 0 0 20px rgba(208, 0, 0, 0.4);
        transform: translateY(-1px);
    }

    .google-btn:active:not(:disabled) {
        transform: translateY(1px);
    }

    .google-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .error-text {
        color: #ef4444;
        font-size: 0.8rem;
        margin: 0;
    }
`;

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <style>{LOGIN_STYLES}</style>
            <form className="login-card" onSubmit={handleLogin}>
                <h1>Iter Viae</h1>
                <p>The Way Of The Road</p>
                
                {error && <p className="error-text">{error}</p>}

                <div className="input-grp">
                    <label>Email</label>
                    <input 
                        type="email" 
                        required 
                        className="std-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="input-grp">
                    <label>Password</label>
                    <input 
                        type="password" 
                        required 
                        className="std-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="google-btn" disabled={loading}>
                    {loading ? 'Authenticating...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default Login;