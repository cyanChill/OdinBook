import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import toast from "react-hot-toast";

import useAuthContext from "../../../hooks/useAuthContext";

import styles from "./index.module.css";
import Loading from "../../../components/ui/loading";
import FriendWidget from "../../../components/friends/widget";
import Card from "../../../components/ui/card";

const FriendsPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, authedFetch } = useAuthContext();

  const [isOwner, setIsOwner] = useState(false);
  const [friendLists, setFriendLists] = useState({
    requests: null,
    friends: [],
  });
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
        if (action === "accept") {
          setFriendLists((prev) => ({
            requests: prev.requests.filter((req) => req._id !== reqObj._id),
            friends: [...prev.friends, reqObj],
          }));
        } else {
          setFriendLists((prev) => ({
            ...prev,
            requests: prev.requests.filter((req) => req._id !== reqObj._id),
          }));
        }
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      setLoading(true);
      setIsOwner(userId === user.id);

      try {
        const [reqRes, frRes] = await Promise.all([
          authedFetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/friends/requests`
          ),
          authedFetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/friends`
          ),
        ]);
        const [reqData, frData] = await Promise.all([
          reqRes.json(),
          frRes.json(),
        ]);

        if (reqRes.ok) {
          if (userId === user.id) {
            setFriendLists({
              requests: reqData.friendRequests,
              friends: frData.friends,
            });
          } else {
            setFriendLists({ requests: null, friends: frData.friends });
          }
        } else {
          navigate("/error", { replace: true });
        }
      } catch (err) {
        console.log("Something unexpected occurred.");
        navigate("/error", { replace: true });
      }

      setLoading(false);
    };

    getUserInfo();
  }, [user, userId]); // eslint-disable-line

  if (loading) {
    return <Loading fullWidth />;
  }

  return (
    <div className={styles.container}>
      {isOwner && (
        <>
          <h2>Friend Requests</h2>
          <div className={styles.cardsContainer}>
            {friendLists.requests.map((user) => (
              <Card key={user._id}>
                <FriendWidget
                  type="REQUESTS"
                  user={user}
                  handleRequest={handleRequest}
                />
              </Card>
            ))}

            {friendLists.requests.length === 0 && (
              <p className={styles.noneFound}>No friend requests found.</p>
            )}
          </div>
        </>
      )}

      <h2>Friends</h2>
      <div className={styles.cardsContainer}>
        {friendLists.friends.map((user) => (
          <Card key={user._id}>
            <FriendWidget type="FRIENDS" user={user} />
          </Card>
        ))}

        {friendLists.friends.length === 0 && (
          <p className={styles.noneFound}>
            No friends found. Find some people using the search feature!
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
