import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { CiTrash } from "react-icons/ci";
import axios from "axios";
import { serverUrl } from "../App";
import { setUser, setManager } from "../redux/userSlice";
import useGetUsers from "../hooks/useGetUsers";
import useGetManagers from "../hooks/useGetManager";
import toast from "react-hot-toast";

function UserCard() {
  const { user, manager, userData, search, totalPages, loading } = useSelector(
    (state) => state.user,
  );

  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  useGetUsers(page, search);
  useGetManagers(page, search);

  const isAdmin = userData?.role === "admin";

  //  Reset page on search
  useEffect(() => {
    setPage(1);
  }, [search]);

  //  DELETE USER
  const deleteUser = async (id) => {
    try {
      toast.loading("Deleting user...");

      await axios.delete(`${serverUrl}/api/user/delete/${id}`, {
        withCredentials: true,
      });

      toast.dismiss();
      toast.success("User deleted");

      const updatedUsers = user.filter((u) => u._id !== id);
      const updatedManagers = manager.filter((m) => m._id !== id);

      dispatch(setUser(updatedUsers));
      dispatch(setManager(updatedManagers));
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Delete failed");
    }
  };

  //  CHANGE ROLE
  const changeRole = async (id, newRole) => {
    try {
      toast.loading("Updating role...");

      await axios.put(
        `${serverUrl}/api/user/change-role/${id}`,
        { role: newRole },
        { withCredentials: true },
      );

      toast.dismiss();
      toast.success("Role updated");

      let updatedUsers = [...user];
      let updatedManagers = [...manager];

      let changedUser =
        updatedUsers.find((u) => u._id === id) ||
        updatedManagers.find((u) => u._id === id);

      if (!changedUser) return;

      changedUser = {
        ...changedUser,
        role: newRole,
        updatedBy: {
          _id: userData._id,
          fullName: userData.fullName,
          email: userData.email,
        },
      };

      updatedUsers = updatedUsers.filter((u) => u._id !== id);
      updatedManagers = updatedManagers.filter((u) => u._id !== id);

      if (newRole === "manager") {
        updatedManagers.push(changedUser);
      } else if (newRole === "user") {
        updatedUsers.push(changedUser);
      }

      dispatch(setUser(updatedUsers));
      dispatch(setManager(updatedManagers));
    } catch (error) {
      console.error(error);
      toast.dismiss();
      toast.error("Role update failed");
    }
  };

  return (
    <div className="p-5 w-[90%]">
      {/* 🔥 LOADING */}
      {loading && (
        <div className="text-center py-4">
          <span className="text-blue-500 font-medium">Loading users...</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-5 shadow-md border border-blue-100">
        {/* USERS */}
        <h1 className="text-lg font-bold mb-4">Available Users</h1>

        <div className="space-y-4">
          {!loading && user?.length === 0 ? (
            <p className="text-center text-gray-400">
              No users found {search && `for "${search}"`}
            </p>
          ) : (
            user.map((a) => (
              <div
                key={a._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-semibold">{a.fullName}</p>
                  <p className="text-sm text-cyan-600">{a.email}</p>
                  <p className="text-sm">Created By: {a.createdBy?.fullName}</p>
                  <p className="text-sm">Updated By: {a.updatedBy?.fullName}</p>
                  <p className="text-sm">Created At: {new Date(a.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={a.role}
                    disabled={!isAdmin}
                    onChange={(e) => changeRole(a._id, e.target.value)}
                    className="rounded-md border px-3 py-1 text-sm border-[#2da0ff]"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>

                  {isAdmin && (
                    <button
                      onClick={() => deleteUser(a._id)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                    >
                      <CiTrash size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* MANAGERS */}
        <h1 className="text-lg font-bold mt-6 mb-4">Available Managers</h1>

        <div className="space-y-4">
          {manager?.length > 0 ? (
            manager.map((a) => (
              <div
                key={a._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="text-sm font-semibold">{a.fullName}</p>
                  <p className="text-sm text-cyan-600">{a.email}</p>
                  <p>Created By: {a.createdBy?.fullName}</p>
                  <p>Updated By: {a.updatedBy?.fullName}</p>
                  <p>Created At: {new Date(a.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={a.role}
                    disabled={!isAdmin}
                    onChange={(e) => changeRole(a._id, e.target.value)}
                    className="rounded-md border px-3 py-1 text-sm border-[#2da0ff]"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>

                  {isAdmin && (
                    <button
                      onClick={() => deleteUser(a._id)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                    >
                      <CiTrash size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-sm">No managers found</p>
          )}
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
        >
          Prev
        </button>

        <span className="px-4 py-2 font-semibold">{page}</span>

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-200 rounded cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UserCard;
