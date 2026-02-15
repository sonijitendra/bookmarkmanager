# Bookmark Manager

Minimal full-stack Bookmark Manager with separate backend and frontend, built for correctness, speed, and deployment on Vercel.

## Tech Stack

- Backend: Node.js, Express, UUID, in-memory store
- Frontend: React + Vite, Axios, TailwindCSS
- Tooling: npm workspaces, concurrently
- Deployment: Vercel-compatible backend + frontend setup

## Project Tree

```text
.
|-- .env.example
|-- .gitignore
|-- package.json
|-- README.md
|-- vercel.json
|-- backend
|   |-- .env.example
|   |-- api
|   |   |-- index.js
|   |-- package.json
|   |-- src
|       |-- app.js
|       |-- index.js
|       |-- data
|       |   |-- seedBookmarks.js
|       |   |-- store.js
|       |-- middleware
|           |-- validateBookmark.js
|-- frontend
    |-- .env.example
    |-- index.html
    |-- package.json
    |-- postcss.config.js
    |-- tailwind.config.js
    |-- vite.config.js
    |-- src
        |-- App.jsx
        |-- index.css
        |-- main.jsx
        |-- components
        |   |-- BookmarkCard.jsx
        |   |-- BookmarkForm.jsx
        |   |-- EditBookmarkModal.jsx
        |-- services
        |   |-- api.js
        |-- utils
            |-- apiError.js
            |-- bookmarkValidation.js
```

## Setup

### Prerequisites

- Node.js 18+ (recommended)
- npm 9+

### Install

```bash
npm install
```

### Environment Variables

Create env files from examples:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Default values:

- Backend port: `4000`
- Frontend API URL: `http://localhost:4000`

## Run Commands

### Run backend + frontend together

```bash
npm run dev
```

### Run backend only

```bash
npm run dev --workspace backend
```

### Run frontend only

```bash
npm run dev --workspace frontend
```

### Build frontend

```bash
npm run build
```

### Start (backend + frontend preview)

```bash
npm run start
```

## API Documentation

Base URL (local): `http://localhost:4000`

### GET `/bookmarks`

- Returns all bookmarks.
- Optional query: `?tag=value` for tag filtering (case-insensitive normalization).

Response `200`:

```json
[
  {
    "id": "uuid",
    "url": "https://example.com",
    "title": "Example",
    "description": "Optional text",
    "tags": ["docs", "reference"],
    "createdAt": "2026-02-01T09:00:00.000Z"
  }
]
```

### POST `/bookmarks`

Create bookmark.

Request body:

```json
{
  "url": "https://example.com",
  "title": "Example",
  "description": "Optional",
  "tags": ["docs", "react"]
}
```

Response `201`: created bookmark object.

### PUT `/bookmarks/:id`

Update bookmark by id.

Request body: same shape as POST.

- `200` updated bookmark
- `404` if id not found

### DELETE `/bookmarks/:id`

Delete bookmark by id.

- `200` with success message
- `404` if id not found

## Validation Rules

### Backend

- `url`: required, valid `http` or `https`
- `title`: required, max `200` chars
- `description`: optional, max `500` chars
- `tags`: optional array of strings, normalized to lowercase, max `5` unique tags
- All validation errors return `400` JSON
- Unknown bookmark id on update/delete returns `404` JSON

### Frontend

- Client-side validation before submit for the same constraints
- Tags input supports comma-separated values
- Tags are trimmed, lowercased, deduplicated, and capped at 5
- API errors are shown in UI

## Features Implemented

- Separate backend and frontend codebases
- 5 seed bookmarks in in-memory store
- CRUD bookmark API with required status codes (`201`, `400`, `404`)
- Optional `tag` query filter
- Basic API rate limiting middleware
- Bookmark list UI with clickable URL, description snippet, tags, created date
- Add bookmark form
- Edit bookmark modal
- Delete confirmation
- Tag-click filtering + clear filter
- Live search by title or URL

## Deploy on Vercel

### Option A: One Vercel project (monorepo)

1. Import repository into Vercel.
2. Keep project root at repo root.
3. Use included `vercel.json`.
4. Set env variable:
   - `VITE_API_BASE_URL=/api`
5. Deploy.

### Option B: Separate frontend and backend projects

1. Deploy `backend` as one Vercel project.
2. Deploy `frontend` as second Vercel project.
3. Set `VITE_API_BASE_URL` in frontend to deployed backend URL.

## AI Tools Used

- OpenAI Codex (GPT-5) for implementation assistance.

## Time Taken

- `[Fill this in]`

## Assumptions

- PUT expects a complete bookmark payload (`url`, `title`, optional `description`, optional `tags`).
- In-memory storage resets when server restarts (intentional per requirement).
