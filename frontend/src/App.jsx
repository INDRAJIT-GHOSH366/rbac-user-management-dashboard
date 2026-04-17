import React from "react";
import { useSelector } from "react-redux";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { Routes, Route, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/Signin";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import AddUser from "./pages/AddUser";
import { Toaster } from "react-hot-toast";

export const serverUrl = "https://rbac-user-management-backend.onrender.com";

function App() {
  useGetCurrentUser();
  const { userData } = useSelector((state) => state.user);

  return (
    <>
      {/* 🔥 FINAL TOASTER FIX */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            zIndex: 999999,
          },
        }}
      />

      <Routes>
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to="/signin" />}
        />
        <Route
          path="/signup"
          element={!userData ? <SignUp /> : <Navigate to="/" />}
        />
        <Route
          path="/signin"
          element={!userData ? <SignIn /> : <Navigate to="/" />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to="/" />}
        />
        <Route
          path="/my-profile"
          element={userData ? <Profile /> : <Navigate to="/signin" />}
        />
        <Route
          path="/add-user"
          element={
            userData?.role === "admin" ? <AddUser /> : <Navigate to="/" />
          }
        />
      </Routes>
    </>
  );
}

export default App;
