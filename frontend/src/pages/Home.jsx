import React from "react";
import { useSelector } from "react-redux";
import AdminDashBoard from "../components/AdminDashBoard";
import ManagerDashboard from "../components/ManagerDashboard";
import UserDashboard from "../components/UserDashboard";

function Home() {
  const { userData } = useSelector((state) => state.user);

  return (
    <div className="w-[100vw] min-h-[100vh] pt-[10px] flex flex-col items-center bg-gray-50">
      {userData?.role === "admin" && <AdminDashBoard />}
      {userData?.role === "manager" && <ManagerDashboard />}
      {userData?.role === "user" && <UserDashboard />}
    </div>
  );
}

export default Home;
