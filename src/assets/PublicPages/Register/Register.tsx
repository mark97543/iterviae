import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../../../context/AuthContext';


const REGISTER_STYLE =`

    .register-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: var(--color-bg, #000);
        color: var(--color-text, #fff);
        text-align: center;
        padding: var(--gap-medium, 1rem);
    }

    .register-card {
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

    .error-text {
        color: #ef4444;
        font-size: 0.8rem;
        margin: 0;
    }

    .register-link {
        color: var(--color-accent, #f97316);
        text-decoration: none;
    }
`;

const Register = () =>{

    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const {register} = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(firstName, email, password);
            navigate('/pending');
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-wrapper">
            <style>{REGISTER_STYLE}</style>
            <form className="register-card" onSubmit={handleRegister}>
                <h1>Iter Viae</h1>
                <p>The Way Of The Road</p>
                
                {error && <p className="error-text">{error}</p>}

                <div className="input-grp">
                    <label>First Name</label>
                    <input 
                        type="text" 
                        required 
                        className="std-input"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>

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

                <button type="submit" className="std-button" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Register'}
                </button>

                <span>Already have an account? <a className='register-link' href="/login">Login</a></span>
            </form>
        </div>
    )
}

export default Register;
