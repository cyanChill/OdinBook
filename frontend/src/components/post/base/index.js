import { Link, useNavigate } from "react-router-dom";

import { correctPostDate } from "../../../util/date";
import styles from "./index.module.css";
import Card from "../../ui/card";
import ProfilePic from "../../ui/profilePic";
import LikeCounter from "../counters/likeCounter";
import CommentCounter from "../counters/commentCounter";

const PostBase = ({ post, children, isPreview, className }) => {
  const navigate = useNavigate();

  const author = post.author;

  const handleClick = (e) => {
    if (!e.target.closest(".postInfo") && !e.target.closest(".postHeader"))
      navigate(`/posts/${post._id}`);
  };

  return (
    <Card
      className={`${styles.post} ${isPreview && styles.isPreview} ${className}`}
      onClick={isPreview ? handleClick : null}
    >
      <div className={`postHeader ${styles.postHeader}`}>
        <ProfilePic
          src={author.profilePicUrl}
          alt={`${author.first_name}'s profile pic`}
          rounded
        />
        <div className={`${styles.postHeaderInfo} ellipse`}>
          <Link to={`/profiles/${author._id}`}>
            {author.first_name} {author.last_name}
          </Link>
          <p className={`${styles.postedAgo} ellipse`}>
            {/* If post is over a day old, set displayed date to actual date */}
            {correctPostDate(post.timestamp)}
          </p>
        </div>
      </div>

      <p className={styles.postContent}>{post.content}</p>

      {post.imgUrl && (
        <img src={post.imgUrl} alt="" className={styles.postImg} />
      )}

      <div className={`postInfo ${styles.postInfo}`}>
        <LikeCounter postId={post._id} type="post" likes={post.likes} />
        <CommentCounter comments={post.comments} />
      </div>

      {/* For the post page (expanding onto it)*/}
      {children}
    </Card>
  );
};

export default PostBase;
