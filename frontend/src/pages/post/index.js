import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";

import useAuthContext from "../../hooks/useAuthContext";

import styles from "./index.module.css";
import Loading from "../../components/ui/loading";
import PostBase from "../../components/post/base";
import { ProfileInputComp } from "../../components/post/uploadForm";
import BackButton from "../../components/nav/backbtn";
import Comment from "../../components/post/comment";

const PostPage = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user, authedFetch } = useAuthContext();

  const [commentVal, setCommentVal] = useState("");

  const [post, setPost] = useState(true);
  const [loading, setLoading] = useState(true);

  const handleNewComment = async (e) => {
    e.preventDefault();

    try {
      const res = await await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: commentVal }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setPost((prev) => ({
          ...prev,
          comments: [...prev.comments, data.comment],
        }));
        setCommentVal("");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  const deleteComment = async (id) => {
    try {
      const res = await await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) {
        setPost((prev) => ({
          ...prev,
          comments: prev.comments.filter((cmt) => cmt._id !== id),
        }));
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  const onPostDelete = () => navigate("/", { replace: true });

  useEffect(() => {
    const getPostInfo = async () => {
      setLoading(true);

      try {
        const res = await authedFetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}`
        );

        if (res.ok) {
          const data = await res.json();
          setPost(data.post);
        } else {
          if (res.status === 401 || res.status === 403) {
            navigate("/restricted", { replace: true });
          } else {
            navigate("/error", { replace: true });
          }
        }
      } catch (err) {
        console.log("Something unexpected occurred.");
      }

      setLoading(false);
    };

    getPostInfo();
  }, []);

  if (loading) {
    return <Loading fullWidth />;
  }

  return (
    <div className={styles.container}>
      <BackButton />

      <PostBase post={post} className={styles.post} onDelete={onPostDelete}>
        <form onSubmit={handleNewComment}>
          <ProfileInputComp
            user={user}
            placeholder="Write a comment..."
            value={commentVal}
            onChange={(e) => setCommentVal(e.target.value)}
          />
        </form>

        {post.comments.length > 0 && (
          <div className={styles.commentContainer}>
            {post.comments.map((cmt) => (
              <Comment
                key={cmt._id}
                postId={postId}
                comment={cmt}
                handleDelete={deleteComment}
              />
            ))}
          </div>
        )}
      </PostBase>
    </div>
  );
};

export default PostPage;
