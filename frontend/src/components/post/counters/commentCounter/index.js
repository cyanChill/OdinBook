import { BiCommentDetail } from "react-icons/bi";

import styles from "../index.module.css";

const CommentCounter = ({ comments }) => {
  return (
    <div className={styles.counter}>
      <BiCommentDetail /> <span>{comments.length}</span>
    </div>
  );
};

export default CommentCounter;
