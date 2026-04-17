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

function SignUp() {
  const primaryColor = "#2da0ff";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handaleSignUp = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          fullName,
          email,
          password,
          role :"user",
        },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
      setErr("");
      setLoading(false);
      console.log(result);
    } catch (error) {
      setLoading(false);
      console.log("Backend error message:", error.response?.data);
      setErr(error.response.data.message);
    }
  };
  const handaleGoogleAuth = async () => {
    setErr("");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result);
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google-auth`,
        {
          fullName: result.user.displayName,
          email: result.user.email,
          role,
        },
        { withCredentials: true }
      );
      dispatch(setUserData(data));
      setErr("");
      console.log(data);
    } catch (error) {
      console.log(error);
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
          Create your account 
        </p>
        {/* fullName */}
        <div className={`mb-4`}>
          <label
            htmlFor="fullName"
            className=" block text-gray-700 font-medium mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 border-[#ddd]`}
            placeholder="Enter your full name"
            required
          />
        </div>

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
        {/* role */}
        {/* <div className={`mb-4`}>
          <label
            htmlFor="role"
            className=" block text-gray-700 font-medium mb-1"
          >
            Role
          </label>
          <div className="flex items-center justify-center gap-2">
            {["user", "admin", "manager"].map((r) => (
              <button
                key={r}
                className=" flex flex-1 items-center justify-center border rounded-lg px-3 py-2 text-center font-medium text-sm
              transition-colors cursor-pointer uppercase"
                onClick={() => setRole(r)}
                style={
                  role == r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div> */}
        <button
          className={`w-full mt-4 font-semibold rounded-lg py-2 transition duration-200 cursor-pointer text-white bg-[#2da0ff] hover:bg-[#2377e6]`}
          onClick={handaleSignUp}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#ffffff" /> : "Sign Up"}
        </button>
        {err && <p className="text-blue-500 text-center my-2">*{err}</p>}

        <button
          className={`flex items-center justify-center gap-2 w-full mt-4  border rounded-lg px-4 py-2 transation duration-200 hover:bg-gray-200 border-gray-400 cursor-pointer`}
          onClick={handaleGoogleAuth}
        >
          <FcGoogle className={`text-2xl`} />
          <span>Sign Up with Google</span>
        </button>
        <p className="text-center mt-2 ">
          Already have an account ?{" "}
          <span
            className="text-[#2da0ff] cursor-pointer"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
