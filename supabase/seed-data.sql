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