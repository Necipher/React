import style from './Post.module.css'
import { Link } from 'react-router'
import { useNavigate } from 'react-router';


const Post = ({ avatar_url, content, handle, username, photo, public_id, created_at }) => {
    const navigate = useNavigate();
    const goToProfile = (e) => {
        e.stopPropagation();
        navigate(`/${handle}`)
    }

    const time = new Date(created_at).toLocaleString(undefined, { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })

    return (
        <div className={style.postLayout} onClick={(e) => { e.stopPropagation(); navigate(`/${handle}/status/${public_id}`) }}>
            <img src={avatar_url} className={style.profilePicture} onClick={goToProfile} />
            <div className={style.profileName} onClick={goToProfile}>
                <h1 className={style.nickname}>{username}</h1>
                <h4 className={style.handle}>@{handle}</h4>
            </div>
            <h2 className={style.post}>{content}{photo ? <img className={style.photo} src={photo} /> : ''}</h2>
            <div className={style.operations}>
                <button className={style.operationButton}>A</button>
                <button className={style.operationButton}>B</button>
                <button className={style.operationButton}>C</button>
                <button className={style.operationButton}>D</button>
            </div>
        </div >
    )
}

export default Post
