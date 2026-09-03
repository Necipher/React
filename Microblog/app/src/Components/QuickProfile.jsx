import React from 'react'
import { Link } from 'react-router'
import style from './QuickProfile.module.css'
import picture from '../assets/profile.jpeg'
//Context
import { useAuthContext } from '../context/AuthContext'

const QuickProfile = () => {
    const { logout } = useAuthContext();
    return (
        <div className={style.layout}>

            <section className={style.pictureCage}>
                <Link to='/profile'>
                    <img src={picture} className={style.profilePic} />
                </Link>
            </section>

            <section className={style.identificatorCage}>
                <Link to='/profile'>
                    <h1 className={style.nickname}>Jeff</h1>
                    <h1 className={style.handle}>@Jerfreyson</h1>
                </Link>
                <h1 className={style.bio}>An Extroverted Introvert</h1>
            </section>

            <section className={style.statusCage}>
                <h1 className={style.status}>Just had the best Tonkotsu Ramen in Tokyo</h1>
            </section>
            {/* Make this a drop menu later on with options */}
            <button className={style.option} onClick={logout}></button>
        </div>
    )
}

export default QuickProfile
