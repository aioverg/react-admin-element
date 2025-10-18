import { HTMLAttributes } from "react";

function BaseCard(props: HTMLAttributes<unknown>) {
  const { children, className } = props;

  return (
    <div
      style={{
        padding: "0.75rem 1.25rem",
        borderRadius: "0.75rem",
        overflow: "auto",
        height: "100%",
        marginTop: "10px",
        position: "relative",
      }}
      {...props}
      className={`base-card ${className}`}
    >
      {children}
    </div>
  );
}

export default BaseCard;
