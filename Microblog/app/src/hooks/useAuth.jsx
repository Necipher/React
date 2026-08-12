import { useState } from "react"
import { setAccessToken, fetchWithAuth } from "../api/fetchWithAuth"

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
            if (!res.ok) return setError(data.message || 'Registration Failed');
            setAccessToken(data.accessToken);
            setUser(data.user);
        } catch {
            setError('Network error');
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
            if (!res.ok) return setError(data.message || 'Login failed')
            setAccessToken(data.accessToken);
            setUser(data.user);
        } catch {
            setError('Network error')
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        await fetch('http://localhost:5004/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setAccessToken(null);
        setUser(null)
    }

    async function getProfile() {
        const res = await fetchWithAuth('http://localhost:5004/user/profile');
        if (!res.ok) return null;
        const data = await res.json();
    }

    return { user, error, loading, registerNewUser, login, logout, getProfile }
}

export default useAuth
