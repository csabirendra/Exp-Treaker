// src/components/Sidebar/AvatarPicker.jsx


import React from "react";

const avatars = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
];

const AvatarPicker = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          className={`h-14 w-14 rounded-full cursor-pointer border-2 ${
            selected === avatar ? "border-blue-500" : "border-transparent"
          }`}
          onClick={() => onSelect(avatar)}
        />
      ))}
    </div>
  );
};

export default AvatarPicker;
