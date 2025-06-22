-- 1. Total Revenue (already done above)
SELECT 
  SUM(total) as total_revenue
FROM orders 
WHERE status = 'completed' 
  AND order_date >= CURRENT_DATE - INTERVAL '30 days';

-- 2. Total Service Visits
SELECT 
  COUNT(*) as total_visits
FROM service_visits 
WHERE status = 'completed'
  AND visit_date >= CURRENT_DATE - INTERVAL '30 days';

-- 3. Total Cost
SELECT 
  SUM(amount) as total_cost
FROM costs
WHERE cost_date >= CURRENT_DATE - INTERVAL '30 days';

-- 4. Gross Profit Margin
WITH revenue_costs AS (
  SELECT 
    (SELECT SUM(total) FROM orders WHERE status = 'completed' AND order_date >= CURRENT_DATE - INTERVAL '30 days') as revenue,
    (SELECT SUM(amount) FROM costs WHERE cost_date >= CURRENT_DATE - INTERVAL '30 days') as costs
)
SELECT 
  ROUND(((revenue - costs) / revenue * 100)::numeric, 2) as profit_margin
FROM revenue_costs;

-- 5. Jobs Completed
SELECT 
  COUNT(*) as jobs_completed
FROM orders 
WHERE status = 'completed' 
  AND order_date >= CURRENT_DATE - INTERVAL '30 days';

-- 6. Call-to-Booking Ratio
SELECT 
  ROUND((COUNT(CASE WHEN outcome = 'booked' THEN 1 END)::numeric / COUNT(*) * 100), 2) as booking_ratio
FROM calls
WHERE call_date >= CURRENT_DATE - INTERVAL '30 days';

-- 7. Average Ticket
SELECT 
  ROUND(AVG(total)::numeric, 2) as average_ticket
FROM orders 
WHERE status = 'completed' 
  AND order_date >= CURRENT_DATE - INTERVAL '30 days';

-- 8. Labor Cost per Hour
SELECT 
  ROUND(SUM(labor_cost) / SUM(duration_hours), 2) as labor_cost_per_hour
FROM service_visits
WHERE status = 'completed'
  AND visit_date >= CURRENT_DATE - INTERVAL '30 days';

-- 9. Revenue per Tech per Day
WITH tech_revenue AS (
  SELECT 
    technician_id,
    DATE_TRUNC('day', order_date) as work_date,
    SUM(total) as daily_revenue
  FROM orders
  WHERE status = 'completed'
    AND order_date >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY technician_id, DATE_TRUNC('day', order_date)
)
SELECT 
  ROUND(AVG(daily_revenue)::numeric, 2) as avg_revenue_per_tech_per_day
FROM tech_revenue;

-- 10. Capacity Utilization
WITH tech_hours AS (
  SELECT 
    SUM(duration_hours) as worked_hours,
    COUNT(DISTINCT technician_id) * 22 * 8 as available_hours -- 22 working days * 8 hours
  FROM service_visits
  WHERE status = 'completed'
    AND visit_date >= CURRENT_DATE - INTERVAL '30 days'
)
SELECT 
  ROUND((worked_hours / available_hours * 100)::numeric, 2) as capacity_utilization
FROM tech_hours;