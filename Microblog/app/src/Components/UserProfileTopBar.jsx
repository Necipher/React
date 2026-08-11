import React from 'react'
import style from './UserProfileTopBar.module.css'

const UserProfileTopBar = () => {
  return (
    <div className={style.layout}>
      <button>PRIVATE</button>
      <p>PROFILE PAGE</p>
      <button>EDIT PROFILE</button>
    </div>
  )
}

export default UserProfileTopBar
