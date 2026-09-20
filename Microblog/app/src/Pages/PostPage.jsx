import { useState, useEffect } from "react";
import { useParams } from "react-router"
import Post from "../Components/Post";
import { usePostContext } from "../context/PostContext";

const PostPage = () => {
  const params = useParams();
  const { fetchAPost, loading, error } = usePostContext();
  const [userPost, setUserPost] = useState(null)

  useEffect(() => {
    (async () => {
      setUserPost(await fetchAPost(params))
    })()
  }, [params.postId])

  if (loading) return <p>Fetching files...</p>
  if (error) return <p>{error}</p>
  if (!userPost) return <p>Post not found...</p>

  return (
    <div>
      {/* The Post component needs to change to a custom one where a reply is possible from a user */}
      <Post
        key={userPost.public_id}
        content={userPost.content}
        avatar_url={userPost.avatar_url}
        handle={userPost.handle}
        username={userPost.username}
        photo={userPost.image_url}
        public_id={userPost.public_id}
        created_at={userPost.created_at}
        isOwner={userPost.isOwner}
      />
    </div>
  )
}

export default PostPage
