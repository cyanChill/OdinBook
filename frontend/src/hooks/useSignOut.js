import { useNavigate } from "react-router";

import useAuthContext from "./useAuthContext";

const useSignOut = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuthContext();

  const signout = async () => {
    localStorage.removeItem("user-token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return { signout };
};

export default useSignOut;
