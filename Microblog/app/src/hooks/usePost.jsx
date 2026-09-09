import { useState } from "react";
import { fetchWithAuth } from '../api/fetchWithAuth.js'

function usePost() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function createPost(content) {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchWithAuth('http://localhost:5004/user/post', {
                method: 'POST',
                body: JSON.stringify({ content })
            })
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to create post');
                return false
            }
            return data.post


        } catch (err) {
            console.error(err);
            setError('Network error');
        } finally {
            setLoading(false)
        }
    }
    return { loading, error, createPost };

}

export default usePost;

