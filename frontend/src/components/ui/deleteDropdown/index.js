import { useState } from "react";

import { BsThreeDotsVertical } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";

import styles from "./index.module.css";

const DeleteDropdown = ({ handleDelete, className }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={`${styles.ddContainer} ${className}`}>
      <BsThreeDotsVertical onClick={() => setIsActive((prev) => !prev)} />

      <div className={`${styles.ddItem} ${isActive && styles.show}`}>
        <FaRegTrashAlt onClick={handleDelete} className={styles.delete} />
      </div>
    </div>
  );
};

export default DeleteDropdown;
