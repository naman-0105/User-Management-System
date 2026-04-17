# User Management System

A full-stack user management platform with role-based access control, JWT authentication, user lifecycle management, and a modern dashboard UI.

## Live Demo

Access the deployed application and API below:

- **Frontend App:** https://user-management-system-ruby-six.vercel.app
- **Backend API Base URL:** https://user-management-system-ik9f.onrender.com
- **API Documentation (Swagger):** https://user-management-system-ik9f.onrender.com/api-docs

## Demo Video
Full walkthrough of the User Management System

[![Watch Demo](https://img.youtube.com/vi/a7Tr6x3C2Ks/0.jpg)](https://youtu.be/a7Tr6x3C2Ks)

## Test Credentials

Use the following accounts to test different roles. These accounts are pre-seeded to demonstrate role-based access control (RBAC).

### Admin 
- Email: admin@example.com  
- Password: Admin@123  

### Manager
- Email: manager@example.com  
- Password: Manager@123  

### User
- Email: user@example.com  
- Password: User@123

**Admin:** Full access (create, update, deactivate/activate users, assign roles)  
**Manager:** View and update non-admin users  
**User:** Manage own profile only

## Features

- JWT-based authentication with access/refresh token flow
- Role-aware authorization (`ADMIN`, `MANAGER`, `USER`)
- User management module with create, list, view, update, and deactivate operations
- Profile management for authenticated users
- Modern React dashboard with responsive layout and dark/light mode
- Filterable user table with pagination, search, and status handling
- OpenAPI 3.0 documentation via Swagger UI at `/api-docs`

## Tech Stack

### Frontend (`client`)
- React 19 + Vite
- React Router
- Tailwind CSS v4
- React Hook Form + Zod
- Axios
- Lucide React icons
- React Hot Toast

### Backend (`server`)
- Node.js + Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- Joi validation
- `bcryptjs` for password hashing
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)

## Project Structure

```text
User-Management-System/
├─ client/
│  ├─ src/
│  │  ├─ api/                # API clients (axios instance, auth/user APIs)
│  │  ├─ components/         # Layout, common, and reusable UI components
│  │  ├─ context/            # Auth + theme context providers
│  │  ├─ hooks/              # Custom hooks (auth, debounce, theme)
│  │  ├─ pages/              # Auth, dashboard, users, profile pages
│  │  ├─ routes/             # Protected and role-based route guards
│  │  └─ utils/              # Helpers (storage, className utility)
│  └─ package.json
├─ server/
│  ├─ src/
│  │  ├─ config/             # Swagger configuration
│  │  ├─ constants/          # Role/status constants
│  │  ├─ controllers/        # Route handlers
│  │  ├─ middlewares/        # Auth, validation, role, error middlewares
│  │  ├─ models/             # Mongoose models
│  │  ├─ routes/             # Auth and user route modules
│  │  ├─ services/           # Business logic layer
│  │  ├─ utils/              # API response/error/token helpers
│  │  ├─ app.js              # Express app setup
│  │  └─ server.js           # Entry point + DB connection
│  └─ package.json
└─ README.md
```

## Installation & Setup

### 1) Clone and enter project

```bash
git clone <your-repo-url>
cd User-Management-System
```

### 2) Install dependencies

```bash
cd server && npm install
cd ../client && npm install
```

### 3) Configure environment variables

Create environment files:

- `server/.env`
- `client/.env`

Use the variable list from the next section.

### 4) Run backend

```bash
cd server
npm run dev
```

Backend default URL: `http://localhost:5000`

### 5) Run frontend (new terminal)

```bash
cd client
npm run dev
```

Frontend default URL (Vite): `http://localhost:5173`

### 6) Build for production

Frontend:

```bash
cd client
npm run build
```

Backend:

```bash
cd server
npm start
```

## Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```
For production, set VITE_API_URL to the deployed backend URL.

## API Endpoints

Base URL: `http://localhost:5000/api`

### Auth
- `POST /auth/register` - Register a new account
- `POST /auth/login` - Login and receive tokens
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users` - List users (with filters/pagination)
- `POST /users` - Create user (admin)
- `GET /users/:id` - Get user details
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Deactivate user
- `GET /users/me` - Get current profile
- `PUT /users/me` - Update current profile

### API Docs
- Swagger UI: `http://localhost:5000/api-docs`

