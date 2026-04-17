# RBAC User Management System (MERN)

A full-stack User Management System built with the MERN stack implementing Role-Based Access Control (RBAC), authentication, and user lifecycle management.

---

## Project Overview

This application allows managing users with different roles:

- Admin (full access)
- Manager (limited access)
- User (self-management only)

It includes secure authentication, role-based authorization, and audit tracking.

---

##  Features

### Authentication
- JWT-based login system
- Password hashing using bcrypt
- Secure cookie-based session handling

### Authorization (RBAC)
- Admin:
  - Create users
  - Change roles
  - Delete users
- Manager:
  - View users
- User:
  - Update own profile only

### User Management
- View users (paginated & searchable)
- Create new users
- Update user details
- Delete users
- Profile update (name & password)

### Audit Tracking
- createdAt / updatedAt
- createdBy / updatedBy

---

##  Tech Stack

- Frontend: React, Redux Toolkit, Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Authentication: JWT + Cookies

---

##  Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/rbac-user-management-dashboard.git

2. Backend Setup
cd backend
npm install


Create .env file:

MONGODB_URL=your_mongodb_url
JWT_SECRET=your_secret

3. Frontend Setup
cd frontend
npm install
npm run dev
