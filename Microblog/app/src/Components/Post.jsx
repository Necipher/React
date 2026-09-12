import style from './Post.module.css'


const Post = ({ avatar_url, content, handle, username, photo }) => {

    return (
        <div className={style.postLayout}>
            <img src={avatar_url} className={style.profilePicture} />
            <div className={style.profileName}>
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
        </div>
    )
}

export default Post
