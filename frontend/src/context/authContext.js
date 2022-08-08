import { createContext, useReducer, useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { intervalToDuration } from "date-fns";

import { tokenExpireTime } from "../util/jwt";

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

  const autoLogoutRef = useRef();
  const warnMsgTimerRef = useRef();
  const warnTimerRefreshRef = useRef();

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

  // Revalidate session w/ localStorage token
  const revalidateSession = async () => {
    const prevToken = JSON.parse(localStorage.getItem("user-token"));
    if (!prevToken) return; // No previous token

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
      const data = await res.json(); // Token is valid
      dispatch({
        type: "LOGIN",
        payload: { userId: data.userId, token: prevToken },
      });
    } else {
      localStorage.removeItem("user-token"); // Token is invalid
    }
  };

  // Auto-Logout Warning Toast w/ "live" countdown timer
  const autoLogoutLiveToast = () => {
    if (state.user && state.user.token) {
      const expTime = tokenExpireTime(state.user.token);
      const dur = intervalToDuration({ start: 0, end: expTime });
      toast(
        `Your session will expire in ${
          dur.minutes === 0 ? "" : `${dur.minutes} mins`
        } ${
          dur.seconds === 0 ? "" : `${dur.seconds} secs`
        }. Please re-login to refresh the timer.`,
        { icon: "⚠️", duration: expTime, id: "countdown" }
      );
    }
  };

  const clearTimers = () => {
    clearTimeout(autoLogoutRef.current);
    clearTimeout(warnMsgTimerRef.current);
    clearInterval(warnTimerRefreshRef.current);
    autoLogoutRef.current = null;
    warnMsgTimerRef.current = null;
    warnTimerRefreshRef.current = null;
  };

  useEffect(() => {
    const initialRevalidation = async () => {
      setInitialLoad(true);
      await revalidateSession();
      setInitialLoad(false);
    };

    initialRevalidation();
  }, []);

  // Logic for auto-logout
  useEffect(() => {
    // Trigger to check token if storage is changed
    window.addEventListener("storage", revalidateSession);

    if (state.user && state.user.token) {
      // Checks token & set autologout function
      const expTime = tokenExpireTime(state.user.token);
      autoLogoutRef.current = setTimeout(() => {
        // Logout of user
        localStorage.removeItem("user-token");
        dispatch({ type: "LOGOUT" });
        toast.error("Your session has expired.", { id: "session-exp" });
      }, expTime);

      // Send warning toast ~10min before session ends
      if (expTime > 600000) {
        warnMsgTimerRef.current = setTimeout(() => {
          autoLogoutLiveToast();
          warnTimerRefreshRef.current = setInterval(autoLogoutLiveToast, 1000);
        }, expTime - 600000);
      } else {
        autoLogoutLiveToast();
        warnTimerRefreshRef.current = setInterval(autoLogoutLiveToast, 1000);
      }
    }

    return () => {
      window.removeEventListener("storage", revalidateSession);
      clearTimers();
    };
  }, [state.user]);

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
