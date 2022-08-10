import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { BsPeopleFill } from "react-icons/bs";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";
import toast from "react-hot-toast";

import useAuthContext from "../../hooks/useAuthContext";

import styles from "./index.module.css";
import ProfilePic from "../../components/ui/profilePic";
import UploadForm from "../../components/post/uploadForm";
import PostPreview from "../../components/post/postpreview";
import Loading from "../../components/ui/loading";
import Card from "../../components/ui/card";
import Button from "../../components/formElements/button";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { user, authedFetch } = useAuthContext();

  const [hasRequested, setHasRequested] = useState(false);
  const [inRequests, setInRequests] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  const addToFeed = (newPost) => {
    setUserInfo((prev) => ({
      ...prev,
      posts: [newPost, ...userInfo.posts],
    }));
  };

  const toggleRequest = async () => {
    if (isOwner || isFriend) return;

    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/friends/requests`,
        { method: "PUT" }
      );
      if (res.ok) {
        setHasRequested((prev) => !prev);
      } else {
        toast.error("Failed to toggle friend request.");
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  const handleFriendRequest = async (action) => {
    if (!inRequests) return;

    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.id}/friends/${userId}/handle`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: action }),
        }
      );

      if (res.ok) {
        if (action === "accept") navigate(0); // Refresh page on accept
        else setInRequests(false);
      }
    } catch (err) {
      console.log("Something unexpected occurred.");
    }
  };

  const handleUnfriend = async () => {
    if (isOwner || !isFriend) return;

    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}/friends/${user.id}/remove`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setHasRequested(false);
        setIsFriend(false);
      } else {
        toast.error("Failed to remove friend.");
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
        const [viewingRes, selfRes] = await Promise.all([
          authedFetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`
          ),
          authedFetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/users/${user.id}`
          ),
        ]);
        const [data, selfData] = await Promise.all([
          viewingRes.json(),
          selfRes.json(),
        ]);

        if (viewingRes.ok) {
          setHasRequested(
            userId !== user.id && data.user.friendRequests.includes(user.id)
          );

          setUserInfo(data.user);
          setIsFriend(userId !== user.id && data.user.posts !== undefined);
          // If the user sent a request to us
          setInRequests(
            selfData.user.friendRequests.some((req) => req._id === userId)
          );
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
  }, [userId]);

  if (loading) {
    return <Loading fullWidth />;
  }

  return (
    <div className={styles.container}>
      <Card className={styles.profileHeader}>
        <ProfilePic
          src={userInfo.profilePicUrl}
          alt={`${userInfo.first_name}'s profile pic`}
          rounded
        />

        <div className={styles.profileInfo}>
          <p className={`${styles.username} ellipse`}>
            {userInfo.first_name} {userInfo.last_name}
          </p>
          <Link
            to={`/profiles/${userId}/friends`}
            className={`${styles.friends} ellipse`}
          >
            {userInfo.friends.length} Friends <BsPeopleFill />
          </Link>

          {/* Depending on viewing user's relation with current user, display different things */}
          {/* If Friend: */}
          {isFriend && (
            <Button
              onClick={handleUnfriend}
              onMouseEnter={(e) => (e.target.textContent = "Unfriend")}
              onMouseLeave={(e) => (e.target.textContent = "Friend")}
              className={`${styles.btn} ellipse`}
            >
              Friend
            </Button>
          )}
          {/* If Not Friend: */}
          {!isFriend && !isOwner && !inRequests && (
            <Button
              onClick={toggleRequest}
              onMouseEnter={(e) =>
                (e.target.textContent = hasRequested
                  ? "Withdraw Request"
                  : "Send Request")
              }
              onMouseLeave={(e) =>
                (e.target.textContent = hasRequested
                  ? "Request Sent"
                  : "Send Request")
              }
              className={`${styles.btn} ellipse`}
            >
              {hasRequested ? "Request Sent" : "Send Request"}
            </Button>
          )}
          {/* If we recieved a request from user: */}
          {inRequests && (
            <div className={styles.requestsHandler}>
              <Button
                onClick={() => handleFriendRequest("accept")}
                className={styles.btn}
              >
                <FaUserPlus />
              </Button>
              <Button
                onClick={() => handleFriendRequest("reject")}
                className={styles.btn}
              >
                <FaUserTimes />
              </Button>
            </div>
          )}
        </div>
      </Card>

      <div className={styles.postContainer}>
        {isOwner && <UploadForm addToFeed={addToFeed} />}

        {(isFriend || isOwner) &&
          userInfo.posts.map((post) => (
            <PostPreview key={post._id} post={post} />
          ))}
      </div>
    </div>
  );
};

export default ProfilePage;
