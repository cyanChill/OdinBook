import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useSignIn from "../../../hooks/useSignIn";

import styles from "../index.module.css";
import AuthPageBase from "../../../components/auth/authBase";
import Card from "../../../components/ui/card";
import FancyInput from "../../../components/formElements/fancyInput";
import { getCookie } from "../../../util/cookie";

const LoginPage = () => {
  const { signin, verifyFacebookSignIn, isLoading, errors, clearErrors } =
    useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await signin(email, password);
    if (ok) {
      toast.dismiss(); // Clear all previous toasts
      toast.success("Successfully logged in.");
    }
  };

  useEffect(() => {
    // See if we have a "auth" cookie if we tried to login with facebook
    if (document.cookie) {
      const ck = getCookie("auth");
      // Delete Cookie
      document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      if (ck) {
        verifyFacebookSignIn(ck).then((success) => {
          if (success) toast.success("Successfully logged in with Facebook.");
        });
      }
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (errors) {
      errors.forEach((err) => toast.error(err.msg, { duration: 5000 }));
      clearErrors();
    }
  }, [errors, clearErrors]);

  return (
    <AuthPageBase>
      <Card className={styles.authCard}>
        <p>Login to Your Account.</p>
        <form
          className={styles.authForm}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <FancyInput
            labelText="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FancyInput
            labelText="Password"
            type="password"
            minLength="6"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className={`btn compressed gold ${styles.cstmBtn}`}
            disabled={isLoading}
          >
            Login
          </button>
        </form>
        <div className={styles.otherActions}>
          <a
            className={`btn link compressed `}
            disabled={isLoading}
            href={`${process.env.REACT_APP_BACKEND_URL}/api/auth/login/facebook`}
          >
            Sign in with Facebook
          </a>
          <button className={`btn compressed green`} disabled={isLoading}>
            User Demo Account
          </button>
        </div>

        <Link to="/signup" className={styles.link}>
          New to OdinWorks? Create an Account.
        </Link>
      </Card>
    </AuthPageBase>
  );
};

export default LoginPage;
