import { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthContext } from "./context/authContext";

import styles from "./App.module.css";
import Loading from "./components/ui/loading";
import Navbar from "./components/nav";
import LoginPage from "./pages/auth/login";
import SignUpPage from "./pages/auth/signup";
import HomePage from "./pages/home";
import PostPage from "./pages/post";
import ProfilePage from "./pages/profile";
import FriendsPage from "./pages/profile/friends";
import SettingsPage from "./pages/settings";
import AccountSettingsPage from "./pages/settings/account";
import SecuritySettingsPage from "./pages/settings/security";
import SearchPage from "./pages/search";
import ErrorPage from "./pages/error";
import RestrictedPage from "./pages/error/restricted";

const App = () => {
  const { user, initialLoad } = useContext(AuthContext);

  if (initialLoad) {
    return <Loading fullWidth />;
  }

  return (
    <>
      <Toaster
        position="bottom center"
        toastOptions={{ style: { width: "max-content", maxWidth: "45rem" } }}
      />
      {/* Show navbar only if user is authenticated */}
      {user && <Navbar />}

      {/* Routes for when we're not authenticated */}
      {!user && (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}

      {/* Routes for when we're authenticated */}
      {user && (
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/posts/:postId" element={<PostPage />} />
            <Route path="/profiles">
              {/* "/profiles" will redirect user to their own profile */}
              <Route index element={<Navigate to={user.id} />} />
              <Route path=":userId">
                <Route index element={<ProfilePage />} />
                <Route path="friends" element={<FriendsPage />} />
              </Route>
            </Route>
            <Route path="/settings">
              <Route index element={<SettingsPage />} />
              <Route path="account" element={<AccountSettingsPage />} />
              <Route path="security" element={<SecuritySettingsPage />} />
            </Route>

            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="/restricted" element={<RestrictedPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      )}
    </>
  );
};

export default App;
