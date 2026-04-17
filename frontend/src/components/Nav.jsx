import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserData, setSearch } from "../redux/userSlice";
import { serverUrl } from "../App";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";

function Nav() {
  const { userData, search } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const canSearch =
    userData?.role === "admin" || userData?.role === "manager";

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      navigate("/signin");
    } catch (error) {
      console.log("Error during signout:", error);
    }
  };

  if (!userData) return null;

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 z-[9999] bg-gray-50 relative">

      {/*  Mobile Search */}
      {canSearch && showSearch && (
        <div className="w-[90%] h-[70px] fixed top-[80px] left-[5%] bg-white shadow-xl rounded-lg items-center gap-[20px] md:hidden flex">
          <IoIosSearch size={25} className="text-[#2da0ff]" />
          <input
            type="text"
            placeholder="search..."
            className="outline-none px-[10px] w-full"
            onChange={(e) => dispatch(setSearch(e.target.value))}
            value={search}
          />
        </div>
      )}

      {/* Title */}
      <h1
        className="text-3xl font-bold text-[#2da0ff] cursor-pointer"
        onClick={() => navigate("/")}
      >
        {userData.role === "admin"
          ? "Admin Dashboard"
          : userData.role === "user"
          ? "User Dashboard"
          : "Manager Dashboard"}
      </h1>

      {/*  Desktop Search */}
      {canSearch && (
        <div className="md:w-[60%] lg:w-[40%] h-[70px] bg-white shadow-xl rounded-lg items-center gap-[20px] hidden sm:flex">
          <div className="flex m-2 items-center gap-1 w-full">
            <IoIosSearch size={25} className="text-[#2da0ff]" />
            <input
              type="text"
              placeholder="search users..."
              className="outline-none px-[10px] w-full"
              onChange={(e) => dispatch(setSearch(e.target.value))}
              value={search}
            />

            {/* ❌ Clear */}
            {search && (
              <RxCross2
                size={20}
                className="cursor-pointer text-gray-500"
                onClick={() => dispatch(setSearch(""))}
              />
            )}
          </div>
        </div>
      )}

      {/*  Mobile Toggle */}
      {canSearch && (
        <div>
          {showSearch ? (
            <RxCross2
              size={25}
              className="text-[#2da0ff] ml-2"
              onClick={() => {
                setShowSearch(false);
                dispatch(setSearch(""));
              }}
            />
          ) : (
            <IoIosSearch
              size={25}
              className="text-[#2da0ff] md:hidden"
              onClick={() => setShowSearch(true)}
            />
          )}
        </div>
      )}

     
      <div className="relative">
        {/* Profile Icon */}
        <div
          className="bg-[#2dbcff] rounded-full w-10 h-10 flex items-center justify-center text-black text-lg shadow-lg font-semibold cursor-pointer"
          onClick={() => setShowInfo(!showInfo)}
        >
          {userData?.fullName?.[0]?.toUpperCase()}
        </div>

        {/* Dropdown */}
        {showInfo && (
          <div className="absolute right-0 top-[50px] bg-white w-[180px] shadow-lg rounded-lg p-[20px] flex flex-col gap-[10px]">
            <div className="font-semibold">{userData.fullName}</div>

            <div
              className="text-[#2da0ff] cursor-pointer"
              onClick={() => navigate("/my-profile")}
            >
              My Profile
            </div>

            {userData?.role === "admin" && (
              <div
                className="text-[#2da0ff] cursor-pointer"
                onClick={() => navigate("/add-user")}
              >
                Add new user
              </div>
            )}

            <div
              className="text-[#2da0ff] cursor-pointer"
              onClick={handleLogout}
            >
              Log Out
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Nav;