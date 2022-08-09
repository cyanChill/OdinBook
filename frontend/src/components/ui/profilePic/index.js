import styles from "./index.module.css";

const ProfilePic = ({ src, rounded, className, ...rest }) => {
  return (
    <img
      src={src || "/assets/default_profile_pic.jpg"}
      alt="user profile pic"
      className={`${rounded && styles.rounded} ${className}`}
      {...rest}
    />
  );
};

export default ProfilePic;
