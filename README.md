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
- **Responsive Interface** — Access snippets through a modern web interface.
- **Light and Dark Themes** — Choose a comfortable viewing experience.
- **Demo Account** — Explore the application using a preconfigured demo account with sample snippets.

## Demo Account

Want to explore DevShelf without creating your own account? Visit the live application:

**[Open DevShelf](https://dev-shelf-sable.vercel.app)**

The demo account includes preset code snippets so you can explore snippet management, searching, favorites, editing, and revision history.

The login page displays the demo credentials. Use the **Use Demo Account** button to access the demo.

> **Note:** The demo account is intended for evaluation. Avoid storing private or sensitive information in demo snippets.

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

PostgreSQL stores the application's structured data, including:

- User accounts and authentication-related records
- Code snippets and their metadata
- Tags and snippet-tag relationships
- Timestamps and relational constraints

Prisma provides schema modeling and database access through Prisma Client.

### MongoDB + Mongoose

MongoDB stores snippet revision documents, including historical code snapshots and associated metadata.

When a snippet is edited, the revision-history workflow stores previous versions so users can review changes over time.

This separation allows DevShelf to manage current snippet data relationally while keeping revision history in a document-oriented database.

## How It Works

1. A user registers or logs in.
2. The user creates a snippet with a title, programming language, code, description, and optional tags.
3. The backend validates the request and stores the current snippet in PostgreSQL using Prisma.
4. The frontend displays snippets with syntax highlighting and supports searching, filtering, and favorites.
5. When a snippet is edited, the backend updates the current record and handles the revision-history workflow.
6. Historical versions can be retrieved from MongoDB through the backend API.

## Getting Started

Follow these instructions to run DevShelf locally.

### Prerequisites

Install the following:

- [Node.js](https://nodejs.org/)
- npm
- PostgreSQL
- MongoDB
- Git

You will also need access to PostgreSQL and MongoDB databases for local development.

### 1. Clone the Repository

```bash
git clone https://github.com/akshargk/DevShelf.git
cd DevShelf
```

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and configure the environment variables required by your backend.

Example:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_string
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
CLIENT_URL=http://localhost:5173
```

Replace the example values with your own connection strings and secrets. Check the existing backend configuration to confirm the required variable names and values.

**Security reminders:**

- Never commit `.env` files.
- Never expose database credentials or JWT secrets.
- Use a strong, private JWT secret.
- Do not use production credentials in a public repository.

### 3. Configure the PostgreSQL Database

Make sure your PostgreSQL database is running and `DATABASE_URL` points to the intended database.

From the `server` directory, run the project's configured Prisma migration command. For example:

```bash
npx prisma migrate deploy
npx prisma generate
```

Use the migration workflow appropriate to your existing schema and environment. Do not run migrations against a database containing important data without checking their effects first.

### 4. Start the Backend

From the `server` directory, start the backend using the script configured in `server/package.json`.

For example, if the project defines a development script:

```bash
npm run dev
```

Otherwise, use the appropriate start command defined by the project.

### 5. Set Up the Frontend

Open a second terminal and navigate to the project directory:

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

Confirm the expected API URL format in the frontend configuration before using this value.

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

`http://localhost:5173`

### 6. Seed Sample Data (Optional)

Sample data can be useful when developing or testing DevShelf locally.

If the repository contains a `seed.js` file or another seed script, inspect it before running it to confirm:

- Which database it connects to.
- Whether it creates the demo account.
- Which sample snippets and tags it creates.
- Whether repeated runs can create duplicate records.
- Whether it modifies or deletes existing data.

If `server/package.json` defines a seed command, run it from the backend directory. For example:

```bash
npm run seed
```

The command above is only an example. Use the actual command configured in the repository.

If no seed command is configured, follow the instructions in the existing seed file or configure the appropriate script before running it.

**Important:**

- Configure the required database environment variables before seeding.
- Use your intended local development database.
- Do not run a seed script against production unless you explicitly intend to provision production data and have checked what the script does.
- Ensure the seed process avoids duplicate demo users and snippets.
- Keep all personal and production data intact.

## Project Structure

The following is a simplified overview. Refer to the repository for the complete directory structure.

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
│   ├── server.js
│   └── ...
└── README.md
```

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
- Revision-history management for code snippets

## Future Improvements

Potential improvements include:

- Enhanced full-text search for large snippet collections
- Configurable revision-retention policies
- Automated testing for database operations and API endpoints
- Snippet import and export functionality
- Improved revision comparison and restore workflows

## Author

**Akshar G K**  
B.Tech — Computer Science and Engineering  
Alliance University, Bengaluru

GitHub: [@akshargk](https://github.com/akshargk)

---

If you find DevShelf useful, consider giving the repository a ⭐ on GitHub.
