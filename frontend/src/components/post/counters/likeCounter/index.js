import { useState, useEffect } from "react";
import { AiOutlineLike, AiTwotoneLike } from "react-icons/ai";

import useAuthContext from "../../../../hooks/useAuthContext";

import styles from "../index.module.css";

const LikeCounter = ({ postId, type, commentId, likes }) => {
  const { user, authedFetch } = useAuthContext();

  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes.length);

  const handleLikes = async () => {
    const fetchUrl =
      type === "post"
        ? `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/like`
        : `${process.env.REACT_APP_BACKEND_URL}/api/posts/${postId}/comments/${commentId}/like`;

    const res = await authedFetch(fetchUrl, { method: "PUT" });
    const data = await res.json();
    if (res.ok) {
      setHasLiked(data.liked);
      setLikeCount((prev) => prev + (data.liked ? 1 : -1));
    }
  };

  useEffect(() => {
    if (likes.includes(user.id)) setHasLiked(true);
  }, [likes, user.id]);

  return (
    <div className={styles.counter} onClick={handleLikes}>
      {hasLiked ? <AiTwotoneLike /> : <AiOutlineLike />}{" "}
      <span>{likeCount}</span>
    </div>
  );
};

export default LikeCounter;
