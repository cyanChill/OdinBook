import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";

import styles from "./index.module.css";

const BackButton = () => {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className={styles.backBtn}>
      <IoChevronBackOutline /> Back
    </button>
  );
};

export default BackButton;
