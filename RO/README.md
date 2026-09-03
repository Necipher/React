# Recipe Organizer

A full-stack recipe management application with a custom fuzzy-search engine, built to practice React Router, API design, and algorithm implementation.

## Features
- Browse, search, and filter a large recipe library
- Custom fuzzy-search algorithm (Levenshtein distance) for searching recipes by name or ingredient
- Add, edit, and delete personal recipes (full CRUD)
- Mark recipes as favorites
- Server-side pagination for efficient handling of large datasets
- Client-side routing with nested routes, loaders, and outlet context

## Tech Stack
**Frontend:** React, React Router
**Backend:** Node.js, Express.js
**Data:** JSON-based local storage

## Prerequisites
- [Node.js](https://nodejs.org/) — v18 or higher recommended
- [Git](https://git-scm.com/) 

## How to Run

1. Clone the repository
```bash
   git clone https://github.com/Necipher/React.git
   cd React/RO
```

2. Install and start the backend
```bash
   cd backend
   npm install
   node server.js
```
   The server will run on `http://localhost:8000`

3. In a new terminal, install and start the frontend
```bash
   cd app
   npm install
   npm run dev
```

4. Open your browser at `http://localhost:3000`
