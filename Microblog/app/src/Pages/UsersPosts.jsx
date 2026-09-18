import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import usePost from '../hooks/usePost'
import style from './UsersPosts.module.css'
import Post from '../Components/Post'

const UsersPosts = () => {
    const { handle } = useParams()
    const { fetchUserPosts } = usePost();
    const [user, setUser] = useState()
    const [userPosts, setUserPosts] = useState([])
    const display = userPosts?.length > 0 ? 'layoutTrue' : 'layout'


    useEffect(() => {
        (async () => {
            const data = await fetchUserPosts(handle)
            setUser(data.user)
            setUserPosts(data.posts)
        })();
    }, [handle])

    return (
        <div className={style[display]}>
            {userPosts?.length > 0 ?
                userPosts.map(post =>
                    <Post
                        key={post.public_id}
                        content={post.content}
                        avatar_url={user.avatar_url}
                        handle={user.handle}
                        username={user.username}
                        photo={post.image_url}
                        public_id={post.public_id}
                        created_at={post.created_at}
                    />)
                :
                <div>
                    <p>No Posts yet. Would you want to add one?</p>
                    <button>ADD POST</button>
                </div>
            }

        </div>
    )
}

export default UsersPosts
