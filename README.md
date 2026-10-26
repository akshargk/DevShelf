# DevShelf — Developer Snippet Manager

A web-based platform for developers to save, organize, search, and manage reusable code snippets with syntax highlighting, favorites, tags, and revision history.

**Live Demo:** [DevShelf](https://dev-shelf-sable.vercel.app)  
**GitHub Repository:** [akshargk/DevShelf](https://github.com/akshargk/DevShelf)

---

## Overview

DevShelf helps developers keep their frequently used code snippets organized in one place instead of scattered across text files, notes, and chats.

Users can create and edit snippets, categorize them with tags, search their code, mark favorites, and review previous versions. The application combines a relational database with a document database to manage current snippets and their revision history.

## Features

- **Authentication** — Register and log in securely.
- **Snippet Management** — Create, view, edit, and delete code snippets.
- **Syntax Highlighting** — Display code in a readable, language-aware format.
- **Search and Filtering** — Find snippets using keywords, programming languages, and tags.
- **Tags** — Organize snippets into searchable categories.
- **Favorites** — Mark important snippets for quick access.
- **Revision History** — Store and retrieve previous snippet versions.
- **Responsive Interface** — Access your snippets through a modern web interface.
- **Light and Dark Themes** — Choose a comfortable viewing experience.

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite |
| Styling | Tailwind CSS |
| Server State | TanStack Query |
| HTTP Client | Axios |
| Syntax Highlighting | PrismJS |
| Backend | Node.js, Express.js |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| Primary Database | PostgreSQL |
| ORM | Prisma |
| Revision Database | MongoDB |
| MongoDB ODM | Mongoose |
| Frontend Deployment | Vercel |
| Backend Deployment | Render |

## Database Architecture

DevShelf uses **polyglot persistence**, choosing different database technologies for different types of data.

### PostgreSQL + Prisma

Stores the application's structured, current data:

- Users and authentication-related records
- Code snippets and their metadata
- Tags and snippet-tag relationships
- Relational constraints and timestamps

Prisma provides schema modeling and database access through Prisma Client.

### MongoDB + Mongoose

Stores snippet revision documents, including historical code snapshots and associated metadata.

This separation allows the application to manage current snippet data relationally while keeping revision history in a document-oriented database.

## How It Works

1. A user registers or logs in.
2. The user creates a snippet with its title, programming language, code, description, and tags.
3. The backend validates the request and stores the current snippet in PostgreSQL using Prisma.
4. The frontend displays the snippet with syntax highlighting and supports search, filtering, and favorites.
5. When a snippet is edited, the backend handles the update and revision-history workflow.
6. Historical versions can be retrieved from MongoDB through the backend API.

## Getting Started

### Prerequisites

Install the following before running DevShelf locally:

- Node.js and npm
- PostgreSQL
- MongoDB
- Git

### 1. Clone the repository

```bash
git clone https://github.com/akshargk/DevShelf.git
cd DevShelf
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the required environment variables.

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
CLIENT_URL=http://localhost:5173
```

Replace the example values with your own credentials. Never commit `.env` files or expose database credentials and JWT secrets.

Run the database migrations using the project's configured Prisma version and migration workflow. Then start the backend using the appropriate script in `server/package.json`, for example:

```bash
npm run dev
```

### 3. Set up the frontend

Open a second terminal:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Check the frontend API configuration to confirm the expected URL format.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

> **Note:** Available scripts, environment variable names, and API URL conventions should match the current project configuration. Check the `package.json` files and existing environment examples before running the commands.

## Project Structure

```text
DevShelf/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── api/
│       └── ...
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── prisma/
│   └── ...
└── README.md
```

The structure above is a simplified overview. Refer to the repository for the complete directory layout.

## Learning Objectives

This project demonstrates practical application of:

- Relational database design and normalization
- Primary keys, foreign keys, and referential integrity
- Many-to-many relationships
- Prisma ORM and database migrations
- REST API development using Express.js
- Authentication and protected routes
- Document-based data modeling with MongoDB and Mongoose
- Polyglot persistence
- Frontend server-state management with TanStack Query

## Future Improvements

- Improve full-text search for large snippet collections.
- Add configurable revision retention policies.
- Improve automated testing for database operations and API endpoints.
- Add snippet import and export functionality.
- Enhance revision comparison and restore workflows.

## Author

**Akshar G K**  
B.Tech — Computer Science and Engineering  
Alliance University, Bengaluru

GitHub: [@akshargk](https://github.com/akshargk)

---

If you find DevShelf useful, consider giving the repository a ⭐ on GitHub.
