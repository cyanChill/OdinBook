import { useState } from "react";

import useAuthContext from "./useAuthContext";

const useSignUp = () => {
  const { dispatch } = useAuthContext();

  const [errors, setErrors] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (
    firstName,
    lastName,
    email,
    password,
    confirmPassword
  ) => {
    setIsLoading(true);
    setErrors(null);

    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/signup`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          confirm_password: confirmPassword,
        }),
      }
    );
    const data = await res.json();

    if (!res.ok) {
      // Some errors has occurred
      if (data.errors) setErrors(data.errors);
      else setErrors([{ msg: data.message }]);
    } else {
      // Succesfully signed up
      localStorage.setItem("user-token", JSON.stringify(data.token));
      dispatch({
        type: "LOGIN",
        payload: { userId: data.userId, token: data.token },
      });
    }

    setIsLoading(false);
    return res.ok;
  };

  const clearErrors = () => setErrors(null);

  return { signup, isLoading, errors, clearErrors };
};

export default useSignUp;
