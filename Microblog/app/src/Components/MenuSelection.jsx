import React from 'react'
import { NavLink } from 'react-router'
import style from './MenuSelection.module.css'
import { useAuthContext } from '../context/AuthContext'

const Selection = () => {
    const { user } = useAuthContext();
    return (
        <div className={style.layout}>
            <h2><NavLink className={({ isActive }) => isActive ? style.active : style.inactive} to='/'>HOME</NavLink></h2>
            <h2><NavLink className={({ isActive }) => isActive ? style.active : style.inactive} to='/directmessages'>DIRECT MESSAGES</NavLink></h2>
            <h2><NavLink className={({ isActive }) => isActive ? style.active : style.inactive} to='/notifications'>NOTIFICATIONS</NavLink></h2>
            <h2><NavLink className={({ isActive }) => isActive ? style.active : style.inactive} to={user ? `/${user.handle}` : '/'}>PROFILE</NavLink></h2>
            <h2><NavLink className={({ isActive }) => isActive ? style.active : style.inactive} to='/settings'>SETTINGS</NavLink></h2>
        </div>
    )
}

export default Selection
