import { useState } from "react";

import useAuthContext from "./useAuthContext";

const useSignIn = () => {
  const { dispatch } = useAuthContext();

  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signin = async (email, password) => {
    setIsLoading(true);
    setErrors(null);

    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password: password }),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      // Some errors has occurred
      if (data.errors) setErrors(data.errors);
      else setErrors([{ msg: data.message }]);
    } else {
      // Succesfully signed in
      localStorage.setItem("user-token", JSON.stringify(data.token));
      dispatch({
        type: "LOGIN",
        payload: { ...data.user, token: data.token },
      });
    }

    setIsLoading(false);
    return res.ok;
  };

  const verifyFacebookSignIn = async (token) => {
    setIsLoading(true);

    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/validateToken`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      const data = await res.json(); // Token is valid
      localStorage.setItem("user-token", JSON.stringify(token));
      dispatch({
        type: "LOGIN",
        payload: { ...data.user, token: token },
      });
    }

    setIsLoading(false);
    return res.ok;
  };

  const clearErrors = () => setErrors(null);

  return { signin, verifyFacebookSignIn, isLoading, errors, clearErrors };
};

export default useSignIn;
