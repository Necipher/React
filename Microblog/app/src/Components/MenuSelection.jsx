import React from 'react'
import style from './MenuSelection.module.css'

const Selection = () => {
    return (
        <div className={style.layout}>
            <h2>HOME</h2>
            <h2>DIRECT MESSAGES</h2>
            <h2>NOTIFICATIONS</h2>
            <h2>FOLLOWING / FOLLOWERS</h2>
            <h2>SETTINGS</h2>
        </div>
    )
}

export default Selection
