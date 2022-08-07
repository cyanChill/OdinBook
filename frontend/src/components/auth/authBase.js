import styles from "./authBase.module.css";

const AuthPageBase = ({ children }) => {
  return (
    <div className={styles.container}>
      <div className={styles.ctaContainer}>
        <div className={styles.cta}>
          <div className={styles.logo}>
            <img src="/assets/logo.png" alt="App logo" />
            <span>OdinWorks</span>
          </div>
          <p>
            Connect with fellow vikings on their journey throughout the world in
            their web development journey.
          </p>
        </div>
      </div>
      <div className={styles.authLogicContainer}>{children}</div>
    </div>
  );
};

export default AuthPageBase;
