import React from 'react'
import { Outlet } from 'react-router'
import style from './RootLayout.module.css'
import SideBar from '../Pages/SideBar'
import MainFeed from '../Pages/MainFeed'
import ProfileFeed from '../Pages/ProfileFeed'


const RootLayout = () => {
    return (
        <div className={`${style.grid}`}>
            <div className={style.columnOne}>
                <SideBar />
            </div>
            <div className={style.columnTwo}>
                <MainFeed />
            </div>
            <div className={style.columnThree}>
                <ProfileFeed />
            </div>
        </div>
    )
}

export default RootLayout
