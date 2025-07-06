-- Add target management tables to existing Pulse AI schema
-- Run this in Supabase SQL Editor

-- Update company_settings table to add target calculation preferences
ALTER TABLE company_settings 
ADD COLUMN IF NOT EXISTS target_calculation_preferences JSONB DEFAULT '{"monthly_to_weekly_factor": 4.33, "monthly_to_daily_factor": 30}';

-- Monthly target templates table
CREATE TABLE IF NOT EXISTS monthly_target_templates (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  kpi_targets JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monthly target assignments table
CREATE TABLE IF NOT EXISTS monthly_target_assignments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  template_id UUID REFERENCES monthly_target_templates(id) ON DELETE CASCADE,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  year INTEGER NOT NULL CHECK (year >= 2020),
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(month, year)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_monthly_target_assignments_month_year ON monthly_target_assignments(month, year);
CREATE INDEX IF NOT EXISTS idx_monthly_target_assignments_template_id ON monthly_target_assignments(template_id);

-- Add trigger for monthly_target_templates updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_monthly_target_templates_updated_at 
    BEFORE UPDATE ON monthly_target_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert a sample template for testing
INSERT INTO monthly_target_templates (name, description, kpi_targets) VALUES 
('Sample High Season', 'Example template for high season months', '{
  "total_revenue": 150000,
  "total_service_visits": 400,
  "total_cost": 90000,
  "gross_profit_margin": 30,
  "jobs_completed": 350,
  "call_to_booking_ratio": 75,
  "average_ticket": 500,
  "labor_cost_per_hour": 45,
  "revenue_per_tech_per_day": 800,
  "capacity_utilization": 90
}') ON CONFLICT DO NOTHING;