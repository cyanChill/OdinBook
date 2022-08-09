import styles from "./index.module.css";

const Button = ({ className, ...rest }) => {
  return <button className={`${styles.button} ${className}`} {...rest} />;
};

export default Button;
