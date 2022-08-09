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
import SearchPage from "./pages/search";
import ErrorPage from "./pages/error";

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

      <Routes>
        {/* Routes for when we're not authenticated */}
        {!user && (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
        {/* Routes for when we're authenticated */}
        {user && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="/signup" element={<Navigate to="/" />} />
            <Route path="*" element={<ErrorPage />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;
