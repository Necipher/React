import { useEffect } from 'react'
import style from './UserProfile.module.css'
import { NavLink, Outlet, useParams } from 'react-router'
import useProfile from '../hooks/useProfile'
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
    const { handle } = useParams();
    const { profile, fetchProfile } = useProfile();

    useEffect(() => {
        fetchProfile(handle)
    }, [handle])

    console.log(profile)
    return (
        <div className={style.layout}>
            <UserProfileTopBar />
            <div className={style.panoramaPicture}>
                <img className={style.photo} src={profile.user?.banner_url} />
            </div>
            <img src={profile.user?.avatar_url} className={style.profilePicture} />
            <div className={style.userInfo}>
                <div className={style.leftSide}>
                    <p className={style.nickname}>{profile.user?.username}</p>
                    <p className={style.handle}>{profile.user?.handle}</p>
                    <p className={style.ffCounter}>FOLLOWING: 0   FOLLOWERS: 0</p>
                </div>
                <div className={style.rightSide}>
                    <p className={style.bio}>{profile.user?.bio}</p>
                    <p className={style.dateJoined}>Date joined</p>
                </div>
            </div>
            <div className={style.optionMenu}>
                <button><NavLink className={({ isActive }) => isActive ? style.active : ""} to={'.'} end>POSTS</NavLink></button>
                <button><NavLink className={({ isActive }) => isActive ? style.active : ""} to={'liked'}>LIKED/SAVED</NavLink></button>
                <button><NavLink className={({ isActive }) => isActive ? style.active : ""} to={'comments'}>COMMENTS</NavLink></button>
                <button><NavLink className={({ isActive }) => isActive ? style.active : ""} to={'followers'}>FOLLOWERS</NavLink></button>
                <button><NavLink className={({ isActive }) => isActive ? style.active : ""} to={'following'}>FOLLOWING</NavLink></button>
                <button><NavLink className={({ isActive }) => isActive ? style.active : ""} to={'media'}>MEDIA</NavLink></button>
            </div>
            <div className={style.feed}>
                <Outlet />
            </div>
        </div>
    )
}

export default UserProfile
