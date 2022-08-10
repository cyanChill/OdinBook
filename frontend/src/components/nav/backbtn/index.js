import { Link } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";

import styles from "./index.module.css";

const BackButton = () => {
  return (
    <Link to=".." className={styles.backBtn}>
      <IoChevronBackOutline /> Back
    </Link>
  );
};

export default BackButton;
