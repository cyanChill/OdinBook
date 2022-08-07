import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useSignIn from "../../../hooks/useSignIn";

import styles from "../index.module.css";
import AuthPageBase from "../../../components/auth/authBase";
import Card from "../../../components/ui/card";
import FancyInput from "../../../components/formElements/fancyInput";

const LoginPage = () => {
  const { signin, isLoading, errors, clearErrors } = useSignIn();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signin(email, password);
  };

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
          <button className={`btn compressed `} disabled={isLoading}>
            Sign in with Facebook
          </button>
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
