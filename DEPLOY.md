# Picanon Business – Deployment Guide

This package contains the full **Picanon** full-stack web application (React + TypeScript + Vite frontend and Express API + SSE backend with persistent storage and Firebase Firestore sync).

## Requirements
- **Node.js 22.6+** (or Node.js 20+ using `npx tsx server.ts`)
- **npm** (or bun)

## Quick Deploy (Render, Railway, VPS, Cloud Run, Fly.io)
1. Unzip the archive and enter the project folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the production frontend (`dist/`):
   ```bash
   npm run build
   ```
   *(A fresh pre-built `dist/` folder is already included in this zip, and rebuilding updates it cleanly.)*
4. Start the production server:
   ```bash
   NODE_ENV=production npm start
   ```
   *(If deploying on Node.js 18/20 instead of Node 22+, start with `NODE_ENV=production npx tsx server.ts`.)*

## Environment Variables
Copy `.env.example` to `.env` if needed:
- `PORT`: Defaults to `3000` (automatically respects platform `PORT`).
- `NODE_ENV`: Set to `production` to serve static files directly from `dist/`.
- `PICANON_SESSION_SECRET`: Optional custom HMAC signing secret for user tokens.
