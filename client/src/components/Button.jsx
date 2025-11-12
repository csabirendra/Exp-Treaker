import React from "react";

/**
 * Props:
 * - text: string
 * - onClick: fn
 * - type: "button" | "submit"
 * - loading: bool
 * - variant: "primary" | "secondary" (default primary)
 * - disabled: bool
 */
export default function Button({
  text = "Button",
  onClick = () => {},
  type = "button",
  loading = false,
  variant = "primary",
  disabled = false
}) {
  const base = "w-full py-2 rounded-lg font-medium transition inline-flex justify-center items-center";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-white border text-gray-700 hover:bg-gray-50"
  };
  const classes = `${base} ${variants[variant] || variants.primary} ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""}`;

  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled || loading}>
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span>{text}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
}
