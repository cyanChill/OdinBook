import useAuthContext from "./useAuthContext";

const useAuthUpdate = () => {
  const { dispatch } = useAuthContext();

  const updateProfilePic = (newImgUrl) => {
    dispatch({ type: "PIC_UPDATE", payload: { profilePicUrl: newImgUrl } });
  };

  const updateGeneralInfo = (fstName, lstName, email) => {
    dispatch({
      type: "GENERAL_UPDATE",
      payload: {
        firstName: fstName,
        lastName: lstName,
        fullName: `${fstName} ${lstName}`,
        email: email,
      },
    });
  };

  return { updateProfilePic, updateGeneralInfo };
};

export default useAuthUpdate;
