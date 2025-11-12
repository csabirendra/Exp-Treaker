import React, { useEffect } from "react";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, onEditInstead }) => {
  if (!isOpen) return null;

  // ✅ Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ✅ Close on outside click
  const handleOverlayClick = (e) => {
    if (e.target.id === "overlay") {
      onClose();
    }
  };

  return (
    <div
      id="overlay"
      className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-51"
      onClick={handleOverlayClick}
    >
      {/* ---------- DESKTOP MODAL ---------- */}
      <div className="hidden md:block bg-white rounded-xl shadow-lg w-full max-w-md p-6 text-center relative">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-3">
          Delete Transaction?
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this transaction?
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Yes, Delete
          </button>
          <button
            onClick={onEditInstead}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Edit Instead
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>



{/* ---------- MOBILE MODAL ---------- */}



      <div className="block md:hidden bg-gray-950 rounded-t-2xl shadow-xl w-full absolute bottom-70 p-4 pt-4 text-center">
        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Delete Transaction ?</h2>
        {/* <hr className="text-white mb-5"/> */}
        {/* <p className="text-sm text-gray-100 mb-4 bg-yellow-800">Note: Deleted Transaction can not be reversed.</p> */}

        {/* Buttons stacked */}
        <div className="flex flex-row justify-center gap-5 mb-4">
          

          <button
            onClick={onConfirm}
            className="w-auto px-2 py-2 border-none bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            Yes, Delete
          </button>

          <button
            onClick={onClose}
            className="py-0 border-none bg-black text-green-600 text-xl rounded-lg hover:bg-gray-300 text-sm"
          >
            cancel
          </button>



          {/* <button
            onClick={onEditInstead}
            className="w-1/3 py-2 border-none bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Edit Instead
          </button> */}
          
        </div>
        <div className="mb-3 hidden">
          <p className="text-sm text-gray-100 mb-4 bg-yellow-800">Note: Deleted Transaction can not be reversed.</p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
