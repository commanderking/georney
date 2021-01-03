import React from "react";
import styles from "./styles.module.scss";
type Props = {
  className?: string;
  onClick?: () => void;
  children: React.ReactChild;
};

const Button = ({
  className = styles.button,
  onClick = () => {},
  children,
}) => {
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
