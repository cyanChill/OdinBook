import { Link } from "react-router-dom";

import styles from "../index.module.css";

const RestrictedPage = () => {
  return (
    <div className={styles.container}>
      <h1>You don't have permission to view this, Odinite!</h1>
      <p>
        It seems like you don't have permissions to view this resource.{" "}
        <Link to="/" replace>Click here to return to the homepage.</Link>
      </p>
      <img src="/assets/404.png" alt="404 img" />
    </div>
  );
};

export default RestrictedPage;
