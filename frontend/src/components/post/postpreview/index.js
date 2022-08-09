import { Link, useNavigate } from "react-router-dom";
import { format, formatDistance } from "date-fns";

import styles from "./index.module.css";
import Card from "../../ui/card";
import ProfilePic from "../../ui/profilePic";
import LikeCounter from "../counters/likeCounter";
import CommentCounter from "../counters/commentCounter";

const PostPreview = ({ post }) => {
  const navigate = useNavigate();

  const author = post.author;

  const handleClick = (e) => {
    if (!e.target.closest(".postInfo")) navigate(`/posts/${post._id}`);
  };

  return (
    <Card className={styles.post} onClick={handleClick}>
      <div className={styles.postHeader}>
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
            {new Date(post.timestamp) < Date.now() - 1000 * 60 * 60 * 24
              ? format(new Date(post.timestamp), "PP '('pp')'")
              : formatDistance(new Date(post.timestamp), new Date(), {
                  addSuffix: true,
                })}
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
    </Card>
  );
};

export default PostPreview;
