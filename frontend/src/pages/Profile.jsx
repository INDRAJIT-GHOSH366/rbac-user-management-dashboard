import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";

const Profile = () => {
  const { userData: user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });


  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const updateData = {};

      if (fullName) {
        updateData.fullName = fullName;
      }

      if (password) {
        if (!oldPassword) {
          return setMessage({
            type: "error",
            text: "Old password is required to change password",
          });
        }

        updateData.password = password;
        updateData.oldPassword = oldPassword;
      }

      const result = await axios.put(
        `${serverUrl}/api/user/edit-username-password`,
        updateData,
        { withCredentials: true }
      );

      setMessage({ type: "success", text: result.data.message });

      setPassword("");
      setOldPassword("");

    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Update failed",
      });
    }
  };

  if (!user) {
    return <p className="text-center mt-10">Loading user...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Back Button */}
        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className="text-blue-500" />
          </div>
          <h1 className="text-xl font-bold">Back to Home</h1>
        </div>

        {/* Header */}
        <div>
         
          <p className="text-gray-600">Manage your profile settings</p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`p-3 rounded ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Card */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="font-semibold mb-4">
            Role: {user?.role}
          </h3>

          <form onSubmit={handleUpdateProfile} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-2 border rounded mt-1 bg-gray-100"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium">Status</label>
              <input
                type="text"
                value={user?.status || ""}
                disabled
                className="w-full p-2 border rounded mt-1 bg-gray-100"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium">New Password</label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded mt-1 pr-10"
                  placeholder="Leave blank to keep current password"
                />

                <div
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Old Password */}
            <div>
              <label className="block text-sm font-medium">Old Password</label>

              <div className="relative mt-1">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full p-2 border rounded mt-1 pr-10"
                  placeholder="Required to change password"
                />

                <div
                  className="absolute right-3 top-3 cursor-pointer text-gray-500"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
