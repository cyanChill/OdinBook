import { BiCommentDetail } from "react-icons/bi";

import { simplifyNum } from "../../../../util/simplify";
import styles from "../index.module.css";

const CommentCounter = ({ comments }) => {
  return (
    <div className={styles.counter}>
      <BiCommentDetail /> <span>{simplifyNum(comments.length)}</span>
    </div>
  );
};

export default CommentCounter;
