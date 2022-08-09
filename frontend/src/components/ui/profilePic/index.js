const ProfilePic = ({ src, ...rest }) => {
  return (
    <img
      src={src || "/assets/default_profile_pic.jpg"}
      alt="user profile pic"
    />
  );
};

export default ProfilePic;
