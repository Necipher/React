import React from 'react'
import QuickProfile from '../Components/QuickProfile'
import style from './RightSideFeed.module.css'
import Search from '../Components/Search'
import Trending from '../Components/Trending'

const RightSideFeed = () => {
  return (
    <div className={style.layout}>
      <QuickProfile />
      <Search />
      <Trending />
    </div>
  )
}

export default RightSideFeed
