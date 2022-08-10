import { useState } from "react";

import { useNavigate } from "react-router";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { IoChevronBackCircle } from "react-icons/io5";
import toast from "react-hot-toast";

import useAuthContext from "../../../hooks/useAuthContext";
import useSignOut from "../../../hooks/useSignOut";

import styles from "./index.module.css";
import Input from "../../../components/formElements/input";
import Card from "../../../components/ui/card";

const SecuritySettingsPage = () => {
  const navigate = useNavigate();
  const { authedFetch } = useAuthContext();
  const { signout } = useSignOut();

  const [showConfirm, setShowConfirm] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();

    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/password`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            old_password: e.target.old_pass.value,
            new_password: e.target.new_pass.value,
            confirm_password: e.target.confirm_pass.value,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        toast.success("Successfully updated password.");
        e.target.old_pass.value = "";
        e.target.new_pass.value = "";
        e.target.confirm_pass.value = "";
      } else {
        data.errors.forEach((err) => toast.error(err.msg));
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/`,
        { method: "DELETE" }
      );
      if (res.ok) {
        signout();
        toast.success("Successfully deleted account.", 10000);
      } else {
        toast.error("Failed to delete account.");
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div onClick={() => navigate("..")} className={styles.back}>
          <IoChevronBackCircle /> Security
        </div>

        <section className={styles.section}>
          <h2>Password</h2>
          <Card className={styles.tip}>
            <b>Tip:</b> If you're signing in with Facebook, you can set a
            password and log in normally with your Facebook email & the password
            you've just created.
          </Card>
          <form onSubmit={handlePasswordUpdate} className={styles.form}>
            <label>Old Password</label>
            <Input type="password" name="old_pass" />
            <label>New Password</label>
            <Input type="password" name="new_pass" required />
            <label>Confirm New Password</label>
            <Input type="password" name="confirm_pass" required />
            <button type="submit" className="btn compressed green">
              Update
            </button>
          </form>
        </section>

        <section className={styles.section}>
          <h2>Account Deletion</h2>
          <Card className={styles.danger}>
            <b>Danger!</b> Clicking <b>Delete Account</b> will{" "}
            <b>PERMANENTLY</b> delete your account.
          </Card>
          {!showConfirm && (
            <button
              className="btn compressed red"
              onClick={() => setShowConfirm(true)}
            >
              Delete Account
            </button>
          )}

          {showConfirm && (
            <div className={styles.confirmation}>
              <p>Are you sure?</p>

              <div className={styles.confirmationActions}>
                <button
                  className="btn compressed green"
                  onClick={() => setShowConfirm(false)}
                >
                  <AiOutlineClose />
                </button>
                <button className="btn compressed red" onClick={deleteAccount}>
                  <AiOutlineCheck />
                </button>
              </div>
            </div>
          )}
        </section>
      </Card>
    </div>
  );
};

export default SecuritySettingsPage;
