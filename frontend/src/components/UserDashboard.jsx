import React from "react";
import Nav from "./Nav";
import UserCard from "./UserCard";
import UserFrom from "./UserForm";

function UserDashboard() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-5 items-center bg-gray-50 overflow-y-auto">
      <Nav />
      <UserFrom />
    </div>
  );
}

export default UserDashboard;
