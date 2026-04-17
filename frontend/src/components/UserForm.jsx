import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const UserForm = () => {
  const { userData: user } = useSelector((state) => state.user);

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
            text: "Old password is required",
          });
        }

        updateData.password = password;
        updateData.oldPassword = oldPassword;
      }

      const result = await axios.put(
        `${serverUrl}/api/user/edit-username-password`,
        updateData,
        { withCredentials: true },
      );

      setMessage({
        type: "success",
        text: result.data.message || "Profile updated successfully",
      });

     
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
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            My Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your personal profile settings and security.
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div
            className={`p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Card */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Profile Information
            </h3>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              Role: {user?.role}
            </span>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="shadow-sm block w-full border rounded-md p-2 mt-1"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-gray-100 w-full border rounded-md p-2 mt-1 text-gray-500"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Account Status
                  </label>
                  <input
                    type="text"
                    value={user?.status || ""}
                    disabled
                    className="bg-gray-100 w-full border rounded-md p-2 mt-1 text-gray-500"
                  />
                </div>

                {/* New Password */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current password"
                      className="w-full border rounded-md p-2 pr-10"
                    />

                    <div
                      className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>

                {/* Old Password */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Old Password
                  </label>

                  <div className="relative mt-1">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Required to change password"
                      className="w-full border rounded-md p-2 pr-10"
                    />

                    <div
                      className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="pt-5 border-t flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
