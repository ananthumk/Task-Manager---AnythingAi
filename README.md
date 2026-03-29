# Task Manager App (Anything Ai - Task Manager)

A full-stack Task Management application built with React (frontend) and Node.js + Express + MongoDB (backend). Supports user authentication, role-based access control, and full CRUD for tasks and users.


## Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI Framework |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| Tailwind CSS | Styling |
| Lucide React | Icons |
| js-cookie | Cookie management |
| react-loader-spinner | Loading indicators |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web framework |
| MongoDB + Mongoose | Database & ODM |
| JSON Web Tokens (JWT) | Authentication |
| bcrypt | Password hashing |
| dotenv | Environment config |
| CORS | Cross-origin requests |

---

## Project Structure

```
root/
├── backend/
│   ├── controllers/
│   │   ├── adminController.js      # Get, delete users (admin only)
│   │   ├── authController.js       # Register, login
│   │   └── taskController.js       # CRUD for tasks
│   ├── db/
│   │   └── db.js                   # MongoDB connection
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT auth + role guard
│   ├── models/
│   │   ├── authModels.js           # User schema
│   │   └── taskModel.js            # Task schema
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js


|── frontend/
    ├── public/
    └── src/
        ├── assets/
        ├── components/
        │   ├── AddTask.jsx          # Modal to create a task
        │   ├── AddUser.jsx          # Modal to create a user (admin)
        │   ├── Card.jsx             # Task card with edit/delete
        │   ├── EditTask.jsx         # Modal to edit a task
        │   ├── Header.jsx           # Top nav with logout
        │   ├── ProtectedRoute.jsx   # Auth guard for routes
        │   └── UserTable.jsx        # Table of users with delete
        ├── context/
        │   └── AppContext.jsx       # Global state (token, backendUrl)
        ├── pages/
        │   ├── AdminDashboard.jsx   # Admin user management page
        │   ├── DashBoard.jsx        # User task management page
        │   ├── Login.jsx
        │   └── Register.jsx
        ├── App.jsx
        └── main.jsx
```



### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=4000
MONGODB_URL= mongodb_url (atlas)
JWT_SECRET=your_jwt_secret_key
TOKEN_EXPIRATION=7d
```

### Frontend — `frontend/.env`

```env
VITE_API_URL=http://localhost:4000 Or deployed backend "https://task-manager-anythingai.onrender.com"
```

---

## Backend API Reference

### Base URL
```
http://localhost:5000/api/v1
```

---

### Auth Routes — `/api/v1/auth`

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login and receive token | No |

#### POST `/auth/register`

```json
// Request Body
{
  "name": "Mahesh Babu",
  "email": "maheshbabu@example.com",
  "password": "secret123",
  "role": "user"
}

// Response 201
{
  "message": "User registered successfully!",
  "token": "<jwt_token>",
  "user": {
    "_id": "...",
    "name": "Mahesh Babu",
    "email": "maheshbabu@example.com",
    "role": "user"
  }
}
```

#### POST `/auth/login`

```json
// Request Body
{
  "email": "maheshbabu@example.com",
  "password": "secret123"
}

// Response 200
{
  "message": "User logged In successfully!",
  "token": "<jwt_token>",
  "user": {
    "_id": "e3rd5f",
    "name": "Mahesh Babu",
    "email": "maheshbabu@example.com",
    "role": "user"
  }
}
```

---

### Task Routes — `/api/v1/task`

> All routes require `Authorization: Bearer <token>` header.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create a new task |
| GET | `/` | Get all tasks (filterable) |
| GET | `/:id` | Get a single task |
| PATCH | `/:id` | Update a task |
| DELETE | `/:id` | Delete a task |

#### GET `/task` — Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search by title or description |
| `status` | string | `pending` / `in progress` / `completed` |
| `priority` | string | `low` / `medium` / `high` |
| `page` | number | Page number (default: 1) |

#### POST `/task`

```json
// Request Body
{
  "title": "Fix login bug",
  "description": "The login button is broken on mobile",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-12-31"
}

// Response 200
{
  "message": "Task created successfully"
}
```

#### PATCH `/task/:id`

```json
// Request Body (any fields to update)
{
  "status": "completed",
  "priority": "low"
}

// Response 200
{
  "message": "Task updated successfully",
  "updatedTask": { ... }
}
```

---

### Admin Routes — `/api/v1/admin`

> All routes require `Authorization: Bearer <token>` header and `admin` role.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all users (with search & pagination) |
| GET | `/:id` | Get user by ID |
| DELETE | `/:id` | Delete user by ID |

#### GET `/admin` — Query Parameters

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Search users by name |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10) |

```json
// Response 200
{
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "users": [ ... ]
}
```

---

## Frontend Overview

### Pages

| Page | Route | Access |
|------|-------|--------|
| Login | `/login` | Public |
| Register | `/register` | Public |
| Dashboard | `/` | Protected (any logged-in user) |
| Admin Dashboard | `/admin` | Protected (admin only) |

### Key Components

| Component | Description |
|-----------|-------------|
| `ProtectedRoute` | Redirects to `/login` if no token found in context or cookies |
| `Header` | Top navigation bar with logout — clears cookie and redirects to login |
| `Card` | Displays a task with edit (pencil) and delete (trash) actions |
| `AddTask` | Modal form to create a new task |
| `EditTask` | Modal form pre-filled with existing task data for editing |
| `AddUser` | Modal form for admins to register new users |
| `UserTable` | Table listing all users with a delete action per row |

### Global State — `AppContext`

```js
// Available everywhere via useContext(AppContext)
{
  backendUrl,    // API base URL from VITE_API_URL
  token,         // JWT token stored in state
  updateToken    // Function to set or clear token + cookie
}
```

---

**Role-based redirect after login/register:**
- `role: 'user'` → redirected to `/`
- `role: 'admin'` → redirected to `/admin`

---

## Data Models

### User

| Field | Type | Constraints |
|-------|------|-------------|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, `select: false` |
| `role` | String | `user` or `admin`, default: `user` |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |


### Task

| Field | Type | Constraints |
|-------|------|-------------|
| `title` | String | Required, trimmed |
| `description` | String | Optional, trimmed |
| `status` | String | `pending`, `in progress`, `completed` |
| `priority` | String | `low`, `medium`, `high` |
| `dueDate` | Date | Required, must not be in the past |
| `userId` | ObjectId | References `User`, required |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

---

## Error Responses

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad request / validation error (e.g. past due date) |
| 401 | Unauthorized — missing or invalid/expired token |
| 403 | Forbidden — user does not have the required role |
| 404 | Resource not found |
| 409 | Conflict — email already registered |
| 500 | Internal server error |

