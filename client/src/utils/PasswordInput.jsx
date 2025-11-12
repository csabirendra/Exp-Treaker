import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const PasswordInput = ({
  label,
  placeholder = "Enter password",
  value,
  onChange,
  required = false,
  className = "",
}) => {
  const [show, setShow] = useState(false);

  return (
    <div className="relative border-none w-full">
      {/* {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {label}*
        </label>
      )} */}

      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full bg-gray-600 md:bg-gray-700 text-white border-none rounded-lg px-3 py-2 pr-10 text-sm outline-none focus:outline-none ${className}`}
      />

      {/* Eye toggle button */}
      {/* <button
        type="button"
        onClick={() => setShow(!show)}
        className="absolute right-3 top-3/4 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button> */}
    </div>
  );
};

export default PasswordInput;
