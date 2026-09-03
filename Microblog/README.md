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
