import { Link } from "react-router-dom";

import styles from "./index.module.css";

const ErrorPage = () => {
  return (
    <div className={styles.container}>
      <h1>Looks like you're lost, Odinite!</h1>
      <p>
        It seems like this page was not found.{" "}
        <Link to="/" replace>
          Click here to return to the homepage.
        </Link>
      </p>
      <img src="/assets/404.png" alt="404 img" />
    </div>
  );
};

export default ErrorPage;
