import useAuthContext from "./useAuthContext";

const useSignOut = () => {
  const { dispatch } = useAuthContext();

  const signout = async () => {
    localStorage.removeItem("user-token");
    dispatch({ type: "LOGOUT" });
  };

  return { signout };
};

export default useSignOut;
