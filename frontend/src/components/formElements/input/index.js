import styles from "./index.module.css";

const Input = ({ className, ...rest }) => {
  return <input className={`${styles.input} ${className}`} {...rest} />;
};

export default Input;
