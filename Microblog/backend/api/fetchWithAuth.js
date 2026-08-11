let accessToken = null;
const setAccessToken = (token) => accessToken = token;
const getAccessToken = () => accessToken

const tryRefresh = async () => {
    try {
        const res = await fetch('http://localhost:5000/auth/refresh', {
            method: 'POST',
            credentials: 'include'
        });
        if (res.ok) {
            const data = await res.json();
            setAccessToken(data.accessToken);
            return true;
        }
        return false
    } catch {
        return false;
    }
};

const fetchWithAuth = async (url, options = {}) => {
    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            ...options.headers,
            'Content-type': 'application/json',
            'authorization': `Bearer ${accessToken}`
        }
    });

    if (res.status === 401) {
        const refreshed = await tryRefresh();


        if (refreshed) {
            return fetch(url, {
                ...options,
                credentials: 'include',
                headers: {
                    ...options.headers,
                    'content-type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                }
            });
        } else {
            window.location.href = '/login'
        }
    }

    return res;
}