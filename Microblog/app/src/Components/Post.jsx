import React from 'react'
import profile from '../assets/profile.jpeg'
import style from './Post.module.css'

const Post = ({ photo }) => {

    const postText = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
    return (
        <div className={style.postLayout}>
            <img src={profile} className={style.profilePicture} />
            <div className={style.profileName}>
                <h1 className={style.nickname}>Jeff</h1>
                <h4 className={style.handle}>@Jerfreyson</h4>
            </div>
            <h2 className={style.post}>{postText}{photo ? <img className={style.photo} src={photo} /> : ''}</h2>
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
