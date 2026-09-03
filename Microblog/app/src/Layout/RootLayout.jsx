import React from 'react'
import { useState } from 'react'
import { Outlet } from 'react-router'
import style from './RootLayout.module.css'
//Pages
import LeftSideBar from '../Pages/LeftSideBar'
import RightSideFeed from '../Pages/RightSideFeed'
//Components
import LoginForm from '../Components/LoginForm'
import RegisterForm from '../Components/RegisterForm'
//Context
import { useAuthContext } from '../context/AuthContext'

const RootLayout = () => {
    const [focusMode, setFocusMode] = useState(false)
    const { authView, setAuthView } = useAuthContext()

    return (
        <>
            {authView === 'login' && (
                <LoginForm
                    onClose={() => setAuthView(null)}
                    onSwitchToRegister={() => setAuthView('register')}
                />
            )}
            {authView === 'register' && (
                <RegisterForm
                    onClose={() => setAuthView(null)}
                    onSwitchToLogin={() => setAuthView('login')}
                />
            )}
            <div className={`${style.grid} ${focusMode ? style.focusMode : ''}`}>
                <div className={style.columnOne}>
                    <LeftSideBar />
                </div>
                <div className={style.columnTwo}>
                    <Outlet />
                </div>
                <div className={style.columnThree}>
                    <RightSideFeed />
                </div>
            </div>
        </>
    )
}

export default RootLayout

