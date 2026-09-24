import React from 'react'
import { Link } from 'react-router'
import style from './QuickProfile.module.css'
import picture from '../assets/profile.jpeg'
//Context
import { useAuthContext } from '../context/AuthContext'

const QuickProfile = () => {
    const { logout, user } = useAuthContext();
    return (
        <div className={style.layout}>

            <section className={style.pictureCage}>
                <Link to={`/${user.handle}`}>
                    <img src={user.avatar_url} className={style.profilePic} />
                </Link>
            </section>

            <section className={style.identificatorCage}>
                <Link to={`/${user.handle}`}>
                    <h1 className={style.nickname}>{user.username}</h1>
                    <h1 className={style.handle}>{`@${user.handle}`}</h1>
                </Link>
                <h1 className={style.bio}>{user.bio}</h1>
            </section>

            <section className={style.statusCage}>
                <h1 className={style.status}>{user.quick_status}</h1>
            </section>
            {/* Make this a drop menu later on with options */}
            <button className={style.option} onClick={logout}></button>
        </div>
    )
}

export default QuickProfile
