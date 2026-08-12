import React from 'react'
import style from './UserProfile.module.css'
import { NavLink, Outlet } from 'react-router'
//Components
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
                <button><NavLink className={({isActive}) => isActive ? style.active : ""} to={'.'} end>POSTS</NavLink></button>
                <button><NavLink className={({isActive}) => isActive ? style.active : ""} to={'liked'}>LIKED/SAVED</NavLink></button>
                <button><NavLink className={({isActive}) => isActive ? style.active : ""} to={'comments'}>COMMENTS</NavLink></button>
                <button><NavLink className={({isActive}) => isActive ? style.active : ""} to={'followers'}>FOLLOWERS</NavLink></button>
                <button><NavLink className={({isActive}) => isActive ? style.active : ""} to={'following'}>FOLLOWING</NavLink></button>
                <button><NavLink className={({isActive}) => isActive ? style.active : ""} to={'media'}>MEDIA</NavLink></button>
            </div>
            <div className={style.feed}>
                <Outlet />
            </div>
        </div>
    )
}

export default UserProfile
