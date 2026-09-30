import { useState, useEffect } from "react";
import { useParams } from "react-router"
import Post from "../Components/Post";
import { usePostContext } from "../context/PostContext";
import { useAuthContext } from "../context/AuthContext";
import CreatePost from "../Components/CreatePost";

const PostPage = () => {
  const params = useParams();
  const { fetchAPost, loading, error } = usePostContext();
  const { user } = useAuthContext();
  const [userPost, setUserPost] = useState(null);
  const [replies, setReplies] = useState(null);
  const [reload, setReload] = useState(false)

  useEffect(() => {
    (async () => {
      const data = await fetchAPost(params);
      setUserPost(data.post);
      setReplies(data.replies);
      if (reload) setReload(false)
    })()
  }, [params.postId])

  if (loading) return <p>Fetching files...</p>
  if (error) return <p>{error}</p>
  if (!userPost) return <p>Post not found...</p>

  return (
    <div>
      {/* The Post component should change to a custom one where a reply is possible from a user */}
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
      {user && <CreatePost
        parentId={params.postId}
        placeholder="Write your reply."
        buttonLabel="REPLY"
        autoFocus={false}
        onCreated={(reply) => setReplies(prev => [reply, ...prev])}
      />}
      <section>
        {replies?.map(reply => {
          return <Post
            key={reply.public_id}
            content={reply.content}
            avatar_url={reply.avatar_url}
            handle={reply.handle}
            username={reply.username}
            photo={reply.image_url}
            public_id={reply.public_id}
            created_at={reply.created_at}
            isOwner={reply.isOwner}
          />
        })}
      </section>
    </div>
  )
}

export default PostPage
