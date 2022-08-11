import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";
import toast from "react-hot-toast";

import useAuthContext from "../../../hooks/useAuthContext";

import { correctPostDate } from "../../../util/date";
import styles from "./index.module.css";
import Card from "../../ui/card";
import ProfilePic from "../../ui/profilePic";
import LikeCounter from "../counters/likeCounter";
import CommentCounter from "../counters/commentCounter";

const PostBase = ({ post, children, isPreview, onDelete, className }) => {
  const navigate = useNavigate();
  const { user, authedFetch } = useAuthContext();

  const [isOwner, setIsOwner] = useState(false);
  const author = post.author;

  const handleClick = (e) => {
    if (!e.target.closest(".ignoreClick")) navigate(`/posts/${post._id}`);
  };

  const handleDelete = async () => {
    try {
      const res = await await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts/${post._id}`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) onDelete(post._id);
      else toast.error(data.message);
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  useEffect(() => {
    if (post.author._id === user.id) setIsOwner(true);
    else setIsOwner(false);
  }, [user, post]);

  return (
    <Card
      className={`${styles.post} ${isPreview && styles.isPreview} ${className}`}
      onClick={isPreview ? handleClick : null}
    >
      <div className={styles.postHeader}>
        <ProfilePic
          src={author.profilePicUrl}
          alt={`${author.first_name}'s profile pic`}
          className={"ignoreClick"}
          rounded
        />
        <div className={styles.postHeaderInfo}>
          <div className={`ignoreClick ${styles.username} ellipse`}>
            <Link to={`/profiles/${author._id}`}>
              {author.first_name} {author.last_name}
            </Link>
            <p className={`${styles.postedAgo} ellipse`}>
              {/* If post is over a day old, set displayed date to actual date */}
              {correctPostDate(post.timestamp)}
            </p>
          </div>

          {isOwner && (
            <FaRegTrashAlt
              onClick={() => handleDelete(post._id)}
              className={`ignoreClick ${styles.delete}`}
            />
          )}
        </div>
      </div>

      <p className={styles.postContent}>{post.content}</p>

      {post.imgUrl && (
        <img src={post.imgUrl} alt="" className={styles.postImg} />
      )}

      <div className={`ignoreClick ${styles.postInfo}`}>
        <LikeCounter postId={post._id} type="post" likes={post.likes} />
        <CommentCounter comments={post.comments} />
      </div>

      {/* For the post page (expanding onto it)*/}
      {children}
    </Card>
  );
};

export default PostBase;
