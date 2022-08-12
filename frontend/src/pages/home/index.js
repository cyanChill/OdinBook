import { useState, useRef, useEffect } from "react";

import usePageLocation from "../../hooks/usePageLocation";
import useAuthContext from "../../hooks/useAuthContext";

import styles from "./index.module.css";
import Loading from "../../components/ui/loading";
import PostPreview from "../../components/post/postpreview";
import UploadForm from "../../components/post/uploadForm";
import FriendsList from "../../components/friends/list";

const HomePage = () => {
  const { authedFetch } = useAuthContext();
  const [containerRef, isVisible] = usePageLocation({
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [feedData, setFeedData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [done, setDone] = useState(false);
  const feedStartDateRef = useRef(Date.now());

  const getFeed = async () => {
    setIsFetching(true);

    try {
      const res = await authedFetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/posts?since=${feedStartDateRef.current}&skip=${skip}`
      );
      const data = await res.json();
      if (res.ok) {
        setFeedData((prev) => [...prev, ...data.posts]);
        setSkip((prev) => prev + data.posts.length);
      } else {
        setDone(true);
      }
      if (data.posts.length === 0) setDone(true);
    } catch (err) {
      setDone(true);
      console.log("Something unexpected occurred.");
    }

    setIsFetching(false);
  };

  const addToFeed = (newPost) => setFeedData((prev) => [newPost, ...prev]);

  const removeFromFeed = (postId) => {
    setFeedData((prev) => prev.filter((pst) => pst._id !== postId));
  };

  useEffect(() => {
    if (isVisible && !isFetching && !done) getFeed();
  }, [isFetching, isVisible, done]); // eslint-disable-line

  return (
    <div className={styles.homeContainer}>
      {/* Home Feed */}
      <section className={styles.mainContainer}>
        <UploadForm addToFeed={addToFeed} />

        <div className={styles.postContainer}>
          {feedData.map((post) => (
            <PostPreview
              key={post._id}
              post={post}
              onPostDelete={removeFromFeed}
            />
          ))}
        </div>

        {!isFetching && feedData.length === 0 && (
          <p className={styles.emptyFeedMsg}>
            Your feed is empty. Add friends or post something to fill it up!
          </p>
        )}

        {/* When "visible" on screens, send request for more data */}
        {isFetching && <Loading fullWidth />}
        <span ref={containerRef} />
      </section>

      {/* Friends + Friend Requests */}
      <section className={styles.friendsContainer}>
        <FriendsList />
      </section>
    </div>
  );
};

export default HomePage;
