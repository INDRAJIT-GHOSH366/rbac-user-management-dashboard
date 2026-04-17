import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";

const AddUser = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    try {
      const res = await axios.post(
        `${serverUrl}/api/user/create`,
        { fullName, email, password, role },
        { withCredentials: true }
      );

      setMessage({ type: "success", text: res.data.message });

      // reset form
      setFullName("");
      setEmail("");
      setPassword("");
      setRole("user");

    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to create user",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Back */}
        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className="text-blue-500" />
          </div>
          <h1 className="text-xl font-bold">Back</h1>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Add New User</h1>
          <p className="text-gray-600">Create new user or manager</p>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message.text}
          </div>
        )}

        {/* Card */}
        <div className="bg-white shadow rounded-lg p-6">

          <form onSubmit={handleAddUser} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded mt-1"
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium">Password</label>

              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded mt-1 pr-10"
                  required
                />

                <div
                  className="absolute right-3 top-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            {/* Submit */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              Create User
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddUser;