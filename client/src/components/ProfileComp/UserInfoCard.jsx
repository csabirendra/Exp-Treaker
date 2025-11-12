import React, { useState } from "react";
import { User, Mail, Phone, Calendar, Edit2, Check, X } from "lucide-react";
import maleAvatar from "../../assets/avatars/male.png";
import femaleAvatar from "../../assets/avatars/female.png";
import neutralAvatar from "../../assets/avatars/neutral.png";


// Animation
import { motion, AnimatePresence } from "framer-motion"; // downside animation
import { CheckCircle } from "lucide-react"; // 


const UserInfoCard = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [showSavedPopup, setShowSavedPopup] = useState(false);

  const [formData, setFormData] = useState({
    FULLNAME: user.FULLNAME || "",
    DOB: user.DOB || "",
    GENDER: user.GENDER || "",
    PHONE: user.PHONE || "",
  });

  const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await onUpdate(formData); // call parent handler
    setEditing(false);

    // Show popup for 3 seconds
    setShowSavedPopup(true);
    setTimeout(() => setShowSavedPopup(false), 1200);                                            // pop-up timeout
  };

  const handleCancel = () => {
    setFormData({
      FULLNAME: user.FULLNAME || "",
      DOB: user.DOB || "",
      GENDER: user.GENDER || "",
      PHONE: user.PHONE || "",
    });
    setEditing(false);
  };

  const avatar =
    formData.GENDER === "Male"
      ? maleAvatar
      : formData.GENDER === "Female"
      ? femaleAvatar
      : neutralAvatar;

  return (
    <>
      {/* ---------- PC / Desktop View ---------- */}
      <div className="hidden md:block bg-gray-900 w-100 rounded-lg p-3 mb-3 relative">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={avatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full border-2 border-gray-500"
          />
          <h2 className="text-xl font-semibold text-gray-400">
            Hi👋 <span className="font-">{user.FULLNAME?.split(" ")[0]} !</span>
          </h2>
        </div>

        {!editing ? (
          <>
            <div className="text-gray-100 space-y-0">
              <p><span className="font-medium text-gray-400 font-mono">UserID:</span>  <span className="text-gray-500 font-monospace">{user.USERID?.split("-")[4]}    </span></p>
              <p><span className="font-medium text-gray-400 font-mono">Email :</span>  <span className="text-gray-500 font-monospace">{user.LOGINID}                  </span></p>
              <p><span className="font-medium text-gray-400 font-mono">Phone :</span>  <span className="text-gray-500 font-monospace">{user.PHONE}                    </span></p>
              <p><span className="font-medium text-gray-400 font-mono">D.O.B :</span>  <span className="text-gray-500 font-monospace">{formatDate(user.DOB) || "-"}   </span></p>
              <p><span className="font-medium text-gray-400 font-mono">Gender:</span>  <span className="text-gray-500 font-monospace">{user.GENDER || "-"}            </span></p>
              <p><span className="font-medium text-gray-400 font-mono">Joined:</span>  <span className="text-gray-500 font-monospace">{formatDate(user.CREATED_ON)}   </span></p>
            </div>
            <div className="mt-3 mb-0">
              <button
                onClick={() => setEditing(true)}
                className="flex items-center border-none gap-1 px-3 py-1 text-sm bg-blue-900 text-white rounded transition hover:bg-blue-600">
                <Edit2 className="h-4 w-4 border-none" /> Edit
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-3 flex flex-col">
            <input
              type="text"
              name="FULLNAME"
              value={formData.FULLNAME}
              onChange={handleChange}
              className="w-75 px-3 py-1 border-none rounded bg-gray-600 text-gray-200 outline-none active:outline-none"
              placeholder="First Name + Last Name"
            />
            <input
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              placeholder="DOB"
              className="w-50 px-3 py-1 border-none rounded bg-gray-600 text-gray-200 outline-none active:outline-none"
            />
            <select
              name="GENDER"
              value={formData.GENDER}
              onChange={handleChange}
              className="w-25 px-3 py-1 border-none rounded bg-gray-600 text-gray-200 outline-none active:outline-none"
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="tel"
              name="PHONE"
              value={formData.PHONE}
              onChange={handleChange}
              className="w-50 px-3 py-1 border-none  rounded bg-gray-600 text-gray-200 outline-none active:outline-none"
              placeholder="Phone"
            />
            <div className="flex gap-4 mt-4 bg- w-50 ml-3">
              <button
                onClick={handleCancel}
                className="flex items-center border-none gap-1 px-2 py-1 text-sm text-red rounded transition bg-transparent "
              >
                <X className="h-4 w-4" />
              </button>

              <button
                onClick={handleSave}
                className="flex items-center border-none gap-1 px-2 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Check className="h-4 w-4" />Save
              </button>
              
            </div>
          </div>
        )}

        {showSavedPopup && (
          <div className="absolute bottom-3 right-3 bg-green-600 text-white px-3 py-2 rounded shadow">
            Saved successfully!
          </div>
        )}
      </div>


      {/* ---------- Mobile View ---------- */}
      <div className="md:hidden bg-gray-900 shadow-md rounded-xl p-4 pb-3 mb-3 relative">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <img
              src={avatar}
              alt="Avatar"
              className="w-14 h-14 rounded-full"
            />
            <h2 className="text-base font-bold text-gray-100 m-auto fs-7">
              Hi {user.FULLNAME?.split(" ")[0] || "User"} 👋
              {/* Hi <span className="font-italic">{user.FULLNAME?.split(" ")[0] || "User"}</span>👋 */}
            </h2>
          </div>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="p-1 bg-gray-900 text-light border-none rounded-full "
            >
              <Edit2 className="h-5 w-5 border-none" />
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="p-1 bg-gray-900 text-green border-none rounded-full"
              >
                <Check className="h-5 w-5 border-none" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 bg-gray-900 text-red border-none rounded-full "
              >
                <X className="h-5 w-5 border-none" />
              </button>
            </div>
          )}
        </div>

        {!editing ? (
          <div className=" flex flex-col text-gray-100 text-m space-y-2 p-2">
            {/* <span className="font-medium text-gray-400"><span>UserID:</span> {user.USERID?.split("-")[4]}</span> */}
            <span className="font-medium text-gray-400"><span>Email  :</span> {user.LOGINID}</span>
            <span className="font-medium text-gray-400"><span>Phone :</span> {user.PHONE}</span>
            <span className="font-medium text-gray-400"><span>DOB  :</span> {formatDate(user.DOB)}</span>
            <span className="font-medium text-gray-400"><span>Gender :</span> {user.GENDER || "-"}</span>
            <span className="font-medium text-gray-400"><span>Joined On :</span> {formatDate(user.CREATED_ON)}</span>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="text"
              name="FULLNAME"
              value={formData.FULLNAME}
              onChange={handleChange}
              className="w-full px-2 py-2 border-none rounded bg-gray-600 text-gray-100 text-sm"
              placeholder="Full Name"
            />
            <input
              type="date"
              name="DOB"
              value={formData.DOB}
              onChange={handleChange}
              className="w-full px-2 py-2 border-none rounded bg-gray-600 text-gray-100 text-sm"
            />
            <select
              name="GENDER"
              value={formData.GENDER}
              onChange={handleChange}
              className="w-full px-2 py-2 border-none rounded bg-gray-600 text-gray-100 text-sm"
            >
              <option value="">-- Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="tel"
              name="PHONE"
              value={formData.PHONE}
              onChange={handleChange}
              className="w-full px-2 border-none py-2 rounded bg-gray-600 text-gray-100 text-sm"
              placeholder="Phone"
            />
          </div>
        )}


        <AnimatePresence>
          {showSavedPopup && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute top--2 right--2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm flex flex-col gap-1"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-white animate-pulse" />
                <span>Saved successfully!</span>
              </div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: 0 }}
                transition={{ duration: 1, ease: "linear" }}
                className="h-1 bg-white/70 rounded"
              />
            </motion.div>
          )}
        </AnimatePresence>



      </div>
    </>
  );
};

export default UserInfoCard;
