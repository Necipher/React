import { useState, useEffect } from "react";
import { useParams } from "react-router"
import usePost from "../hooks/usePost";
import Post from "../Components/Post";

const PostPage = () => {
  const params = useParams();
  const { fetchAPost, loading, error } = usePost();
  const [post, setPost] = useState(null)

  useEffect(() => {
    (async () => {
      setPost(await fetchAPost(params))
    })()
  }, [params.postId])

  if (loading) return <p>Fetching files...</p>
  if (error) return <p>{error}</p>
  if (!post) return <p>Post not found...</p>

  return (
    <div>
      {/* The Post component needs to change to a custom one where a reply is possible from a user */}
      <Post
        key={post.public_id}
        content={post.content}
        avatar_url={post.avatar_url}
        handle={post.handle}
        username={post.username}
        photo={post.image_url}
        public_id={post.public_id}
        created_at={post.created_at}
      />
    </div>
  )
}

export default PostPage
