import { createContext, useReducer, useState, useEffect } from "react";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return { user: action.payload };
    case "LOGOUT":
      return { user: null };
    default:
      return state;
  }
};

const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user: null });
  const [initialLoad, setInitialLoad] = useState(true);

  // Helper function so we don't need to add the "Authorization" header
  // everytime we need to make an authorized request
  const authedFetch = (url, opts = {}) => {
    let newOpts = opts;
    // Add the "Authorization" header
    !newOpts.headers
      ? (newOpts.headers = { Authorization: `bearer ${state.user.token}` })
      : (newOpts.headers = {
          ...newOpts.headers,
          Authorization: `bearer ${state.user.token}`,
        });
    return fetch(url, newOpts);
  };

  const revalidatePrevSession = async () => {
    setInitialLoad(true);
    const prevToken = JSON.parse(localStorage.getItem("user-token"));
    if (!prevToken) {
      // No previous token
      setInitialLoad(false);
      return;
    }

    // Validate token stored in localStorage
    const res = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/validateToken`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${prevToken}`,
        },
      }
    );

    if (res.ok) {
      // Token is valid
      const data = await res.json();
      dispatch({
        type: "LOGIN",
        payload: { userId: data.userId, token: prevToken },
      });
    } else {
      // Token is invalid
      localStorage.removeItem("user-token");
    }
    setInitialLoad(false);
  };

  useEffect(() => {
    revalidatePrevSession();
  }, []);

  console.log("AuthContext State:", state);

  return (
    <AuthContext.Provider
      value={{ ...state, dispatch, initialLoad, authedFetch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
