import React from "react";

const Button = ({
  children,
  onClick,
  variant = "solid",
  color = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-2xl active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants = {
    solid: {
      primary:
        "bg-primary-500 text-white shadow-[0_0_20px_rgba(10,105,201,0.3)] hover:bg-primary-400 hover:shadow-[0_0_25px_rgba(10,105,201,0.5)]",
      secondary:
        "bg-secondary-500 text-white shadow-[0_0_20px_rgba(20,142,205,0.3)] hover:bg-secondary-400 hover:shadow-[0_0_25px_rgba(20,142,205,0.5)]",
      success: "bg-success-500 text-white hover:bg-success-400",
      danger: "bg-danger-500 text-white hover:bg-danger-400",
      neutral: "bg-white/10 text-white hover:bg-white/20 backdrop-blur-md",
    },
    outlined: {
      primary:
        "border-2 border-primary-500 text-primary-400 hover:bg-primary-500/10",
      secondary:
        "border-2 border-secondary-500 text-secondary-400 hover:bg-secondary-500/10",
      neutral: "border border-white/20 text-white hover:bg-white/5",
    },
    flat: {
      primary: "bg-primary-500/10 text-primary-400 hover:bg-primary-500/20",
      neutral: "bg-white/5 text-white hover:bg-white/10",
    },
  };

  const variantStyles =
    (variants[variant] && variants[variant][color]) || variants.solid.primary;

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
