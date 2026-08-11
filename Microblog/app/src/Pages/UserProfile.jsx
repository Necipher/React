import React from 'react'
import style from './UserProfile.module.css'
import UserProfileTopBar from '../Components/UserProfileTopBar'
import profile from '../assets/profile.jpeg'
import testPhoto from '../assets/space.png'
import UsersPosts from './UsersPosts'
import UserLikedPosts from './UserLikedPosts'
import UserComments from './UserComments'
import UserFollowers from './UserFollowers'
import UserFollowing from './UserFollowing'
import UserMedia from './UserMedia'

const UserProfile = () => {
    return (
        <div className={style.layout}>
            <UserProfileTopBar />
            <div className={style.panoramaPicture}>
                <img className={style.photo} src={testPhoto} />
            </div>
            <img src={profile} className={style.profilePicture} />
            <div className={style.userInfo}>
                <div className={style.leftSide}>
                    <p className={style.nickname}>User nickname</p>
                    <p className={style.handle}>Registered nickname</p>
                    <p className={style.ffCounter}>FOLLOWING: 0   FOLLOWERS: 0</p>
                </div>
                <div className={style.rightSide}>
                    <p className={style.bio}>BIO Description</p>
                    <p className={style.dateJoined}>Date joined</p>
                </div>
            </div>
            <div className={style.optionMenu}>
                <button>POSTS</button>
                <button>LIKED/SAVED</button>
                <button>COMMENTS</button>
                <button>FOLLOWERS</button>
                <button>FOLLOWING</button>
                <button>MEDIA</button>
            </div>
            <div className={style.feed}>
                <UserMedia />
            </div>
        </div>
    )
}

export default UserProfile
