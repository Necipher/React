import { useState } from "react";
import { fetchWithAuth, fetchWithOptionalAuth } from '../api/fetchWithAuth.js'
import { useAuthContext } from "../context/AuthContext.jsx";

function usePost() {
    const { user } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postsFeed, setPostsFeed] = useState([]);
    const [limit, setLimit] = useState(10);
    const [offset, setOffset] = useState(0);

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

            setPostsFeed(prev => [{ ...user, ...data.post }, ...prev])
            return { ...user, ...data.post }
            
        } catch (err) {
            console.error(err);
            setError('Network error');
            return false;
        } finally {
            setLoading(false)
        }
    }

    async function fetchPosts() {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchWithOptionalAuth(`http://localhost:5004/home?limit=${limit}&offset=${offset}`)
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to load posts')
                return false
            }
            setPostsFeed(prev => {
                const knownIds = new Set(prev.map(p => p.public_id));
                return [...prev, ...data.filter(p => !knownIds.has(p.public_id))]
            });



            setOffset(prev => prev + limit);
            return true
        } catch (err) {
            console.error(err);
            return false
        } finally {
            setLoading(false)
        }

    }

    async function fetchUserPosts(handle) {
        setLoading(true);
        setError(null);

        const res = await fetchWithOptionalAuth(`http://localhost:5004/userPosts/${handle}`);
        const data = await res.json()

        return data;
    }

    async function fetchAPost({ postId }) {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchWithOptionalAuth(`http://localhost:5004/user/post/${postId}`, { method: 'GET' });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Failed to load post');
                return false;
            }

            return data.data;
        } catch (err) {
            console.error(err);
            return false
        } finally {
            setLoading(false);
        }
    }

    async function deleteAPost({ postId }) {
        setLoading(true);
        setError(null);

        try {
            const res = await fetchWithAuth(`http://localhost:5004/user/post/${postId}`, { method: 'DELETE' })
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Failed to delete');
                return false
            }

            setPostsFeed(prev => prev.filter(a => a.public_id !== postId))
            return data
        } catch (err) {
            console.error(err)
            return false
        } finally {
            setLoading(false)
        }
    }

    async function updateAPost({ postId, updatedContent }) {
        setLoading(true);
        setError(null);
        try {
            const res = await fetchWithAuth(`http://localhost:5004/user/post/${postId}`, { method: 'PATCH', body: JSON.stringify({updatedContent}) });
            const data = await res.json();
            if (!res.ok) {
                setError(data.error || 'Message update failed');
                return false
            }
            return data
        } catch (err) {
            console.error(err);
            return false
        } finally {
            setLoading(false)
        }
    }

    return {
        postsFeed,
        loading,
        error,
        createPost,
        fetchPosts,
        fetchUserPosts,
        fetchAPost,
        deleteAPost,
        updateAPost
    };

}

export default usePost;

