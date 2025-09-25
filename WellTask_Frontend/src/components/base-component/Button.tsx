import React from "react";
import classNames from "classnames";

type ButtonType = "primary" | "secondary" | "outline" | "custom";

interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  type?: ButtonType;
  htmlType?: "submit" | "reset" | "button";
  fullWidth?: boolean;
  size?: "small" | "medium" | "large";
}

export function Button({
  children,
  type = "primary",
  htmlType,
  fullWidth = false,
  size = "medium",
  className,
  ...props
}: ButtonProps) {
  const buttonClass = classNames(
    "btn",
    `btn-${type}`,
    `btn-${size}`,
    { "btn-full": fullWidth },
    className
  );

  return (
    <button className={buttonClass} type={htmlType} {...props}>
      {children}
    </button>
  );
}
