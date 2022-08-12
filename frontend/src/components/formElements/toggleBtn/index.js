import styles from "./index.module.css";

const ToggleButton = ({ width, type, className, style, ...rest }) => {
  const btnStyles = { ...style, "--toggle-btn-width": width };

  return (
    <input
      type="checkbox"
      className={`${styles.togglePill} ${className}`}
      style={btnStyles}
      {...rest}
    />
  );
};

export default ToggleButton;
