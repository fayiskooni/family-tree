# Family Tree Generator

An interactive genealogy platform for building and visualizing family trees as a pannable, zoomable graph.

🔗 **Live:** https://family-tree.fayiskooni.workers.dev

---

## Features

- Create family groups and add members with personal details
- Define marriages (couples) and assign parent-child relationships
- Visualize the full family tree as an interactive DAG
- Supports vertical and horizontal layout switching
- Handles half-siblings and multi-union lineages correctly
- Backend integrity checks prevent invalid or duplicate relationships

## Tech Stack

**Frontend:** React 19, React Flow, TanStack Query, Zustand, Shadcn UI, DaisyUI, Tailwind CSS

**Backend:** Node.js, Express, PostgreSQL (Neon Serverless)

**Visualization:** React Flow, ELK.js (Eclipse Layout Kernel)

**Auth:** JWT via HttpOnly cookies, bcryptjs

**Deployment:** Cloudflare Workers

## Database Schema

6 normalized tables:
- `users` — accounts
- `families` — family groups
- `members` — individual people
- `couples` — marriage links (husband_id, wife_id)
- `parent_child` — links couple_id to child_id
- `family_members` — maps members to families

## How It Works

1. User creates a family and adds members
2. Defines marriages by linking two members as a couple
3. Assigns children to couples via the parent_child table
4. Frontend fetches members, couples, and children separately
5. buildFamilyGraph() transforms flat records into a DAG
6. ELK.js computes node positions, React Flow renders the interactive tree

## Run Locally
```bash
git clone https://github.com/fayiskooni/YOUR_REPO_NAME

cd backend && npm install
cd ../frontend && npm install

# Backend: DATABASE_URL, JWT_SECRET
# Frontend: VITE_API_URL

cd backend && npm run dev
cd ../frontend && npm run dev
```
