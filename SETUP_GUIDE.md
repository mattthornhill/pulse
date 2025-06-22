# Profit Pulse AI Dashboard - Setup Guide

This guide will walk you through setting up Supabase and Metabase for the Profit Pulse AI Dashboard.

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- Docker installed (for local Metabase) OR a Metabase Cloud account

## Step 1: Supabase Setup

### 1.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New project"
3. Enter project details:
   - Name: `profit-pulse-ai`
   - Database Password: (save this securely)
   - Region: Choose closest to you
4. Click "Create new project" and wait for setup

### 1.2 Get Your API Keys

1. Once created, go to Settings → API
2. Copy these values:
   - Project URL: `https://[YOUR-PROJECT-REF].supabase.co`
   - Anon/Public Key: `eyJhbGc...` (long string)

### 1.3 Create Database Schema

1. Go to SQL Editor in Supabase dashboard
2. Click "New query"
3. Copy and paste the entire contents of `/supabase/schema.sql`
4. Click "Run" to execute the schema creation

### 1.4 Configure Environment Variables

1. Create `.env.local` file in your project root:
```bash
cp .env.local.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc... (your anon key)
```

## Step 2: Generate Demo Data

### 2.1 Create Seed Script

Create a file `supabase/seed-data.sql`:

```sql
-- Insert demo customers
INSERT INTO customers (name, email, phone, address, customer_since)
VALUES 
  ('Johnson HVAC Services', 'contact@johnsonhvac.com', '555-0101', '123 Main St, Austin, TX', '2020-01-15'),
  ('Smith Plumbing Co', 'info@smithplumbing.com', '555-0102', '456 Oak Ave, Dallas, TX', '2019-06-20'),
  ('Davis Electric LLC', 'support@daviselectric.com', '555-0103', '789 Pine Rd, Houston, TX', '2021-03-10'),
  ('Wilson Appliance Repair', 'service@wilsonrepair.com', '555-0104', '321 Elm St, San Antonio, TX', '2020-11-05'),
  ('Anderson Home Services', 'hello@andersonhome.com', '555-0105', '654 Maple Dr, Fort Worth, TX', '2022-02-28');

-- Insert demo technicians
INSERT INTO technicians (name, email, phone, hourly_rate, hire_date, skill_level, territory, status)
VALUES 
  ('Sarah Johnson', 'sarah.j@company.com', '555-1001', 45.00, '2019-05-15', 'expert', 'North Austin', 'active'),
  ('Mike Chen', 'mike.c@company.com', '555-1002', 42.00, '2020-03-20', 'senior', 'South Austin', 'active'),
  ('Tom Wilson', 'tom.w@company.com', '555-1003', 38.00, '2021-01-10', 'intermediate', 'East Austin', 'active'),
  ('Lisa Garcia', 'lisa.g@company.com', '555-1004', 40.00, '2020-08-15', 'senior', 'West Austin', 'active'),
  ('David Kim', 'david.k@company.com', '555-1005', 35.00, '2022-06-01', 'intermediate', 'Central Austin', 'active'),
  ('Alex Rodriguez', 'alex.r@company.com', '555-1006', 32.00, '2023-02-15', 'junior', 'North Dallas', 'active'),
  ('Jamie Turner', 'jamie.t@company.com', '555-1007', 30.00, '2023-09-01', 'junior', 'South Dallas', 'active');

-- Generate orders for the last 30 days
INSERT INTO orders (customer_id, technician_id, order_date, completion_date, job_type, total, status)
SELECT 
  c.id,
  t.id,
  CURRENT_DATE - (random() * 30)::int,
  CURRENT_DATE - (random() * 30)::int,
  CASE (random() * 4)::int
    WHEN 0 THEN 'HVAC Repair'
    WHEN 1 THEN 'Plumbing Service'
    WHEN 2 THEN 'Electrical Work'
    WHEN 3 THEN 'Appliance Repair'
    ELSE 'General Maintenance'
  END,
  300 + (random() * 700)::numeric(10,2),
  'completed'
FROM 
  customers c
  CROSS JOIN technicians t
  CROSS JOIN generate_series(1, 10) AS gs
WHERE random() < 0.3;

-- Generate service visits
INSERT INTO service_visits (order_id, technician_id, visit_date, start_time, end_time, duration_hours, materials_cost, labor_cost, status)
SELECT 
  o.id,
  o.technician_id,
  o.order_date,
  '08:00:00'::time + (random() * interval '8 hours'),
  '08:00:00'::time + (random() * interval '10 hours'),
  2 + (random() * 4)::numeric(4,2),
  50 + (random() * 200)::numeric(10,2),
  100 + (random() * 300)::numeric(10,2),
  'completed'
FROM orders o;

-- Generate calls data for call-to-booking ratio
INSERT INTO calls (customer_id, call_date, call_time, outcome, lead_source, call_duration_seconds)
SELECT 
  c.id,
  CURRENT_DATE - (random() * 30)::int,
  '08:00:00'::time + (random() * interval '10 hours'),
  CASE 
    WHEN random() < 0.65 THEN 'booked'
    WHEN random() < 0.85 THEN 'not_booked'
    ELSE 'callback_scheduled'
  END,
  CASE (random() * 3)::int
    WHEN 0 THEN 'Website'
    WHEN 1 THEN 'Phone'
    WHEN 2 THEN 'Referral'
    ELSE 'Google Ads'
  END,
  60 + (random() * 600)::int
FROM 
  customers c
  CROSS JOIN generate_series(1, 20) AS gs
WHERE random() < 0.5;

-- Generate costs data
INSERT INTO costs (cost_date, category, type, amount, description)
SELECT 
  CURRENT_DATE - (random() * 30)::int,
  CASE (random() * 5)::int
    WHEN 0 THEN 'labor'
    WHEN 1 THEN 'materials'
    WHEN 2 THEN 'fuel'
    WHEN 3 THEN 'equipment'
    WHEN 4 THEN 'overhead'
    ELSE 'marketing'
  END,
  'Regular Operations',
  100 + (random() * 1000)::numeric(10,2),
  'Daily operational costs'
FROM generate_series(1, 100) AS gs;

-- Set initial company settings with KPI targets
INSERT INTO company_settings (company_name, kpi_targets)
VALUES ('Demo Service Company', '{
  "total_revenue": {"type": "fixed", "value": 135000},
  "total_service_visits": {"type": "fixed", "value": 350},
  "total_cost": {"type": "dynamic", "value": 85000},
  "gross_profit_margin": {"type": "benchmark", "value": 25},
  "jobs_completed": {"type": "fixed", "value": 300},
  "call_to_booking_ratio": {"type": "benchmark", "value": 70},
  "average_ticket": {"type": "fixed", "value": 500},
  "labor_cost_per_hour": {"type": "fixed", "value": 48},
  "revenue_per_tech_per_day": {"type": "fixed", "value": 700},
  "capacity_utilization": {"type": "benchmark", "value": 85}
}'::jsonb);
```

### 2.2 Run the Seed Script

1. Go to SQL Editor in Supabase
2. Create a new query and paste the seed script
3. Click "Run" to populate demo data

## Step 3: Metabase Setup

### Option A: Local Metabase with Docker (Recommended)

According to Supabase documentation, Docker deployment is the recommended approach:

1. Install Docker Desktop:
   - Download from https://www.docker.com/products/docker-desktop/
   - Install and start Docker Desktop
   - Wait for Docker to be running (whale icon in menu bar)

2. Pull and run Metabase:
```bash
docker pull metabase/metabase:latest
docker run -d -p 3000:3000 --name metabase metabase/metabase
```

3. Access Metabase at http://localhost:3000/setup
4. Complete the setup wizard
5. When adding database, get connection details from Supabase:
   - In your Supabase Dashboard, click the "Connect" button
   - Look for "Session pooler" section (NOT Transaction pooler)
   - You'll see connection parameters there

   **Use Session Pooler Connection (Recommended by Supabase):**
   - Host: Look for the host in your Session pooler connection string (e.g., `aws-0-us-west-1.pooler.supabase.com`)
   - Port: `5432`
   - Database name: `postgres`
   - Username: `postgres.[YOUR-PROJECT-REF]` (e.g., `postgres.brqkmaesztkbxaumpbkw`)
   - Password: (your database password)
   - **Use SSL**: ON (checked)
   - **SSL Mode**: `require`
   
   **IMPORTANT**: The Session pooler host is NOT your project URL! It will be something like `aws-0-[region].pooler.supabase.com`
   
   **Alternative - Direct Connection:**
   - If you have IPv6 or IPv4 Add-On, use the direct connection string
   - Host: `db.[YOUR-PROJECT-REF].supabase.co`
   - Port: `5432`
   - Database name: `postgres`
   - Username: `postgres`
   - Password: (your database password)
   - **Use SSL**: ON (checked)
   
   **Alternative: Get Connection String from Supabase:**
   1. Go to Supabase Dashboard → Settings → Database
   2. Under "Connection string", copy the URI (starts with `postgresql://`)
   3. In Metabase, at the bottom of the form, paste this into "Additional JDBC connection string options"
   4. Parse the URI to fill in the fields above
   
   **Connection Troubleshooting:**
   
   **If Metabase Cloud won't connect:**
   1. **Check Supabase IP Allowlist**: 
      - Go to Supabase Dashboard → Settings → Database
      - Scroll to "Connection pooling" section
      - Make sure "Allow connections from all IPs" is enabled
      - Or add Metabase's IP addresses to the allowlist
   
   2. **Test Connection with psql or another tool:**
      ```bash
      psql postgresql://postgres:[YOUR-PASSWORD]@db.brqkmaesztkbxaumpbkw.supabase.co:5432/postgres
      ```
   
   3. **Common Issues:**
      - Password contains special characters that need URL encoding
      - Database is paused (free tier pauses after 1 week of inactivity)
      - Network restrictions on Metabase Cloud side
      - SSL certificate issues
   
   4. **Alternative Solutions:**
      - Use local Metabase with Docker (Option B below)
      - Use Retool, Grafana, or other BI tools that integrate better with Supabase
      - Build custom charts using Supabase client libraries directly

### Option B: Local Metabase with Docker (Recommended if Cloud fails)

1. Run Metabase locally:
```bash
docker run -d -p 3000:3000 --name metabase metabase/metabase
```

2. Open http://localhost:3000
3. Complete setup wizard
4. Add your Supabase database (same details as Option A)

## Step 4: Create Metabase Dashboards

### 4.1 Create Questions (Charts) for Each KPI

For each KPI, create a new question in Metabase:

1. **Total Revenue**
   - Query: `SELECT SUM(total) FROM orders WHERE status = 'completed' AND order_date >= CURRENT_DATE - INTERVAL '30 days'`
   - Visualization: Number with goal line

2. **Total Service Visits**
   - Query: `SELECT COUNT(*) FROM service_visits WHERE status = 'completed' AND visit_date >= CURRENT_DATE - INTERVAL '30 days'`
   - Visualization: Bar chart

3. **Gross Profit Margin**
   - Query: Custom calculation based on revenue and costs
   - Visualization: Gauge

4. **Jobs Completed**
   - Query: `SELECT COUNT(*) FROM orders WHERE status = 'completed' AND order_date >= CURRENT_DATE - INTERVAL '30 days'`
   - Visualization: Bar chart by technician

5. **Call-to-Booking Ratio**
   - Query: Calculate ratio from calls table
   - Visualization: Progress bar

6. **Average Ticket**
   - Query: `SELECT AVG(total) FROM orders WHERE status = 'completed'`
   - Visualization: Line chart with trend

7. **Labor Cost/Hour**
   - Query: Calculate from service_visits
   - Visualization: Number with conditional formatting

8. **Revenue/Tech/Day**
   - Query: Complex query grouping by technician and date
   - Visualization: Grouped bar chart

9. **Capacity Utilization**
   - Query: Calculate based on hours worked vs available
   - Visualization: Progress ring

### 4.2 Create Dashboard

1. Click "New" → "Dashboard"
2. Name it "Profit Pulse AI - Perfect 10 KPIs"
3. Add each question/chart to the dashboard
4. Arrange in the layout specified in the PRD

### 4.3 Enable Public Embedding

1. Go to Settings → Admin → Embedding
2. Enable "Public sharing"
3. For each dashboard/question:
   - Click share icon
   - Enable public link
   - Copy the embed URL

### 4.4 Update Environment Variables

Add Metabase URLs to `.env.local`:
```
NEXT_PUBLIC_METABASE_URL=https://your-metabase-instance.com
NEXT_PUBLIC_METABASE_SITE_URL=https://your-metabase-instance.com
NEXT_PUBLIC_METABASE_SECRET_KEY=your-embedding-secret-key
```

## Step 5: Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Open http://localhost:3000
3. Verify:
   - Data loads from Supabase
   - KPIs display correct values
   - Charts render (when Metabase integration is complete)

## Step 6: Production Deployment

### 6.1 Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### 6.2 Security Considerations

- Use Row Level Security (RLS) in Supabase for multi-tenant setup
- Implement proper CORS settings
- Use environment variables for all sensitive data
- Consider implementing JWT-based embedding for Metabase

## Troubleshooting

### Common Issues:

1. **CORS errors**: Check Supabase dashboard → Authentication → URL Configuration
2. **Connection refused**: Verify database password and connection string
3. **No data showing**: Check if seed script ran successfully
4. **Metabase embed not working**: Ensure public sharing is enabled

### Support Resources:

- Supabase Docs: https://supabase.com/docs
- Metabase Docs: https://www.metabase.com/docs
- Project Issues: https://github.com/your-repo/issues

## Next Steps

1. Customize the dashboard styling
2. Add real-time updates using Supabase subscriptions
3. Implement PDF export functionality
4. Add the calendar heatmap visualization
5. Build the admin configuration panel

---

For questions or issues, please refer to the main README.md or open an issue in the repository.