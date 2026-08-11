import React from 'react'
import style from './UserMedia.module.css'

const UserMedia = () => {
  return (
    <div className={style.layout}>
      <p>No media uploaded yet. Want to change that?</p>
      <button>ADD MEDIA</button>
    </div>
  )
}

export default UserMedia
