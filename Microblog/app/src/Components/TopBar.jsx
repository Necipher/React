import React from 'react'
import style from './TopBar.module.css'
import profile from '../assets/profile.jpeg'

const TopBar = () => {
  return (
    <div className={style.layout}>
      <div className={style.feedView}>
        <button className={style.feedButton}>My Following</button>
        <button className={style.feedButton}>My World</button>
      </div>
      <div className={style.noteWrapper}>
        <img src={profile} className={style.profilePicture} />
        <input autoFocus type='text' placeholder='What is new?' />
      </div>
    </div>
  )
}

export default TopBar 