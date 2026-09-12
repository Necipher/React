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
            // setPostsFeed here should force a refresh of the feed so the new post created automaticaly appears on top of the feed without needing a refresh but it DOESNT WORK
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
            setPostsFeed(prev => [...prev, ...data]);
            setOffset(prev => prev + limit);
            return true
        } catch (err) {
            console.error(err);
            return false
        } finally {
            setLoading(false)
        }

    }


    return { loading, error, createPost, fetchPosts, postsFeed };

}

export default usePost;

