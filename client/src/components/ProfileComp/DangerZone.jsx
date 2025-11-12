import React from "react";
import { Trash2 } from "lucide-react";


const DangerZone = ({ onDeleteClick }) => {
  return (
    <div className="bg-gray-900 rounded-xl px-4 py-3 border-none mb-5">
      <div className="flex justify-start items-center gap-2 mb-2 text-red-600 mb-3">
        <Trash2/> 
        <span className="text-lg font-semibold text-red-600 my-auto">Delete Account</span>
      </div>
      <p className="text-sm text-gray-200 mb-3 text-justify">
        When you delete your account, all your data including personal details, 
        preferences, and saved history will be <span className="text-red-600">permanently</span> erased. This process is 
        irreversible — once deleted, your account cannot be recovered. We recommend 
        reviewing your account and saving anything important before continuing.
      </p>
      <div className="flex justify-end">
      <button
        className="bg-red-600 text-white px-3 py-2  border-none rounded-lg hover:bg-red-700 text-sm transition"
        onClick={onDeleteClick}>Delete My Account
      </button>
      </div>
    </div>
  );
};

export default DangerZone;
