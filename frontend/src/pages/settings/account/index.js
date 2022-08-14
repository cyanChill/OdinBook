import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { IoChevronBackCircle } from "react-icons/io5";
import toast from "react-hot-toast";

import useAuthContext from "../../../hooks/useAuthContext";
import useAuthUpdate from "../../../hooks/useAuthUpdate";

import styles from "./index.module.css";
import Loading from "../../../components/ui/loading";
import Button from "../../../components/formElements/button";
import Input from "../../../components/formElements/input";
import ProfilePic from "../../../components/ui/profilePic";
import Card from "../../../components/ui/card";

const AccountSettingsPage = () => {
  const navigate = useNavigate();
  const { user, authedFetch } = useAuthContext();
  const { updateProfilePic, updateGeneralInfo } = useAuthUpdate();

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  const handlePhotoChange = async (e) => {
    if (e.target.files.length === 0) return;
    const formData = new FormData();
    formData.append("profileImg", e.target.files[0]);

    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profilepic`,
        { method: "PUT", body: formData }
      );
      const data = await res.json();

      if (res.ok) {
        updateProfilePic(data.profilePicUrl);
      } else {
        if (data.errors) data.errors.map((err) => toast.error(err.msg));
        else toast.error(data.message);
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  const removePhoto = async () => {
    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profilepic`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) updateProfilePic("");
      else toast.error(data.message);
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  const handleGeneralProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/profile`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            first_name: userInfo.firstName,
            last_name: userInfo.lastName,
            email: userInfo.email,
          }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        updateGeneralInfo(
          userInfo.firstName,
          userInfo.lastName,
          userInfo.email
        );
      } else {
        if (data.errors) data.errors.map((err) => toast.error(err.msg));
        else toast.error(data.message);
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  useEffect(() => {
    const populateUserData = async () => {
      setLoading(true);
      try {
        const res = await authedFetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.id}`
        );
        const data = await res.json();

        if (res.ok)
          setUserInfo({
            firstName: data.user.first_name,
            lastName: data.user.last_name,
            email: data.user.email,
          });
        else navigate("/error", { replace: true });
      } catch (err) {
        console.log("Something unexpected occurred.");
      }
      setLoading(false);
    };

    populateUserData();
  }, [user]); // eslint-disable-line

  if (loading) {
    return <Loading fullWidth />;
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div onClick={() => navigate("..")} className={styles.back}>
          <IoChevronBackCircle /> Account
        </div>

        <section className={styles.section}>
          <h2>Photo</h2>
          <div className={styles.profilePic}>
            <ProfilePic
              src={user.profilePicUrl}
              alt={`${user.first_name}'s profile pic`}
              rounded
            />

            <div className={styles.picAction}>
              <label htmlFor="profile-pic" className={styles.imgInputLabel}>
                Change
              </label>
              <input
                id="profile-pic"
                type="file"
                name="postImg"
                accept="image/*"
                onChange={handlePhotoChange}
                className={styles.imgInput}
              />
              <Button onClick={removePhoto} data-disabled={!user.profilePicUrl}>
                Remove
              </Button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2>Profile</h2>
          <form onSubmit={handleGeneralProfileUpdate} className={styles.form}>
            <div className={styles.formInputGroup}>
              <label>First name</label>
              <Input
                type="text"
                value={userInfo.firstName}
                onChange={(e) =>
                  setUserInfo((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                required
              />
            </div>

            <div className={styles.formInputGroup}>
              <label>Last name</label>
              <Input
                type="text"
                value={userInfo.lastName}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, lastName: e.target.value }))
                }
                required
              />
            </div>

            <div className={styles.formInputGroup}>
              <label>Email</label>
              <Input
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>

            <button type="submit" className="btn compressed green">
              Update
            </button>
          </form>
        </section>
      </Card>
    </div>
  );
};

export default AccountSettingsPage;
