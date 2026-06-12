import React from 'react'
import style from './QuickProfile.module.css'
import picture from '../assets/profile.jpeg'

const QuickProfile = () => {
    return (
        <div className={style.layout}>

            <section className={style.pictureCage}>
                <img src={picture} className={style.profilePic} />
            </section>

            <section className={style.identificatorCage}>
                <h1 className={style.nickname}>Jeff</h1>
                <h1 className={style.handle}>@Jerfreyson</h1>
                <h1 className={style.bio}>An Extroverted Introvert</h1>
            </section>

            <section className={style.statusCage}>
                <h1 className={style.status}>Just had the best Tonkotsu Ramen in Tokyo</h1>
            </section>

            <button className={style.option}></button>
        </div>
    )
}

export default QuickProfile
