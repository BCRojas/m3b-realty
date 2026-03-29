# M3B Realty Website

## Overview
A full-stack real estate website for M3B Realty, a premier real estate company based in Davao City, Philippines. The site showcases the company, its CEO, featured properties, the marketing team, and contact information.

## Architecture
- **Frontend**: React with Vite, TailwindCSS, shadcn/ui components, wouter for routing
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM via @neondatabase/serverless
- **State Management**: TanStack React Query

## Key Features
- **Hero Section**: Landing area with call-to-action
- **About Us**: Company overview and CEO profile (Brendon C. Rojas, REB)
- **Featured Properties**: Property listings display
- **Marketing Team**: Admin-managed team member cards with add/remove functionality (persisted to database)
- **Visitor Counter**: Tracks unique session visits (persisted to database, increments once per browser session)
- **Contact Section**: WhatsApp (+639209468365), Facebook, Instagram links, Google Maps embed
- **Footer**: Quick links, services, visitor counter display

## Database Schema
- `users` - Authentication (varchar UUID primary key)
- `team_members` - Marketing team profiles (serial primary key, name, role, image_url, portfolio_url)
- `visitor_counter` - Single-row visitor count tracker (serial primary key, count integer)

## API Routes
- `GET /api/team` - List all team members
- `POST /api/team` - Add a team member
- `DELETE /api/team/:id` - Remove a team member
- `GET /api/visitors` - Get visitor count
- `POST /api/visitors/increment` - Increment visitor count

## File Structure
- `shared/schema.ts` - Drizzle schema and Zod validation
- `server/db.ts` - Database connection
- `server/storage.ts` - Storage interface (DatabaseStorage)
- `server/routes.ts` - API routes
- `client/src/pages/Home.tsx` - Main page layout
- `client/src/components/` - All UI components (Nav, Hero, About, FeaturedProperties, MarketingTeam, Contact, Footer)
