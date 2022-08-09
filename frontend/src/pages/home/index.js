import { useState, useRef, useEffect } from "react";

import usePageLocation from "../../hooks/usePageLocation";
import useAuthContext from "../../hooks/useAuthContext";

import styles from "./index.module.css";
import Loading from "../../components/ui/loading";
import PostPreview from "../../components/post/postpreview";

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

    const res = await authedFetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/posts?since=${feedStartDateRef.current}&skip=${skip}`
    );
    const data = await res.json();
    if (res.ok) {
      setFeedData((prev) => [...prev, ...data.posts]);
      setSkip((prev) => prev + data.posts.length);
    }
    if (data.posts.length === 0) setDone(true);

    console.log(data.posts);

    setIsFetching(false);
  };

  useEffect(() => {
    if (isVisible && !isFetching && !done) getFeed();
  }, [isFetching, isVisible, done]);

  return (
    <div>
      {/* TODO: Create Post Form */}

      <div className={styles.postContainer}>
        {feedData.map((post) => (
          <PostPreview key={post._id} post={post} />
        ))}
      </div>

      {/* When "visible" on screens, send request for more data */}
      {isFetching && <Loading fullWidth />}
      <span ref={containerRef} />
    </div>
  );
};

export default HomePage;
