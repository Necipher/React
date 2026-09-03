import { useState, useEffect } from "react"
import { setAccessToken } from "../api/fetchWithAuth"

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [authView, setAuthView] = useState(null)
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        async function refreshSession() {
            try {
                const res = await fetch('http://localhost:5004/auth/refresh', {
                    method: 'POST',
                    credentials: 'include',
                });
                if (res.ok) {
                    const data = await res.json();
                    setAccessToken(data.accessToken);
                    setUser(data.user);
                }
            } catch (err) {
                console.error('Silent refresh failed', err);
            } finally {
                setInitializing(false);
            }
        }
        refreshSession();
    }, [])

    async function registerNewUser(username, first_name, last_name, email, password) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:5004/auth/register', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ username, first_name, last_name, email, password })
            });
            const data = await res.json()
            if (!res.ok) {
                setError(data.message || 'Registration Failed');
                return false
            }
            setAccessToken(data.accessToken);
            setUser(data.user);
            return true
        } catch {
            setError('Network error');
            return false
        } finally {
            setLoading(false)
        }
    }

    async function login(email, password) {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('http://localhost:5004/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Login failed');
                return false
            }
            setAccessToken(data.accessToken);
            setUser(data.user);
            return true
        } catch (err) {
            console.error(err)
            setError('Network error')
            return false
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        try {

            await fetch('http://localhost:5004/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (err) {
            console.error('logout fetch threw:', err);
        } finally {
            setAccessToken(null);
            setUser(null)
        }
    }

    return { user, error, loading, initializing, registerNewUser, login, logout, getProfile, authView, setAuthView }
}

export default useAuth
