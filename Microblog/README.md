# Microblog

A full-stack social media platform currently in active development, built to practice authentication, security, and scalable React architecture.

## Features
- User registration and login with JWT-based authentication (access + refresh tokens)
- Secure password hashing with bcrypt
- Custom middleware for request authorization and cookie handling
- Global auth state management via React Context API and custom hooks
- Silent token refresh on app load for persistent sessions
- Post feed, direct messages, notifications, and search (in progress)
- Modular project structure (Components, Context, Hooks, Layout, Pages)
- CSS Modules for scoped, conflict-free styling

## Tech Stack
**Frontend:** React, React Router, CSS Modules
**Backend:** Node.js, Express.js
**Database:** PostgreSQL
**Auth:** JWT, bcrypt, httpOnly cookies

## Prerequisites
- [Node.js](https://nodejs.org/) — v18 or higher recommended
- [PostgreSQL](https://www.postgresql.org/download/) 
- [Git](https://git-scm.com/) 

## How to Run

1. Clone the repository
```bash
   git clone https://github.com/Necipher/React.git
   cd React/Microblog
```

2. Set up the database
   Create a PostgreSQL database, then run the included schema against it:
```bash
   psql -U your_username -d your_database_name -f backend/schema.sql
```

3. Set up the backend environment variables
   Create a `.env` file inside the `backend` folder with the following:
```dotenv
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
   PORT=5004
   JWT_SECRET=your_access_token_secret
   JWT_EXPIRES=your_access_token_expiry_time
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRES=your_refresh_token_expiry_time
```

4. Install and start the backend
```bash
   cd backend
   npm install
   node server.js
```
   The server will run on `http://localhost:5004`

5. In a new terminal, install and start the frontend
```bash
   cd app
   npm install
   npm run dev
```

6. Open your browser at `http://localhost:3000`
