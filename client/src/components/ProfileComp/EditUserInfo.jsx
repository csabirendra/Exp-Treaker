
import React, { useState } from "react";

const EditUserInfo = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    FULLNAME: user.FULLNAME || "",
    EMAIL: user.EMAIL || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onUpdate(formData);
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Edit Information</h2>
      
      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">Full Name</label>
        <input
          type="text"
          name="FULLNAME"
          value={formData.FULLNAME}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="mb-3">
        <label className="block text-sm text-gray-600 mb-1">Email</label>
        <input
          type="email"
          name="EMAIL"
          value={formData.EMAIL}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
      >
        Save Changes
      </button>
    </div>
  );
};

export default EditUserInfo;
