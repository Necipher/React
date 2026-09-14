import { useEffect } from 'react'
import Post from '../Components/Post'
import TopBar from '../Components/TopBar'
import style from './MainFeed.module.css'
import usePost from '../hooks/usePost'

const MainFeed = () => {
  const { postsFeed, loading, error, fetchPosts, createPost } = usePost();

  useEffect(() => {
    fetchPosts();
  }, [])


  return (
    <div className={style.layout}>
      <TopBar createPost={createPost} error={error} loading={loading} />

      <div>
        {postsFeed.length > 0 ? postsFeed.map(post =>
          <Post
            key={post.public_id}
            content={post.content}
            avatar_url={post.avatar_url}
            handle={post.handle}
            username={post.username}
            photo={post.image_url}
            public_id={post.public_id}
          />) : <p className={style.emptyDatabase}>No posts exist yet</p>}
      </div>

      {/* Button needs to add functionality for loading more data */}
      {postsFeed.length > 0 ? <button className={style.moreButton}>MORE</button> : ''}
    </div >
  )
}

export default MainFeed
