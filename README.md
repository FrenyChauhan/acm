<div align="center">

<img src="client/public/favicon.svg" alt="ACM NIT Surat Logo" width="80" height="80" />

# ACM NIT Surat — Official Website

**The central hub for the ACM Student Chapter at NIT Surat.**  
Explore events, read technical blogs, discover projects, and meet the team.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=render&logoColor=black)](https://render.com)

</div>

---

## Table of Contents

- [Project Description](#project-description)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Skills Matrix](#skills-matrix)
- [Features](#features)
- [Project Structure](#project-structure)
- [Pages & Routes](#pages--routes)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Future Scope](#future-scope)

---

## Project Description

This repository contains the source code for the completely redesigned official website of the **ACM Student Chapter at NIT Surat**. Built from the ground up, the platform serves as a central hub for students, faculty, and tech enthusiasts to explore our initiatives, read technical blogs, view upcoming and past events, discover our projects, and learn about the team behind ACM NIT Surat.

### Overview

The site covers six core areas:

- 📅 Explore upcoming and past **events** (hackathons, workshops, talks)
- 📝 Read and publish **technical blogs** across multiple domains
- 🚀 Discover open-source **projects** built by the chapter
- 👥 Meet the **team** — current members and a full historical alumni archive
- 🏆 View chapter **achievements**
- 📬 Get in touch via the **contact** form

### Architecture

The website is engineered using a modern, decoupled **Client–Server** architecture:

- **Frontend (Client):** Built with React 19 and powered by Vite for fast hot-module replacement and optimized production builds. The UI uses Tailwind CSS alongside Bootstrap for a flexible, responsive layout. GSAP and Framer Motion handle animations — scroll reveals, page transitions, and micro-interactions — keeping the experience engaging without feeling heavy. Forms are managed with React Hook Form and validated with Zod.

- **Backend (Server):** A RESTful API built with Node.js and Express 5, following an MVC pattern (Models → Controllers → Routes). It connects to MongoDB via Mongoose for schema-driven data modeling. Security and performance are handled by Helmet, CORS, and express-rate-limit. Media uploads (team photos, event banners, blog covers) go through Multer for parsing and Cloudinary for cloud storage and CDN delivery.

- **Database:** MongoDB (NoSQL) was chosen for its flexible document model, which suits the varying metadata across blogs, events, projects, and team hierarchies without forcing rigid relational joins.

### Design Choices & Reasoning

The overarching design philosophy was **Modern, Professional, and Corporate** — clean whitespace, readable typography, and a cohesive color palette that reflects the technical identity of ACM.

- **Micro-interactions:** Subtle GSAP and Framer Motion animations prevent the corporate aesthetic from feeling sterile. Hover states, scroll reveals, and page transitions provide satisfying visual feedback without distracting from content.

- **Team Archive:** The `TeamMember` model and `Team` page were explicitly designed to archive not just the current core team but every past iteration — a living historical record and tribute to all contributors.

- **Component-Driven UI:** React's component model keeps the codebase modular and the design language consistent across all pages. Each feature area (events, blogs, projects, team) has its own isolated component folder.

- **SEO-First Routing:** Slug-based URLs for events and blogs (`/events/:slug`, `/blogs/:slug`) combined with React Helmet Async meta tags ensure every page is indexable and shareable.

---

## Architecture

The website follows a modern, decoupled **Client–Server** architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Vercel)                          │
│                                                                 │
│   React 19 + Vite  ──►  Tailwind CSS + Bootstrap               │
│   GSAP + Framer Motion  ──►  React Router DOM                   │
│   Axios  ──────────────────────────────────────────────────┐    │
└────────────────────────────────────────────────────────────┼────┘
                                                             │ REST API
                                                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER (Render)                          │
│                                                                 │
│   Express 5  ──►  Helmet + CORS + Rate Limiter                  │
│   Morgan (logging)  ──►  Joi (validation)                       │
│   Multer  ──►  Cloudinary (media storage)                       │
│   Mongoose  ──────────────────────────────────────────────┐     │
└───────────────────────────────────────────────────────────┼─────┘
                                                            │
                                                            ▼
                                              ┌─────────────────────┐
                                              │   MongoDB Atlas     │
                                              │                     │
                                              │  Events  Blogs      │
                                              │  Projects  Team     │
                                              │  Achievements       │
                                              │  Contacts           │
                                              └─────────────────────┘
```

---

## Tech Stack

### Frontend

| Category | Technology | Version |
|---|---|---|
| Framework | React | 19 |
| Build Tool | Vite | 8 |
| Styling | Tailwind CSS | 3.4 |
| Styling | Bootstrap | 5.3 |
| Animation | GSAP | 3.15 |
| Animation | Framer Motion | 12 |
| Routing | React Router DOM | 7 |
| Forms | React Hook Form | 7 |
| Validation | Zod | 4 |
| HTTP Client | Axios | 1.16 |
| SEO | React Helmet Async | 3 |
| Icons | Lucide React | 1.16 |
| Carousel | Swiper | 12 |
| 3D Effects | Vanilla Tilt | 1.8 |
| Notifications | React Hot Toast | 2.6 |
| Date Utilities | date-fns | 4 |

### Backend

| Category | Technology | Version |
|---|---|---|
| Runtime | Node.js | LTS |
| Framework | Express | 5 |
| Database | MongoDB + Mongoose | 9.6 |
| Media Storage | Cloudinary | 2.10 |
| File Uploads | Multer | 2.1 |
| Security | Helmet | 8 |
| Rate Limiting | express-rate-limit | 8.5 |
| Validation | Joi | 18 |
| Logging | Morgan | 1.10 |
| CORS | cors | 2.8 |
| Env Config | dotenv | 17 |

### DevOps & Tooling

| Tool | Purpose |
|---|---|
| Vercel | Frontend hosting + SPA routing |
| Render | Backend hosting (Node.js) |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image CDN + storage |
| concurrently | Run client + server together in dev |
| nodemon | Auto-restart server on changes |
| ESLint | Code linting |

---

## Skills Matrix

| Domain | Technologies / Frameworks / Tools |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS, Bootstrap, Framer Motion, GSAP, React Router DOM, React Hook Form, Zod, Axios, Swiper, Vanilla Tilt, Lucide React, React Hot Toast, React Helmet Async |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, REST APIs, Joi, Multer, Cloudinary |
| **AI** | — |
| **ML** | — |
| **DevOps** | Git, GitHub, Vercel, Render, MongoDB Atlas, nodemon, concurrently, ESLint |
| **Other** | Responsive Web Design, SEO, dotenv, Morgan, Helmet, express-rate-limit |

---

## Features

### Events
- Flagship event showcase with rich detail pages
- Upcoming events with countdown timers
- Filter events by category (Hackathon, Workshop, Talk, Competition, Outreach, Online)
- Event gallery with Swiper carousel
- Event stats and timeline
- Registration and results links

### Blogs
- Featured blog highlights
- Categories: `AI` · `Web Dev` · `Competitive Programming` · `Open Source` · `Career` · `General` · `Algorithms` · `Research`
- Author profiles with avatar and role
- Read time estimation and view tracking
- Slug-based routing for SEO-friendly URLs

### Projects
- Active and archived project listings
- Tech stack tags per project
- GitHub and live demo links
- Contributor profiles
- Featured project highlights

### Team
- Current core team display
- Full historical archive of past members
- Role categories: Leadership · Developer · Designer · Problem Setter · Core · Faculty
- Social links (LinkedIn, GitHub, Twitter, Email)
- Alumni and faculty distinction

### Achievements
- Chapter-wide achievement gallery with dates and descriptions

### Contact
- Contact form with subject categories: General · Sponsorship · Collaboration · Recruitment · Other
- Backend persistence of all submissions

### UI / UX
- Custom animated cursor
- Smooth page transitions (Framer Motion)
- Scroll-to-top behavior
- Particle canvas background
- Full-page loader
- Responsive design across all breakpoints
- SEO meta tags via React Helmet

---

## Project Structure

```
acm-nit-surat/
│
├── client/                          # React frontend
│   ├── public/                      # Static assets (team photos, icons)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Navbar, Footer, Loader, Cursor, etc.
│   │   │   ├── events/              # EventCard, EventModal, CountdownTimer, etc.
│   │   │   ├── blogs/
│   │   │   ├── projects/
│   │   │   ├── team/
│   │   │   ├── achievements/
│   │   │   └── home/
│   │   ├── pages/                   # One file per route
│   │   ├── services/                # Axios API calls (api.js, eventService.js)
│   │   ├── hooks/                   # Custom hooks (useCountUp.js)
│   │   ├── utils/                   # GSAP animations, SEO config
│   │   ├── styles/                  # Global and feature CSS files
│   │   ├── App.jsx                  # Router setup
│   │   └── main.jsx                 # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json                  # SPA rewrite rules
│
├── server/                          # Express backend
│   ├── config/
│   │   ├── db.js                    # MongoDB connection
│   │   └── cloudinary.js            # Cloudinary setup
│   ├── models/                      # Mongoose schemas
│   │   ├── Event.js
│   │   ├── Blog.js
│   │   ├── Project.js
│   │   ├── TeamMember.js
│   │   ├── Achievement.js
│   │   └── Contact.js
│   ├── controllers/                 # Route handler logic
│   ├── routes/                      # Express routers
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   ├── uploadMiddleware.js      # Multer + Cloudinary
│   │   └── validateRequest.js       # Joi validation
│   ├── index.js                     # App entry point
│   └── .env.example
│
├── package.json                     # Root scripts (dev, build, install:all)
├── render.yaml                      # Render deployment config
└── README.md
```

---

## Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Landing page with hero, highlights, and stats |
| `/events` | Events | Full event listing with filters |
| `/events/:slug` | Event Detail | Individual event page with gallery and stats |
| `/projects` | Projects | Project showcase (active + archived) |
| `/blogs` | Blogs | Blog listing with category filters |
| `/blogs/:slug` | Blog Detail | Full blog post with author info |
| `/team` | Team | Current team + historical archive |
| `/achievements` | Achievements | Chapter achievements gallery |
| `/contact` | Contact | Contact form |
| `*` | 404 | Not Found page |

---

## API Reference

All endpoints are prefixed with `/api`. Rate limited to **100 requests / 15 minutes**.

### Events — `/api/events`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all events (supports query filters) |
| `GET` | `/flagship` | Get flagship events |
| `GET` | `/:slug` | Get single event by slug |
| `POST` | `/` | Create a new event |
| `PUT` | `/:id` | Update an event |
| `DELETE` | `/:id` | Delete an event |

### Blogs — `/api/blogs`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all blogs |
| `GET` | `/:slug` | Get single blog by slug |
| `POST` | `/` | Create a new blog |
| `PUT` | `/:id` | Update a blog |
| `DELETE` | `/:id` | Delete a blog |

### Projects — `/api/projects`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all projects |
| `GET` | `/:slug` | Get single project by slug |
| `POST` | `/` | Create a new project |
| `PUT` | `/:id` | Update a project |
| `DELETE` | `/:id` | Delete a project |

### Team — `/api/team`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all team members |
| `POST` | `/` | Add a team member |
| `PUT` | `/:id` | Update a team member |
| `DELETE` | `/:id` | Delete a team member |

### Achievements — `/api/achievements`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Get all achievements |
| `POST` | `/` | Add an achievement |
| `PUT` | `/:id` | Update an achievement |
| `DELETE` | `/:id` | Delete an achievement |

### Contact — `/api/contact`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/` | Submit a contact message |

---

## Data Models

```
Event
├── title, slug (unique), category*, edition, tagline
├── description, startDate, endDate, venue, isOnline
├── isFlagship, isUpcoming, year
├── stats[]  { label, value, icon }
├── gallery[] { url, cloudinaryId, caption }
├── tags[], achievement, bannerGradient
└── registrationLink, resultsLink

Blog
├── title, slug (unique), excerpt, content
├── author { name, avatar, role }
├── coverImage { url, cloudinaryId }
├── category*, tags[], readTime
├── published, featured, number
└── publishedAt, views

Project
├── name, slug (unique), description, longDesc
├── techStack[], status (Active | Archived)
├── githubUrl, liveUrl
├── thumbnail { url, cloudinaryId }
├── contributors[] { name, avatar, github }
└── stars, featured, number, year

TeamMember
├── name, role, department, year
├── category (leadership | developer | designer | problem-setter | core | faculty)
├── photo { url, cloudinaryId }
├── linkedin, github, twitter, email
├── isFaculty, isAlumni, quote, order
└── timestamps

Achievement
├── title, date, description
└── imageUrl

Contact
├── name, email, subject*
└── message, read

* enum field — see models for allowed values
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A MongoDB connection string (local or Atlas)
- A Cloudinary account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/acm-nit-surat.git
cd acm-nit-surat
```

### 2. Install all dependencies

```bash
npm run install:all
```

This installs dependencies for the root, `client/`, and `server/` in one shot.

### 3. Configure environment variables

```bash
cp server/.env.example server/.env
```

Fill in the values in `server/.env` (see [Environment Variables](#environment-variables)).

For the frontend, create `client/.env.local`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start the development server

```bash
npm run dev
```

This runs both the React frontend (port `5173`) and the Express backend (port `5000`) concurrently.

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000/api |

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the server listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `CLIENT_URL` | Allowed CORS origin(s), comma-separated | `https://acm.example.com` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abc...xyz` |

### Client (`client/.env.local`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL for backend API calls | `http://localhost:5000/api` |

---

## Deployment

### Frontend → Vercel

1. Connect the repository to Vercel.
2. Set the **root directory** to `client`.
3. Build command: `npm run build` · Output directory: `dist`.
4. Add `VITE_API_URL` as an environment variable pointing to your Render backend URL.

The `client/vercel.json` already handles SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Backend → Render

The `render.yaml` at the root configures the backend service automatically:

```yaml
services:
  - type: web
    name: acm-backend
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
```

Set the following environment variables in the Render dashboard:
`MONGO_URI`, `CLIENT_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

---

## Future Scope

The current version establishes a solid, scalable foundation. The architecture is intentionally designed to grow — here's what's on the roadmap:

| Feature | Description |
|---|---|

| 🤖 **AI-Powered Semantic Search** | Embedding-based search across blogs and projects using a vector database (e.g. Pinecone), enabling contextual recommendations beyond keyword matching |
| 🎟️ **Event Registration & Ticketing** | Direct RSVP flows, capacity management, and QR-code-based ticketing for physical workshops and hackathons |
| 📊 **Analytics Dashboard** | Internal view tracking for blogs and events, giving the team insight into what content resonates most |


---

<div align="center">

Built with ❤️ by the **ACM NIT Surat** team.

</div>
