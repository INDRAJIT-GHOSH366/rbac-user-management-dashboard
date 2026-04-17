import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { ClipLoader } from "react-spinners";
function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },

        { withCredentials: true }
      );
      setLoading(false);
      setErr("");
     
      setStep(2);
    } catch (error) {
      setLoading(false);
      
      setErr(error.response.data.message);
    }
  };
  const handleVerifyOtp = async () => {
    setLoading(true);
    setErr("");
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      setLoading(false);
      setErr("");
      
      setStep(3);
    } catch (error) {
      setErr(error.response.data.message);
      
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    setErr("");

    if (newPassword !== confirmPassword) {
      setErr("Passwords do not match");

      return;
    }
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      setLoading(false);
      setErr("");
      
      navigate("/signin");
    } catch (error) {
      setLoading(false);
      setErr(error.response.data.message);
      
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#fff9f6]">
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#ddd]`}
      >
        {/* this is for go back and forgot password.. */}
        <div className="flex items-center gap-2 mb-4">
          <IoIosArrowRoundBack
            className="text-[#2da0ff] text-4xl cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-[#2da0ff]">
            Forgot Password
          </h1>
        </div>
        {/* email */}
        {step === 1 && (
          <div>
            <div className={`mb-4`}>
              <label
                htmlFor="email"
                className=" block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 border-[#ddd]`}
                placeholder="Enter your Email"
                required
                onKeyDown={(event) => {
                  // Check if the key pressed is 'Enter' or has a key code of 13
                  if (event.key === "Enter") {
                    handleSendOtp();
                  }
                }}
              />
            </div>
            {/* otp button */}
            <button
              className={`w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white bg-[#2da0ff] hover:bg-[#2367e6]`}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Send OTP"}
            </button>
            {err && <p className="text-blue-500 text-center my-2">*{err}</p>}
          </div>
        )}
        {step === 2 && (
          <div>
            <div className={`mb-4`}>
              <label
                htmlFor="email"
                className=" block text-gray-700 font-medium mb-1"
              >
                OTP
              </label>
              <input
                type="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 border-[#ddd]`}
                placeholder="Enter your OTP"
                required
              />
            </div>
            {/* otp button */}
            <button
              className={`w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white bg-[#2da0ff] hover:bg-[#2367e6]`}
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Verify"}
            </button>
            {err && <p className="text-blue-500 text-center my-2">*{err}</p>}
          </div>
        )}
        {step === 3 && (
          <div>
            <div className={`mb-4`}>
              <label
                htmlFor="new-password"
                className=" block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 border-[#ddd]`}
                placeholder="Enter new Password"
                required
              />
            </div>
            <div className={`mb-4`}>
              <label
                htmlFor="confirm-password"
                className=" block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 border-[#ddd]`}
                placeholder="Confirm Password"
                required
              />
            </div>
            {/* otp button */}
            <button
              className={`w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white bg-[#2da0ff] hover:bg-[#2361e6]`}
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading ? (
                <ClipLoader size={20} color="#ffffff" />
              ) : (
                "Reset Password"
              )}
            </button>
            {err && <p className="text-red-500 text-center my-2">*{err}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
