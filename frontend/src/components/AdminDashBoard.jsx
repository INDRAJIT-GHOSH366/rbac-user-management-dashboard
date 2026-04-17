import React from 'react'
import Nav from './Nav'
import UserCard from './UserCard'
import useGetUsers from '../hooks/useGetUsers';
import useGetManagers from '../hooks/useGetManager';

function AdminDashboard() {
   useGetUsers();
  useGetManagers();
  return (
         <div className="w-screen min-h-screen flex flex-col gap-5 items-center bg-gray-50 overflow-y-auto">
        <Nav/>
        <UserCard/>
    </div>
  )
}

export default AdminDashboard