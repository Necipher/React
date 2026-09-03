import React from 'react'
import QuickProfile from '../Components/QuickProfile'
import style from './RightSideFeed.module.css'
import Search from '../Components/Search'
import Trending from '../Components/Trending'
import LoginButton from '../Components/LoginButton'
//Context
import { useAuthContext } from '../context/AuthContext'

const RightSideFeed = () => {
  const { user } = useAuthContext()
  return (
    <div className={style.layout}>
      {user ? <QuickProfile /> : <LoginButton />}
      <Search />
      <Trending />
    </div>
  )
}

export default RightSideFeed
