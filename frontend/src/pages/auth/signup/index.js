import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import useSignUp from "../../../hooks/useSignUp";

import styles from "../index.module.css";
import AuthPageBase from "../../../components/auth/authBase";
import Card from "../../../components/ui/card";
import FancyInput from "../../../components/formElements/fancyInput";

const SignUpPage = () => {
  const { signup, isLoading, errors, clearErrors } = useSignUp();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ok = await signup(firstName, lastName, email, password, confirmPass);
    if (ok) {
      toast.dismiss(); // Clear all previous toasts
      toast.success("Successfully signed up.");
    }
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
        <p>Create an Account.</p>
        <form
          className={styles.authForm}
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <FancyInput
            labelText="First Name"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <FancyInput
            labelText="Last Name"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
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
          <FancyInput
            labelText="Confirm Password"
            type="password"
            minLength="6"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
            required
          />

          <button
            className={`btn compressed gold ${styles.cstmBtn}`}
            disabled={isLoading}
          >
            Create Account & Login
          </button>
        </form>

        <Link to="/login" className={styles.link}>
          Already have an account? Login.
        </Link>
      </Card>
    </AuthPageBase>
  );
};

export default SignUpPage;
