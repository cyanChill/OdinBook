import { useState, useEffect } from "react";

import styles from "./index.module.css";

const FancyInput = ({ className, labelText, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!rest.value) setIsFocused(false);
    else setIsFocused(true);
  }, []); // eslint-disable-line

  const onInputFocus = () => {
    setIsFocused(true);
  };

  const onInputUnFocus = (e) => {
    if (!e.target.value) setIsFocused(false);
  };

  return (
    <div className={`${styles.fancyInput} ${className}`}>
      <input
        type="text"
        {...rest}
        onFocus={onInputFocus}
        onBlur={onInputUnFocus}
      />
      <label className={isFocused ? styles.focused : null}>{labelText}</label>
    </div>
  );
};

export default FancyInput;
