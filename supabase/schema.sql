-- Profit Pulse AI Dashboard Schema for Service Business

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers table
CREATE TABLE customers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  customer_since DATE DEFAULT CURRENT_DATE,
  total_lifetime_value DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technicians table
CREATE TABLE technicians (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  hourly_rate DECIMAL(10,2) NOT NULL,
  hire_date DATE NOT NULL,
  skill_level VARCHAR(50) CHECK (skill_level IN ('junior', 'intermediate', 'senior', 'expert')),
  territory VARCHAR(100),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  technician_id UUID REFERENCES technicians(id),
  order_date DATE NOT NULL,
  completion_date DATE,
  job_type VARCHAR(100),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service visits table
CREATE TABLE service_visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  technician_id UUID REFERENCES technicians(id),
  visit_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  duration_hours DECIMAL(4,2),
  materials_cost DECIMAL(10,2) DEFAULT 0,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Calls table for tracking call-to-booking ratio
CREATE TABLE calls (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  call_date DATE NOT NULL,
  call_time TIME NOT NULL,
  outcome VARCHAR(50) CHECK (outcome IN ('booked', 'not_booked', 'callback_scheduled', 'wrong_number', 'spam')),
  booked_order_id UUID REFERENCES orders(id),
  lead_source VARCHAR(100),
  call_duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Costs table for tracking various business costs
CREATE TABLE costs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cost_date DATE NOT NULL,
  category VARCHAR(100) CHECK (category IN ('labor', 'materials', 'fuel', 'insurance', 'equipment', 'overhead', 'marketing', 'other')),
  type VARCHAR(100),
  amount DECIMAL(10,2) NOT NULL,
  order_id UUID REFERENCES orders(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company settings table for KPI targets
CREATE TABLE company_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name VARCHAR(255),
  kpi_targets JSONB DEFAULT '{}',
  target_calculation_preferences JSONB DEFAULT '{"monthly_to_weekly_factor": 4.33, "monthly_to_daily_factor": 30}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly target templates table
CREATE TABLE monthly_target_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  kpi_targets JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly target assignments table
CREATE TABLE monthly_target_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES monthly_target_templates(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Daily KPI snapshots for historical tracking
CREATE TABLE kpi_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  snapshot_date DATE NOT NULL,
  kpi_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_technician_id ON orders(technician_id);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_service_visits_order_id ON service_visits(order_id);
CREATE INDEX idx_service_visits_visit_date ON service_visits(visit_date);
CREATE INDEX idx_calls_call_date ON calls(call_date);
CREATE INDEX idx_costs_cost_date ON costs(cost_date);
CREATE INDEX idx_kpi_snapshots_date ON kpi_snapshots(snapshot_date);
CREATE INDEX idx_monthly_target_assignments_month_year ON monthly_target_assignments(month, year);
CREATE INDEX idx_monthly_target_assignments_template_id ON monthly_target_assignments(template_id);

-- Create views for common KPI calculations

-- Total Revenue View
CREATE VIEW v_daily_revenue AS
SELECT 
  order_date as date,
  SUM(total) as revenue
FROM orders
WHERE status = 'completed'
GROUP BY order_date;

-- Service Visits View
CREATE VIEW v_daily_service_visits AS
SELECT 
  visit_date as date,
  COUNT(*) as visit_count
FROM service_visits
WHERE status = 'completed'
GROUP BY visit_date;

-- Call to Booking Ratio View
CREATE VIEW v_daily_call_booking_ratio AS
SELECT 
  call_date as date,
  COUNT(*) as total_calls,
  COUNT(CASE WHEN outcome = 'booked' THEN 1 END) as booked_calls,
  CASE 
    WHEN COUNT(*) > 0 
    THEN ROUND(COUNT(CASE WHEN outcome = 'booked' THEN 1 END)::DECIMAL / COUNT(*) * 100, 2)
    ELSE 0 
  END as booking_ratio
FROM calls
GROUP BY call_date;

-- Average Ticket View
CREATE VIEW v_daily_average_ticket AS
SELECT 
  order_date as date,
  AVG(total) as average_ticket,
  COUNT(*) as order_count
FROM orders
WHERE status = 'completed'
GROUP BY order_date;

-- Technician Performance View
CREATE VIEW v_technician_daily_performance AS
SELECT 
  t.id as technician_id,
  t.name as technician_name,
  o.order_date as date,
  COUNT(o.id) as jobs_completed,
  SUM(o.total) as revenue,
  AVG(o.total) as average_ticket
FROM technicians t
LEFT JOIN orders o ON t.id = o.technician_id AND o.status = 'completed'
GROUP BY t.id, t.name, o.order_date;

-- Update triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON technicians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_visits_updated_at BEFORE UPDATE ON service_visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_costs_updated_at BEFORE UPDATE ON costs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_company_settings_updated_at BEFORE UPDATE ON company_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_monthly_target_templates_updated_at BEFORE UPDATE ON monthly_target_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();