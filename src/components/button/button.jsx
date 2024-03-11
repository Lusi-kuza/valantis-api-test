import React from "react";
import buttonStyle from "./button.module.css";

const Button = ({
  content,
  handler,
  name,
  isActive = true,
  select = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`${buttonStyle.button} ${
        select ? buttonStyle.button_isActive : ""
      }`}
      {...(handler && { onClick: () => handler(name) })}
      disabled={!isActive}
    >
      <p
        className={`${
          name === "prev" || name === "next"
            ? buttonStyle.arrow
            : buttonStyle.content
        }`}
      >
        {content}
      </p>
    </button>
  );
};

export { Button };
