import styles from "./index.module.css";

const Card = ({ className, children, ...rest }) => {
  return (
    <div className={`${styles.card} ${className}`} {...rest}>
      {children}
    </div>
  );
};

export default Card;
