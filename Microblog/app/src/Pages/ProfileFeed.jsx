import React from 'react'
import QuickProfile from '../Components/QuickProfile'
import style from './ProfileFeed.module.css'
import Search from '../Components/Search'
import Trending from '../Components/Trending'

const ProfileFeed = () => {
  return (
    <div className={style.layout}>
      <QuickProfile />
      <Search />
      <Trending />
    </div>
  )
}

export default ProfileFeed
