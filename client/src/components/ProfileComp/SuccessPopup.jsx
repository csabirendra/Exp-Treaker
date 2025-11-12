import React from "react";

const SuccessPopup = ({ message }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <h2 className="text-lg font-bold text-green-600 mb-2">Success</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
};

export default SuccessPopup;
