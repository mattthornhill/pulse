# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: Profit Pulse AI Dashboard

A leadership-ready performance intelligence dashboard for field service businesses, displaying the 10 most critical KPIs for revenue growth and profitability.

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and App Router
- **Styling**: Shadcn/ui (Radix UI + Tailwind CSS)
- **Database**: Supabase (PostgreSQL)
- **Data Visualization**: Metabase embedded dashboards
- **State Management**: React hooks and context

## Common Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:3000

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## Project Architecture

```
/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main dashboard page
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles with Tailwind
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── kpi-card.tsx      # KPI card component
│   ├── dashboard-summary.tsx
│   ├── time-filter.tsx
│   └── metabase-embed.tsx
├── lib/                   # Utilities and configs
│   ├── utils.ts          # Shadcn utilities
│   └── supabase.ts       # Supabase client
├── types/                 # TypeScript types
│   └── dashboard.ts      # Dashboard type definitions
└── supabase/             # Database files
    └── schema.sql        # PostgreSQL schema

```

## Key Features

1. **10 Critical KPIs**: Total Revenue, Service Visits, Costs, Profit Margin, Jobs Completed, Call-to-Booking Ratio, Average Ticket, Labor Cost/Hour, Revenue/Tech/Day, Capacity Utilization
2. **Real-time Updates**: Auto-refresh every 15 minutes
3. **Time Filters**: Daily, Weekly, Monthly, Annual views
4. **Responsive Grid**: 3×4 KPI card layout with large cards for priority metrics
5. **Color Coding**: Green (on target), Red (below target), Grey (no data)
6. **Export Functions**: PDF generation for weekly/monthly leadership meetings

## Environment Variables

Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_METABASE_URL=your_metabase_url
NEXT_PUBLIC_METABASE_SITE_URL=your_metabase_site_url
NEXT_PUBLIC_METABASE_SECRET_KEY=your_metabase_jwt_secret
```

## Database Schema

The Supabase database includes tables for:
- `customers` - Customer information
- `technicians` - Service technician data
- `orders` - Service orders
- `service_visits` - Individual service visits
- `calls` - Phone calls for booking ratio
- `costs` - Business costs tracking
- `company_settings` - KPI target configurations
- `kpi_snapshots` - Historical KPI data

## Development Workflow

1. **Adding Components**: Use Shadcn CLI: `npx shadcn@latest add [component-name]`
2. **Styling**: Use Tailwind classes with Shadcn's `cn()` utility
3. **Type Safety**: Define all data structures in `types/dashboard.ts`
4. **State Management**: Use React hooks for local state, Context for global state
5. **Data Fetching**: Use Supabase client with proper error handling

## Current Implementation Status

✅ Completed:
- Project setup with Next.js and TypeScript
- Shadcn UI integration
- Dashboard layout and responsive grid
- KPI card components
- Time filter and summary bar
- Database schema design

🚧 In Progress:
- Metabase integration
- Admin configuration panel
- PDF export functionality
- Demo data generation
- Calendar heatmap visualization

## Important Notes

- No authentication required for this version
- All KPI calculations should match the PRD specifications exactly
- Maintain real-time feel with loading states and smooth transitions
- Ensure mobile responsiveness for all components