import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";

import useAuthContext from "../../../hooks/useAuthContext";

import styles from "./index.module.css";
import Loading from "../../ui/loading";
import Card from "../../ui/card";
import ProfilePic from "../../ui/profilePic";

const FriendsList = () => {
  const { user, authedFetch } = useAuthContext();

  const [requests, setRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleRequest = async (reqObj, action) => {
    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.id}/friends/${reqObj._id}/handle`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: action }),
        }
      );
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        if (action === "accept") setFriends((prev) => [...prev, reqObj]);
        setRequests((prev) => prev.filter((req) => req._id !== reqObj._id));
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  useEffect(() => {
    const getFriendRequests = async () => {
      setLoading(true);
      try {
        const res = await authedFetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.id}`
        );
        const data = await res.json();
        setRequests(data.user.friendRequests);
        setFriends(data.user.friends);
      } catch (err) {
        console.log("Something unexpected occurred.");
      }
      setLoading(false);
    };

    if (user) getFriendRequests();
  }, []);

  return (
    <Card className={styles.listsContainer}>
      <BasicList
        listName="Friend Requests"
        loading={loading}
        items={requests}
        type="REQUESTS"
        handleRequest={handleRequest}
      />
      <BasicList
        listName="Friends"
        loading={loading}
        items={friends}
        type="FRIENDS"
      />
    </Card>
  );
};

export default FriendsList;

const BasicList = ({ listName, loading, items, type, handleRequest }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.list}>
      <p className={styles.listName}>{listName}</p>

      {loading && <Loading fullWidth />}
      {!loading && (
        <div className={styles.entryContainer}>
          {items.map((user) => (
            <div key={user._id} className={styles.entry}>
              <div
                className={styles.userInfo}
                onClick={() => navigate(`/profiles/${user._id}`)}
              >
                <ProfilePic
                  src={user.profilePicUrl}
                  alt={`${user.first_name}'s profile pic`}
                  rounded
                />
                <span className="ellipse">
                  {user.first_name} {user.last_name}
                </span>
              </div>

              {type === "REQUESTS" && (
                <div className={styles.actions}>
                  <AiOutlineCheck
                    className={styles.accept}
                    onClick={() => handleRequest(user, "accept")}
                  />
                  <AiOutlineClose
                    className={styles.reject}
                    onClick={() => handleRequest(user, "reject")}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
