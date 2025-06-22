# Metabase Setup for Profit Pulse AI

## Architecture Overview

The dashboard now shows KPI cards with mock data. When you click a card, it opens a modal with the corresponding Metabase visualization.

## Setup Steps

### 1. Deploy Metabase (if not already done)

Options:
- **Metabase Cloud**: https://www.metabase.com/start/
- **Railway**: https://railway.app/new/template/metabase
- **Heroku**: Use the Metabase Heroku button
- **Self-hosted**: Follow Metabase docs

### 2. Connect to Supabase Database

In Metabase Admin → Databases:
- **Host**: `aws-0-us-west-1.pooler.supabase.com`
- **Port**: `6543`
- **Database name**: `postgres`
- **Username**: `postgres.brqkmaesztkbxaumpbkw`
- **Password**: Your database password
- **SSL**: Required

### 3. Create Questions for Each KPI

For each KPI, create a Metabase question with appropriate visualization:

1. **Total Revenue** (`total_revenue`)
   - SQL: `SELECT SUM(total_amount) FROM orders WHERE created_at >= {{start_date}}`
   - Visualization: Number with trend chart

2. **Total Service Visits** (`total_service_visits`)
   - SQL: `SELECT COUNT(*) FROM service_visits WHERE visit_date >= {{start_date}}`
   - Visualization: Number with bar chart

3. **Gross Profit Margin** (`gross_profit_margin`)
   - SQL: Complex calculation based on revenue and costs
   - Visualization: Gauge or number with %

4. **Average Ticket** (`average_ticket`)
   - SQL: `SELECT AVG(total_amount) FROM orders WHERE created_at >= {{start_date}}`
   - Visualization: Number with trend

5. **Total Cost** (`total_cost`)
   - SQL: `SELECT SUM(amount) FROM costs WHERE date >= {{start_date}}`
   - Visualization: Number with breakdown by category

6. **Jobs Completed** (`jobs_completed`)
   - SQL: `SELECT COUNT(*) FROM orders WHERE status = 'completed' AND created_at >= {{start_date}}`
   - Visualization: Number with daily trend

7. **Call-to-Booking Ratio** (`call_to_booking_ratio`)
   - SQL: Calculate ratio of calls to bookings
   - Visualization: Percentage gauge

8. **Labor Cost per Hour** (`labor_cost_per_hour`)
   - SQL: Calculate from technician hours and costs
   - Visualization: Number with comparison

9. **Revenue per Tech per Day** (`revenue_per_tech_per_day`)
   - SQL: Complex calculation
   - Visualization: Bar chart by technician

10. **Capacity Utilization** (`capacity_utilization`)
    - SQL: Calculate technician utilization %
    - Visualization: Gauge or progress bar

### 4. Enable Public Sharing

For each question:
1. Open the question in Metabase
2. Click sharing icon → "Public link"
3. Enable public sharing
4. Copy the question ID from the URL

### 5. Update Question Mappings

Edit `components/metabase-modal.tsx`:

```typescript
const metabaseQuestionMap: Record<string, string> = {
  'total_revenue': 'YOUR_QUESTION_ID_HERE',
  'total_service_visits': 'YOUR_QUESTION_ID_HERE',
  'gross_profit_margin': 'YOUR_QUESTION_ID_HERE',
  'average_ticket': 'YOUR_QUESTION_ID_HERE',
  'total_cost': 'YOUR_QUESTION_ID_HERE',
  'jobs_completed': 'YOUR_QUESTION_ID_HERE',
  'call_to_booking_ratio': 'YOUR_QUESTION_ID_HERE',
  'labor_cost_per_hour': 'YOUR_QUESTION_ID_HERE',
  'revenue_per_tech_per_day': 'YOUR_QUESTION_ID_HERE',
  'capacity_utilization': 'YOUR_QUESTION_ID_HERE'
}
```

### 6. Update Environment Variable

On Vercel:
```
NEXT_PUBLIC_METABASE_SITE_URL=https://your-metabase-instance.com
```

## Testing

1. Click any KPI card on the dashboard
2. Modal should open with the Metabase visualization
3. Verify data loads correctly
4. Test on different screen sizes

## Troubleshooting

- **Modal shows blank**: Check question is publicly shared
- **404 errors**: Verify question ID is correct
- **CORS issues**: Ensure Metabase allows embedding from your domain
- **No data**: Check database connection and queries