let accessToken = null;
const setAccessToken = (token) => accessToken = token;
const getAccessToken = () => accessToken

const tryRefresh = async () => {

    const res = await fetch('http://localhost/5004/auth/refresh', {
        method: 'POST',
        credentials: 'include'
    });

    if (res.ok) {
        const data = await res.json();
        setAccessToken(data.accessToken);
        return true
    }
    return false
}

const fetchWithAuth = async (url, options = {}) => {
    const res = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
            ...options.headers,
            'Content-type': 'application/json',
            'authorization': `Bearer ${accessToken}`
        }
    })
// condition for trying to refresh
// condition for failing
}
