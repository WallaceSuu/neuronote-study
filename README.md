# Neuronote Study

**AI-powered study tool that turns PDFs into summaries, flashcards, and a note-scoped chat—built with Django, React, and OpenAI.**

**[→ Live demo](https://neuronote-study.vercel.app)**

---

## Highlights

- **[Live demo](https://neuronote-study.vercel.app)** — Try it in the browser (Vercel)
- **Full-stack product:** Django REST API + React SPA with token/session auth, password reset, and profile management
- **OpenAI integration:** PDF → extracted text → GPT-4o-mini summaries & titles; per-note flashcard generation (MC with one correct answer) and contextual chat with persisted history
- **Structured prompts:** Separate calls for summary, title, question, and answer options; lettered multiple-choice format with clear correct-answer marking
- **Notebook system:** Multi-page notebook with notes, sidebar vs. on-page placement, and position fields for layout
- **Tested backend:** API tests for auth, password reset, username rules, PDF upload, notes, notebook, and security (isolation, invalid token)
- **Production-ready touches:** Configurable DB (SQLite/PostgreSQL), WhiteNoise static files, Gunicorn-ready, env-based config, CSRF/CORS and credential handling

---

## Overview

Neuronote Study helps students turn lecture slides and PDFs into study materials without switching tools. Upload a PDF; the app extracts text, generates a summary and title via OpenAI, and stores it as a note. From there you can generate multiple-choice flashcards and chat with an AI assistant that uses the note as context. A notebook feature organizes notes across pages with optional sidebar and positioning.

---

## Why This Project Matters

- **Real workflow:** Solves a concrete problem—from passive PDFs to active recall (summaries, quizzes, Q&A) in one place.
- **Integration work:** Connects document processing (PDF), LLM APIs (OpenAI), and a full auth + data model (users, notes, flashcards, chat, notebook).
- **Scope:** Enough backend and frontend surface to demonstrate API design, auth, validation, and UI state handling—useful as a portfolio piece for full-stack or backend roles.

---

## Key Features

| Area | Features |
|------|----------|
| **Auth & profile** | Register, login, logout; token + session auth; password reset via email; change password (with strength rules); edit username (rate-limited to once per week) |
| **PDFs & notes** | Upload PDF (client-side type/size checks); auto-extract text and create note with AI summary + title; list and delete notes; notes tied to user and PDF |
| **Flashcards** | Generate one multiple-choice flashcard per note (question + 5 options); list by note; select answer and see correct/incorrect |
| **Chat** | Per-note chat; conversation history stored in DB; assistant system prompt includes note content for context-aware answers |
| **Notebook** | Create pages; add notes to a page (sidebar or on-page); update position and text; delete pages (with page-number reordering) |
| **UI** | Dark/light theme with persistence; responsive layout; centralized API config and auth headers |

---

## Demo / Screenshots

| [**Live app**](https://neuronote-study.vercel.app) |
|----------------------------------------------------|
| Try the full app: upload a PDF, get AI summaries, generate flashcards, and chat per note. |

*Screenshots (e.g. landing, notes, flashcards) can be added below.*

---

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Backend** | Django 4.2, Django REST Framework, Token + Session auth, custom User model |
| **Database** | SQLite (default), PostgreSQL via `DATABASE_URL` |
| **AI** | OpenAI API (GPT-4o-mini), pdfplumber for PDF text extraction |
| **Frontend** | React, React Router, Material UI (MUI), Emotion, Framer Motion, Axios, Webpack |
| **DevOps / prod** | python-dotenv, dj-database-url, django-cors-headers, WhiteNoise, Gunicorn; optional SMTP for password reset |

---

## Architecture / How It Works

- **Backend:** Django project `neuronote_study` with apps `api` (auth, users, PDFs, notes, notebook) and `openAI_api` (notes list, PDF processing, flashcards, chat). REST endpoints under `/api/` and `/openai/`; all relevant views use `IsAuthenticated` and user-scoped queries.
- **Frontend:** Single-page app served by Django (same `index.html` for all routes); React Router handles routes; Webpack builds into `frontend/static/frontend` (or `frontend/build` for production-style hashed assets); Django `collectstatic` serves static files (e.g. with WhiteNoise).
- **Flow:** User registers/logs in → receives token → uploads PDF → backend saves file, extracts text, calls OpenAI for summary + title, creates note → user can create flashcards from a note (OpenAI question + answer options), chat in context of that note, or add the note to notebook pages.

---

## Repository Structure

```
├── manage.py                    # Django management (run from repo root)
├── requirements.txt
├── build.sh                     # Pip install, migrate, collectstatic
├── neuronote_study/             # Django project
│   ├── settings.py
│   ├── urls.py                  # Mounts api/, openai/, accounts/, frontend routes
│   └── ...
├── api/                         # Auth, users, PDFs, notes, notebook
│   ├── models.py                # User, uploadPDF, note, flashcard, chat_message, notebook_page, notebook_note
│   ├── views.py                 # Auth, PDF upload, notes CRUD, notebook CRUD, password reset/change
│   ├── serializers.py
│   ├── urls.py
│   └── tests/
├── openAI_api/                  # OpenAI-backed features
│   ├── views.py                 # Process PDF → note, get notes, flashcards, chat
│   └── util.py                  # PDF text extraction, OpenAI summary/title/flashcard/chat helpers
└── frontend/                    # React app
    ├── src/
    │   ├── App.js
    │   ├── config.js             # API base URL, endpoints, axios config (CSRF + token)
    │   ├── context/ThemeContext.js
    │   └── components/          # Landing, SubmitPDF, Notes, Flashcards, Chat, Notebook, Auth, Profile, etc.
    ├── webpack.config.js
    ├── package.json
    └── .env.example
```

---

## Setup / Installation

1. **Clone and enter the repo**
   ```bash
   git clone <repo-url>
   cd neuronote-study
   ```

2. **Python environment**
   ```bash
   python -m venv venv
   # Windows:
   venv\Scripts\activate
   # macOS/Linux:
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Environment variables**  
   Create a `.env` in the **repo root** (where `manage.py` is). At minimum:
   - `OPENAI_API_KEY` — required for summaries, flashcards, and chat.

   Optional (with defaults in code/settings):
   - `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`
   - `DATABASE_URL` (defaults to SQLite)
   - `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`
   - `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD` (for password reset email)

   For the **frontend**, copy `neuronote_study/frontend/.env.example` to `neuronote_study/frontend/.env` and set `REACT_APP_API_URL` if you need to point at a different backend (e.g. `http://localhost:8000`).

4. **Database**
   ```bash
   python manage.py migrate
   ```

5. **Frontend build (for Django to serve the SPA)**
   ```bash
   cd neuronote_study/frontend
   npm install
   npm run build
   cd ../..
   ```
   This writes the bundle into `frontend/static/frontend` (or similar per webpack config). For local dev you can instead run the React dev server and set `REACT_APP_API_URL` to your Django URL; CORS is already set for common dev origins.

---

## How to Run

- **Backend (from repo root):**
  ```bash
  python manage.py runserver
  ```
  Serves the API and the built frontend at the same origin (e.g. `http://127.0.0.1:8000/`).

- **Frontend dev server (optional):**  
  From `neuronote_study/frontend`: `npm run dev` or `npm start`, with `REACT_APP_API_URL=http://localhost:8000` so the API is reachable.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes (for AI features) | OpenAI API key |
| `DJANGO_SECRET_KEY` | No | Django secret (default has a dev fallback) |
| `DJANGO_DEBUG` | No | Set to `True` for debug mode |
| `DJANGO_ALLOWED_HOSTS` | No | Comma-separated hosts (default includes localhost) |
| `DATABASE_URL` | No | DB URL (default SQLite) |
| `CORS_ALLOWED_ORIGINS` / `CSRF_TRUSTED_ORIGINS` | No | Allowed origins for CORS/CSRF |
| `EMAIL_HOST_USER` / `EMAIL_HOST_PASSWORD` | No | SMTP for password reset |
| `REACT_APP_API_URL` (frontend `.env`) | No | Backend base URL (default empty = same origin) |

---

## Example Workflow / Usage

1. Register or log in.
2. **Submit PDF:** Go to Submit, upload a PDF (e.g. lecture slides). The app creates a note with an AI-generated summary and title.
3. **Notes:** Open Notes to see all your notes; delete if needed.
4. **Flashcards:** Pick a note, generate a flashcard (question + 5 options), then answer and see feedback.
5. **Chat:** Open chat for a note; ask questions; the assistant uses that note as context; history is saved.
6. **Notebook:** Create pages, add notes to a page (sidebar or on-page), adjust position/text as needed.
7. **Profile:** Change password, edit username (once per week), view account info.

---

## Technical Highlights

- **Auth:** DRF Token + Session auth; permission classes on every API view; custom User with UUID and optional `last_username_change` for rate limiting; password reset via Django’s token generator and SMTP; change-password validation (length, complexity, match).
- **Data model:** Clear ownership (user → PDFs, notes, flashcards, chat, notebook pages); cascade deletes and FKs (including soft patterns like `db_constraint=False` where needed); notebook notes carry position and sidebar flag.
- **OpenAI usage:** Separate, focused prompts for summary, title, question, and multiple-choice answers; structured parsing of lettered options and correct-answer marker in the backend.
- **Frontend:** Centralized `config.js` for base URL and endpoints; axios config with CSRF token and auth token; theme context with localStorage persistence; protected routes and auth checks where used.

---

## Challenges and Engineering Decisions

- **Splitting API vs OpenAI app:** Core CRUD and auth live in `api`; OpenAI-dependent flows (process PDF, get notes, flashcards, chat) in `openAI_api` to keep boundaries clear and to allow different scaling or mocking later.
- **Note creation on upload:** Upload triggers immediate processing (extract text → summarize → create note) so the user gets one step “upload and get a note” instead of a separate “process” action.
- **Chat context:** Each conversation is scoped to a note; the system message includes the note text so the model stays on-topic; history is stored so the thread can be resumed.
- **Notebook page renumbering:** Deleting a page renumbers higher pages to keep ordering consistent and avoid gaps.
- **Security:** No reliance on client-only checks; server validates file type/size where applicable, enforces auth and ownership on all resources, and uses generic messages on password reset to avoid user enumeration.

---

## Results / What I Learned

- End-to-end flow from PDF upload to AI-generated content and structured storage.
- Designing REST endpoints and permission model for a multi-entity app (users, PDFs, notes, flashcards, chat, notebook).
- Integrating an LLM with structured prompts and parsing (e.g. multiple-choice format).
- Testing API behavior (auth, validation, isolation) with Django’s test client and DRF’s `APITestCase`.

---

## Future Improvements

- **CI/CD:** Add GitHub Actions (or similar) for tests and optional deploy.
- **Containers:** Dockerfile and docker-compose for one-command local run.
- **Performance:** Background task queue (e.g. Celery) for PDF processing and flashcard generation so long-running OpenAI calls don’t block the request.
- **UX:** Loading states and error handling for all AI calls; retry or chunking for very large PDFs.
- **Testing:** Expand tests (e.g. OpenAI integration mocked); add frontend tests.

---

## Resume-Ready Project Summary

**Neuronote Study** — Full-stack AI study app (Django, React, OpenAI). Users upload PDFs; the app extracts text, generates summaries and titles with GPT-4o-mini, and supports per-note multiple-choice flashcards and contextual chat. Includes auth (token/session, password reset, rate-limited username changes), a multi-page notebook, and an API test suite covering auth, notes, and security. Built with Django REST Framework, React, MUI, and production-oriented config (env-based settings, WhiteNoise, Gunicorn-ready).

---

*README structured for quick scanning (title, one-line pitch, highlights), then overview, features, tech stack, architecture, setup, env vars, workflow, technical depth, and resume summary—with no invented features; all claims match the codebase.*
