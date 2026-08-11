import React from 'react'
import style from './UsersPosts.module.css'

const UsersPosts = () => {
    return (
        <div className={style.layout}>
            <p>No Posts yet. Would you want to add one?</p>
            <button>ADD POST</button>
        </div>
    )
}

export default UsersPosts
