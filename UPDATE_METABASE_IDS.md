# Update Metabase Question IDs

Replace the numbers in `components/metabase-modal.tsx` with your actual Metabase question IDs:

```typescript
const metabaseQuestionMap: Record<string, string> = {
  'total_revenue': 'YOUR_ID_HERE',        // e.g., '4b5c6d7e-8f9a-0b1c-2d3e-4f5g6h7i8j9k'
  'total_service_visits': 'YOUR_ID_HERE',
  'gross_profit_margin': 'YOUR_ID_HERE',
  'average_ticket': 'YOUR_ID_HERE',
  'total_cost': 'YOUR_ID_HERE',
  'jobs_completed': 'YOUR_ID_HERE',
  'call_to_booking_ratio': 'YOUR_ID_HERE',
  'labor_cost_per_hour': 'YOUR_ID_HERE',
  'revenue_per_tech_per_day': 'YOUR_ID_HERE',
  'capacity_utilization': 'YOUR_ID_HERE'
}
```

## How to find the IDs:

1. In Metabase, go to each question
2. Click the sharing button
3. Enable public sharing
4. The public URL will contain a UUID like: `/public/question/4b5c6d7e-8f9a-0b1c-2d3e-4f5g6h7i8j9k`
5. Copy that UUID (the long string after `/public/question/`)

## Example:
If your public URL is:
`http://localhost:3001/public/question/4b5c6d7e-8f9a-0b1c-2d3e-4f5g6h7i8j9k`

Then use: `'total_revenue': '4b5c6d7e-8f9a-0b1c-2d3e-4f5g6h7i8j9k'`