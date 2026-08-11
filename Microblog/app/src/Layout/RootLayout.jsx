import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router'
import style from './RootLayout.module.css'
//Pages
import LeftSideBar from '../Pages/LeftSideBar'
import RightSideFeed from '../Pages/RightSideFeed'
import MainFeed from '../Pages/MainFeed'
import UserProfile from '../Pages/UserProfile'
import PostDetail from '../Pages/PostDetail'
import Notifications from '../Pages/Notifications'
//Components
import LoginForm from '../Components/LoginForm'
import RegisterForm from '../Components/RegisterForm'



const RootLayout = () => {
    const [focusMode, setFocusMode] = useState(false)
    const changeFocus = () => { setFocusMode(!focusMode) }
    return (
        <>
            {/* <RegisterForm />     */}
            {/* <LoginForm /> */}
            <div className={`${style.grid} ${focusMode ? style.focusMode : ''}`}>
                <div className={style.columnOne}>
                    <LeftSideBar />
                </div>
                <div className={style.columnTwo}>
                    <MainFeed />
                </div>
                <div className={style.columnThree}>
                    <RightSideFeed />
                </div>
            </div>
        </>
    )
}

export default RootLayout
