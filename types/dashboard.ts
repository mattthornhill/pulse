export type TimeFilter = 'daily' | 'weekly' | 'monthly' | 'annual'

export type KPIStatus = 'green' | 'red' | 'grey'

export interface KPITarget {
  type: 'fixed' | 'dynamic' | 'benchmark' | 'seasonal'
  value: number
  unit?: string
}

export interface KPIData {
  id: string
  name: string
  value: number
  previousValue?: number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  target?: KPITarget
  status: KPIStatus
  unit?: string
  sparklineData?: number[]
  lastUpdated?: Date
}

export interface DashboardSummary {
  greenCount: number
  redCount: number
  totalScore: number
  percentage: number
}

// The Perfect 10 KPIs
export type KPIType = 
  | 'total_revenue'
  | 'total_service_visits'
  | 'total_cost'
  | 'gross_profit_margin'
  | 'jobs_completed'
  | 'call_to_booking_ratio'
  | 'average_ticket'
  | 'labor_cost_per_hour'
  | 'revenue_per_tech_per_day'
  | 'capacity_utilization'

export interface TechnicianPerformance {
  id: string
  name: string
  revenue: number
  jobsCompleted: number
  averageTicket: number
  utilizationRate: number
}

export interface CalendarHeatmapData {
  date: string
  score: number
  greenCount: number
  redCount: number
}