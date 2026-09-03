import { useState } from "react";
import { fetchWithAuth } from '../api/fetchWithAuth.js'

const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    async function getProfile() {
        setLoading(true);
        setError(null);

        const res = await fetchWithAuth('http://localhost:5004/user/profile');
        if (!res.ok) {
            setError('Failed to load profile');
            return false
        }
        const data = await res.json();
        setProfile(data);
        return true;
    }

    return {profile, loading, error, getProfile}
};

export default useProfile;