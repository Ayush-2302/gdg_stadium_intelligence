import React from "react";

const Chip = ({
  children,
  color = "default",
  variant = "solid",
  size = "md",
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200";

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
    lg: "px-4 py-1.5 text-base",
  };

  const colorStyles = {
    default: {
      solid: "bg-gray-default-700 text-white",
      flat: "bg-gray-default-700/20 text-gray-default-300 border border-gray-default-700/50",
    },
    primary: {
      solid: "bg-primary-500 text-white",
      flat: "bg-primary-500/20 text-primary-400 border border-primary-500/50",
    },
    success: {
      solid: "bg-success-500 text-white",
      flat: "bg-success-500/20 text-success-400 border border-success-500/50",
    },
    warning: {
      solid: "bg-warning-500 text-white",
      flat: "bg-warning-500/20 text-warning-400 border border-warning-500/50",
    },
    danger: {
      solid: "bg-danger-500 text-white",
      flat: "bg-danger-500/20 text-danger-400 border border-danger-500/50",
    },
    info: {
      solid: "bg-secondary-500 text-white",
      flat: "bg-secondary-500/20 text-secondary-400 border border-secondary-500/50",
    },
  };

  const selectedColor = colorStyles[color] || colorStyles.default;
  const variantStyles = selectedColor[variant] || selectedColor.solid;

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export default Chip;
