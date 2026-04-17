import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App.jsx";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebase.js";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function SignIn() {
  const primaryColor = "#2da0ff";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handaleSignIn = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
      
    } catch (error) {
      
      setErr(error.response.data.message);
      setLoading(false);
    }
  };
  const handaleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
    
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          email: result.user.email,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      setErr("");
     
    } catch (error) {
      
      setErr(error.response.data.message);
    }
  };
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-[#ddd]`}
      >
        <h1 className={`text-3xl font-bold mb-2 text-[#2da0ff]`}></h1>
        <p className={`text-gray-600 mb-8 `}>
          Sign in to your account 
        </p>
        {/* email */}
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
          />
        </div>

        {/* password */}
        <div className={`mb-4`}>
          <label
            htmlFor="password"
            className=" block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={!showPassword ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 border-[#ddd]`}
              placeholder="Enter your Password"
              required
            />
            <button
              className=" absolute right-3 top-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {!showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
            </button>
          </div>
        </div>
        {/* forgot Password */}
        <div
          className="text-right mb-2 text-[#2da0ff] cursor-pointer font-medium"
          onClick={() => navigate("/forgot-password")}
        >
          <p>Forgot Password</p>
        </div>
        <button
          className={`w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white bg-[#2da0ff] hover:bg-[#2377e6]`}
          onClick={handaleSignIn}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Sign In"}
        </button>
        {err && <p className="text-blue-500 text-center my-2">*{err}</p>}

        <button
          className={`flex items-center justify-center gap-2 w-full mt-4  border rounded-lg px-4 py-2 transation duration-200 hover:bg-gray-200 border-gray-400 cursor-pointer`}
          onClick={handaleGoogleAuth}
        >
          <FcGoogle className={`text-2xl`} />
          <span>Sign In with Google</span>
        </button>
        <p className="text-center mt-2 ">
          Want to create a new account ?{" "}
          <span
            className="text-[#2da0ff] cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignIn;
