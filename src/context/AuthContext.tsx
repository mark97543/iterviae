import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    first_name: string;
    email: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (first_name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const checkTokenAndFetchUser = async (token: string): Promise<boolean> => {
        try {
            const res = await fetch('https://api.wade-usa.com/users/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) return false;
            const result = await res.json();
            setUser(result.data);
            return true;
        } catch (e) {
            return false;
        }
    };

    const attemptRefresh = async (): Promise<boolean> => {
        const refreshToken = sessionStorage.getItem('instrumentum_refresh');
        if (!refreshToken) return false;

        try {
            const res = await fetch('https://api.wade-usa.com/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh_token: refreshToken, mode: 'json' })
            });
            if (!res.ok) return false;
            const data = await res.json();
            const newAccessToken = data?.data?.access_token;
            const newRefreshToken = data?.data?.refresh_token;

            if (newAccessToken) {
                sessionStorage.setItem('instrumentum_token', newAccessToken);
                if (newRefreshToken) sessionStorage.setItem('instrumentum_refresh', newRefreshToken);
                return await checkTokenAndFetchUser(newAccessToken);
            }
            return false;
        } catch (err) {
            return false;
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            const token = sessionStorage.getItem('instrumentum_token');
            if (token) {
                const isValid = await checkTokenAndFetchUser(token);
                if (!isValid) {
                    const refreshed = await attemptRefresh();
                    if (!refreshed) logout();
                }
            } else {
                // No token, maybe we have a refresh token
                const refreshed = await attemptRefresh();
                if (!refreshed) {
                    setLoading(false); // Nothing useful found
                    return;
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        setError(null);
        setLoading(true);
        try {
            const res = await fetch('https://api.wade-usa.com/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.errors?.[0]?.message || 'Invalid credentials');
            }

            const data = await res.json();
            const tokens = data.data;

            if (tokens?.access_token) {
                sessionStorage.setItem('instrumentum_token', tokens.access_token);
                if (tokens.refresh_token) sessionStorage.setItem('instrumentum_refresh', tokens.refresh_token);
                
                // Fetch the user data with the fresh token
                const success = await checkTokenAndFetchUser(tokens.access_token);
                if (!success) throw new Error("Failed to load user profile");
            } else {
                throw new Error('No access token returned');
            }
        } catch (err: any) {
            setError(err.message || "An error occurred during login");
            setLoading(false);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (first_name: string, email: string, password: string): Promise<void> => {
        setError(null);
        setLoading(true);
        try {
            // Directus standard user creation endpoint (requires Public 'create' permission on directus_users)
            const res = await fetch('https://api.wade-usa.com/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    first_name, 
                    email, 
                    password,
                    role: '3ae1aaa8-966b-4022-a39f-e5abe29b57b3',
                    status: 'unverified'
                })
            });
            
            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData?.errors?.[0]?.message || 'Failed to register. Ensure public registration is enabled.');
            }

            // We do not auto-login because the user is unverified. 
            // The frontend will handle redirecting to the /pending page.
        } catch (err: any) {
            setError(err.message || "An error occurred during registration");
            setLoading(false);
            throw err;
        }
    };

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
        setLoading(false);
        setError(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
