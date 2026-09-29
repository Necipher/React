import { useState, useEffect } from 'react'
import style from './CreatePost.module.css'
import { useAuthContext } from '../context/AuthContext'
import { usePostContext } from '../context/PostContext'

const CreatePost = ({ reload = null, parentId = null, placeholder = 'What is new?', buttonLabel = 'POST', autoFocus = true, error, loading }) => {
    const { createPost } = usePostContext();
    const { user } = useAuthContext();
    const [content, setContent] = useState('')
    const [status, setStatus] = useState(false)

    useEffect(() => {
        if (!status) return
        const timer = setTimeout(() => setStatus(false), 4000);
        return () => clearTimeout(timer)
    }, [status])

    async function handleSubmit(e) {
        e.preventDefault();
        const success = await createPost({ 'content': content, 'parentId': parentId });
        if (success) {
            setContent('');
            setStatus(true)
            reload?.(true)
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={style.noteWrapper}>
            <img src={user.avatar_url} className={style.profilePicture} />
            <input autoFocus={autoFocus} maxLength={280} type='text' placeholder={placeholder} value={content} onChange={(e) => setContent(e.target.value)} />

            <section style={{ marginRight: '10px' }}>
                {status && <p className={style.message}>Message created</p>}
                {error && <p className={style.message}>{error}</p>}
            </section>

            <section style={{ marginRight: '10px' }}>
                <p className={style.characterCount}>{content.length}/280</p>
                <button className={style.postButton}>{buttonLabel}</button>
            </section>

        </form>
    )
}

export default CreatePost
