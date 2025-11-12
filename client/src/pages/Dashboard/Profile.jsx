import React, { useState, useEffect } from "react";
import UserInfoCard from "../../components/ProfileComp/UserInfoCard";
import DangerZone from "../../components/ProfileComp/DangerZone";
import DeleteAccountModal from "../../components/ProfileComp/DeleteAccountModal";
import LoaderOverlay from "../../components/ProfileComp/LoaderOverlay";
import SuccessPopup from "../../components/ProfileComp/SuccessPopup";
import ChangePassword from "../../components/ProfileComp/ChangePassword";

// 🔹 Dummy Data (Testing Purpose)
const dummyUser = {
  USERID: "7AF258BB-E10F-472E-BADB-37AC74FA4D8A",
  LOGINID: "birukathayt3@gmail.com",
  PASSWORD: "Oldmonk@123",
  FULLNAME: "Birendra Singh",
  PHONE: "9594311370",
  ISACTIVE: 1,
  CREATED_ON: "2025-09-27 10:36:29.673",
  UPDATED_ON: "2025-10-15 14:13:49.737",
  SALARY_DATE: null,
  DOB: "2000-10-17",
  GENDER: "Male",
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);

  // 🔹 Toggle between LIVE API and DUMMY mode
  const useDummy = true; // 👉 isko false karo to live API chalega

  // 🔹 Fetch User Profile
  useEffect(() => {
    const fetchProfile = async () => {
      if (useDummy) {
        // Dummy mode
        setUser(dummyUser);
      } else {
        // Live API mode
        try {
          const token = localStorage.getItem("token");
          const res = await fetch("http://localhost:5002/api/user/profile", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();
          if (data.success) {
            setUser(data.user);
          } else {
            alert(data.message || "Failed to load profile");
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };

    fetchProfile();
  }, [useDummy]);

  // 🔹 Update User Info
  const handleUpdate = async (updatedUser) => {
    if (useDummy) {
      // Direct update dummy
      setUser((prev) => ({ ...prev, ...updatedUser }));
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5002/api/user/update-profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      });

      const data = await res.json();
      if (data.success) {
        setUser((prev) => ({ ...prev, ...updatedUser }));
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Something went wrong");
    }
  };

  // 🔹 Handle Account Deletion
  const handleDeleteConfirm = async (password) => {
    if (useDummy) {
      console.log("Dummy delete called with password:", password);
      setSuccessPopup(true);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5002/api/user/deactivate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password, confirmDelete: true }),
      });

      const data = await res.json();

      setTimeout(() => {
        setLoading(false);
        if (data.success) {
          setSuccessPopup(true);
          setTimeout(() => {
            window.location.href = "/";
          }, 5000);
        } else {
          alert(data.message);
        }
      }, 5000);
    } catch (err) {
      console.error("API error:", err);
      setLoading(false);
      alert("Something went wrong");
    } finally {
      setIsModalOpen(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center bg-dark text-gray-900 py-10">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-5xl bg--100 md:bg--100 sm:p-6 lg:p-4 lg:py-2 relative space-y-1 md:w-3/5 ">
      {/* User Info Card */}
      <UserInfoCard user={user} onUpdate={handleUpdate} />

      <ChangePassword />

      {/* Danger Zone */}
      <DangerZone onDeleteClick={() => setIsModalOpen(true)} />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* Loader Overlay */}
      {loading && <LoaderOverlay message="Deleting your account..." />}

      {/* Success Popup */}
      {successPopup && (
        <SuccessPopup message="Account Deleted. Redirecting..." />
      )}
    </div>
  );
};

export default Profile;
