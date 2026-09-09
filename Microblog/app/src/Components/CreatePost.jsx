import { useState, useEffect } from 'react'
import style from './CreatePost.module.css'
import profile from '../assets/profile.jpeg'
import usePost from '../hooks/usePost.jsx'

const CreatePost = () => {
    const { createPost, loading, error } = usePost()
    const [content, setContent] = useState('')
    const [posted, setPosted] = useState(false)

    useEffect(() => {
        if (!posted) return
        const timer = setTimeout(() => setPosted(false), 4000);
        return () => clearTimeout(timer)
    }, [posted])

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault()
                const success = await createPost(content)
                if (success) {
                    setContent('')
                    setPosted(true)
                }
            }}
            className={style.noteWrapper}>
            <img src={profile} className={style.profilePicture} />
            <input autoFocus maxLength={280} type='text' placeholder='What is new?' value={content} onChange={(e) => setContent(e.target.value)} />

            <section style={{marginRight: '10px'}}>
                {posted && <p className={style.message}>Message created</p>}
                {error && <p className={style.message}>{error}</p>}
            </section>

            <section style={{marginRight: '10px'}}>
                <p className={style.characterCount}>{content.length}/280</p>
                <button className={style.postButton}>POST</button>
            </section>

        </form>
    )
}

export default CreatePost
