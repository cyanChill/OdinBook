import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaRegTrashAlt } from "react-icons/fa";

import useAuthContext from "../../../hooks/useAuthContext";

import { correctPostDate } from "../../../util/date";
import styles from "./index.module.css";
import ProfilePic from "../../ui/profilePic";
import LikeCounter from "../counters/likeCounter";
import DeleteDropdown from "../../ui/deleteDropdown";

const Comment = ({ postId, comment, handleDelete }) => {
  const { user } = useAuthContext();

  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (comment.user._id === user.id) setIsOwner(true);
    else setIsOwner(false);
  }, [comment, user]);

  return (
    <div className={styles.comment}>
      <ProfilePic
        src={comment.user.profilePicUrl}
        alt={`${comment.user.first_name}'s profile pic`}
        rounded
      />

      <div className={styles.commentBody}>
        <div className={styles.commentHeader}>
          <Link
            to={`/profiles/${comment.user._id}`}
            className={`${styles.username} ellipse`}
          >
            {comment.user.first_name} {comment.user.last_name}{" "}
            <span>({correctPostDate(comment.timestamp)})</span>
          </Link>
          {isOwner && (
            <DeleteDropdown
              handleDelete={() => handleDelete(comment._id)}
              className={styles.altDDColors}
            />
          )}
        </div>

        <p className={styles.commentContent}>{comment.comment}</p>

        <div className={styles.likeContainer}>
          <LikeCounter
            type="comment"
            likes={comment.likes}
            postId={postId}
            commentId={comment._id}
          />
        </div>
      </div>
    </div>
  );
};

export default Comment;
