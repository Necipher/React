import React from 'react'
import style from './TopBar.module.css'
import profile from '../assets/profile.jpeg'
import CreatePost from './CreatePost.jsx'
import { useAuthContext } from '../context/AuthContext.jsx'

const TopBar = () => {
  const { user } = useAuthContext()
  return (
    <div className={style.layout}>
      <div className={style.feedView}>
        <button className={style.feedButton}>My Following</button>
        <button className={style.feedButton}>My World</button>
      </div>
      {user && <CreatePost />}
    </div>
  )
}

export default TopBar 