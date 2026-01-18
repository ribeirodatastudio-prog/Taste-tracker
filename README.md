# Taste Tracker

A web application to log restaurant visits.

## Tech Stack

- Next.js 15+ (App Router)
- Tailwind CSS
- Shadcn UI
- Prisma (SQLite)
- React Leaflet

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Initialize the database:
   ```bash
   npx prisma migrate dev
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Verification

To verify the database logic:
```bash
npx tsx verify-db.ts
```
