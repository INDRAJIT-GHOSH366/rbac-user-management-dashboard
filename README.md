# RBAC User Management Dashboard

##  Project Overview

A Role-Based Access Control (RBAC) system where:

* Admin can manage users and managers
* Managers can manage users
* Users have limited access

##  Tech Stack

* Frontend: React (Vite)
* Backend: Node.js, Express
* Database: MongoDB
* Authentication: JWT
* State Management: Redux

##  Features

* User authentication (Login/Signup)
* Role-based dashboards (Admin, Manager, User)
* CRUD operations on users
* Secure API with middleware

##  Installation

### Backend

```bash
cd backend
npm install
npm start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

##  Environment Variables

Create `.env` file in backend:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Create `.env` in frontend:

```
VITE_FIREBASE_API_KEY=your_key
```

##  Future Improvements

* Role-based Firebase rules
* Deployment (Render + Vercel)
* UI improvements

##  Author

Indrajit Ghosh
