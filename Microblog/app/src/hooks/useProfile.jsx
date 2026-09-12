import { useState } from "react";
import { fetchWithAuth, fetchWithOptionalAuth } from "../api/fetchWithAuth";

function useProfile() {
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchProfile(handle) {
        const res = await fetchWithOptionalAuth(`http://localhost:5004/${handle}`)
        const data = await res.json()

        setProfile(data);
        return true
    }

    return {profile, loading, error, fetchProfile}
}

export default useProfile;