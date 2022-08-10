import { useNavigate } from "react-router";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

import styles from "./index.module.css";
import ProfilePic from "../../ui/profilePic";

const FriendCard = ({ type, user, handleRequest, className }) => {
  const navigate = useNavigate();

  return (
    <div className={`${styles.entry} ${className}`}>
      <div
        className={styles.userInfo}
        onClick={() => navigate(`/profiles/${user._id}`)}
      >
        <ProfilePic
          src={user.profilePicUrl}
          alt={`${user.first_name}'s profile pic`}
          rounded
        />
        <span className="ellipse">
          {user.first_name} {user.last_name}
        </span>
      </div>

      {type === "REQUESTS" && (
        <div className={styles.actions}>
          <AiOutlineCheck
            className={styles.accept}
            onClick={() => handleRequest(user, "accept")}
          />
          <AiOutlineClose
            className={styles.reject}
            onClick={() => handleRequest(user, "reject")}
          />
        </div>
      )}
    </div>
  );
};

export default FriendCard;
