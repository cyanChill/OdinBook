import styles from "./index.module.css";

const Loading = ({ size, thickness, fullWidth }) => {
  let additionalStyles = {};
  if (size) additionalStyles["--size"] = size;
  if (thickness) additionalStyles["--thickness"] = thickness;
  
  if (fullWidth) {
    return (
      <div className={styles.loadingContainer}>
        <div className={`${styles.loading}`} />
      </div>
    );
  }

  return <div className={styles.loading} />;
};

export default Loading;
