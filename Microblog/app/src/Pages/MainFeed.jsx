import { useEffect } from 'react'
import Post from '../Components/Post'
import TopBar from '../Components/TopBar'
import style from './MainFeed.module.css'
import testPhoto from '../assets/space.png'
import usePost from '../hooks/usePost'

const MainFeed = () => {
  const { postsFeed, loading, error, fetchPosts } = usePost();

  useEffect(() => {
    fetchPosts();
  }, [])


  return (
    <div className={style.layout}>
      <TopBar />

      <div>
        {postsFeed.map(post => <Post key={post.public_id} content={post.content} /> )}
      </div>

      <button>MORE</button>
    </div>
  )
}

export default MainFeed
