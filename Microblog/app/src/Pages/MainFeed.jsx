import React from 'react'
import Post from '../Components/Post'
import TopBar from '../Components/TopBar'
import style from './MainFeed.module.css'
import testPhoto from '../assets/space.png'

const MainFeed = () => {
  return (
    <div className={style.layout}>
      <TopBar />
      <div>
        <Post /> 
        <Post />
        <Post />
        <Post photo={testPhoto}/>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>
    </div>
  )
}

export default MainFeed
