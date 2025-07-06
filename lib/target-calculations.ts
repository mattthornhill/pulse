import { MonthlyTargetTemplate, TimeFilter, KPIType, TargetCalculationPreferences } from '@/types/dashboard'

export interface CalculatedTargets {
  monthly: number
  weekly: number
  daily: number
  annual: number
}

export interface TargetCalculationResult {
  targets: Record<KPIType, CalculatedTargets>
  period: {
    start: Date
    end: Date
    daysInPeriod: number
    weeksInPeriod: number
    monthsInPeriod: number
  }
}

const DEFAULT_CALCULATION_PREFERENCES: TargetCalculationPreferences = {
  monthlyToWeeklyFactor: 4.33, // Average weeks per month
  monthlyToDailyFactor: 30     // Average days per month
}

/**
 * Calculate targets for all time periods based on monthly template
 */
export const calculateTargetsFromTemplate = (
  template: MonthlyTargetTemplate,
  preferences: TargetCalculationPreferences = DEFAULT_CALCULATION_PREFERENCES
): Record<KPIType, CalculatedTargets> => {
  const result: Record<KPIType, CalculatedTargets> = {} as Record<KPIType, CalculatedTargets>

  Object.entries(template.kpiTargets).forEach(([kpiType, monthlyTarget]) => {
    const kpi = kpiType as KPIType
    
    result[kpi] = {
      monthly: monthlyTarget,
      weekly: monthlyTarget / preferences.monthlyToWeeklyFactor,
      daily: monthlyTarget / preferences.monthlyToDailyFactor,
      annual: monthlyTarget * 12
    }
  })

  return result
}

/**
 * Get target for specific time period
 */
export const getTargetForPeriod = (
  monthlyTarget: number,
  timeFilter: TimeFilter,
  preferences: TargetCalculationPreferences = DEFAULT_CALCULATION_PREFERENCES,
  periodInfo?: { daysInPeriod?: number; weeksInPeriod?: number; monthsInPeriod?: number }
): number => {
  switch (timeFilter) {
    case 'daily':
      return monthlyTarget / preferences.monthlyToDailyFactor
    
    case 'weekly':
      return monthlyTarget / preferences.monthlyToWeeklyFactor
    
    case 'monthly':
      return monthlyTarget
    
    case 'annual':
      return monthlyTarget * 12
    
    default:
      return monthlyTarget
  }
}

/**
 * Calculate targets for a specific date range
 */
export const calculateTargetsForDateRange = (
  template: MonthlyTargetTemplate,
  startDate: Date,
  endDate: Date,
  preferences: TargetCalculationPreferences = DEFAULT_CALCULATION_PREFERENCES
): TargetCalculationResult => {
  const start = new Date(startDate)
  const end = new Date(endDate)
  
  // Calculate period information
  const diffTime = Math.abs(end.getTime() - start.getTime())
  const daysInPeriod = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  const weeksInPeriod = Math.ceil(daysInPeriod / 7)
  const monthsInPeriod = Math.ceil(daysInPeriod / 30)
  
  const targets: Record<KPIType, CalculatedTargets> = {} as Record<KPIType, CalculatedTargets>
  
  Object.entries(template.kpiTargets).forEach(([kpiType, monthlyTarget]) => {
    const kpi = kpiType as KPIType
    const dailyTarget = monthlyTarget / preferences.monthlyToDailyFactor
    const weeklyTarget = monthlyTarget / preferences.monthlyToWeeklyFactor
    
    targets[kpi] = {
      monthly: monthlyTarget,
      weekly: weeklyTarget,
      daily: dailyTarget,
      annual: monthlyTarget * 12
    }
  })
  
  return {
    targets,
    period: {
      start,
      end,
      daysInPeriod,
      weeksInPeriod,
      monthsInPeriod
    }
  }
}

/**
 * Get seasonal template for a specific month
 */
export const getTemplateForMonth = (
  templates: MonthlyTargetTemplate[],
  assignments: any[], // MonthlyTargetAssignment[] but avoiding circular import
  month: number,
  year: number
): MonthlyTargetTemplate | null => {
  const assignment = assignments.find(a => a.month === month && a.year === year)
  
  if (!assignment) return null
  
  return templates.find(t => t.id === assignment.templateId) || null
}

/**
 * Calculate prorated target for partial periods
 */
export const calculateProratedTarget = (
  monthlyTarget: number,
  actualDays: number,
  totalDaysInMonth: number,
  preferences: TargetCalculationPreferences = DEFAULT_CALCULATION_PREFERENCES
): number => {
  const dailyTarget = monthlyTarget / preferences.monthlyToDailyFactor
  return dailyTarget * actualDays
}

/**
 * Calculate target achievement percentage
 */
export const calculateTargetAchievement = (
  actualValue: number,
  targetValue: number
): {
  percentage: number
  status: 'above' | 'met' | 'below'
  variance: number
} => {
  if (targetValue === 0) {
    return {
      percentage: 0,
      status: 'below',
      variance: actualValue
    }
  }
  
  const percentage = (actualValue / targetValue) * 100
  const variance = actualValue - targetValue
  
  let status: 'above' | 'met' | 'below' = 'below'
  if (percentage >= 100) {
    status = percentage > 100 ? 'above' : 'met'
  }
  
  return {
    percentage,
    status,
    variance
  }
}

/**
 * Get days in month for accurate calculations
 */
export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate()
}

/**
 * Get weeks in month for accurate calculations
 */
export const getWeeksInMonth = (month: number, year: number): number => {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0)
  const firstDayOfWeek = firstDay.getDay()
  const daysInMonth = lastDay.getDate()
  
  return Math.ceil((daysInMonth + firstDayOfWeek) / 7)
}

/**
 * Calculate year-to-date targets
 */
export const calculateYTDTargets = (
  templates: MonthlyTargetTemplate[],
  assignments: any[], // MonthlyTargetAssignment[]
  year: number,
  currentMonth: number,
  preferences: TargetCalculationPreferences = DEFAULT_CALCULATION_PREFERENCES
): Record<KPIType, number> => {
  const ytdTargets: Record<KPIType, number> = {} as Record<KPIType, number>
  
  // Initialize all KPIs to 0
  const kpiTypes: KPIType[] = [
    'total_revenue',
    'total_service_visits', 
    'total_cost',
    'gross_profit_margin',
    'jobs_completed',
    'call_to_booking_ratio',
    'average_ticket',
    'labor_cost_per_hour',
    'revenue_per_tech_per_day',
    'capacity_utilization'
  ]
  
  kpiTypes.forEach(kpi => {
    ytdTargets[kpi] = 0
  })
  
  // Sum up targets for each completed month
  for (let month = 1; month <= currentMonth; month++) {
    const template = getTemplateForMonth(templates, assignments, month, year)
    
    if (template) {
      Object.entries(template.kpiTargets).forEach(([kpiType, monthlyTarget]) => {
        const kpi = kpiType as KPIType
        ytdTargets[kpi] += monthlyTarget
      })
    }
  }
  
  return ytdTargets
}

/**
 * Format target value for display
 */
export const formatTargetValue = (value: number, kpiType: KPIType): string => {
  switch (kpiType) {
    case 'total_revenue':
    case 'total_cost':
    case 'average_ticket':
    case 'labor_cost_per_hour':
    case 'revenue_per_tech_per_day':
      return `$${value.toLocaleString()}`
    
    case 'gross_profit_margin':
    case 'call_to_booking_ratio':
    case 'capacity_utilization':
      return `${value.toFixed(1)}%`
    
    case 'total_service_visits':
    case 'jobs_completed':
      return value.toFixed(0)
    
    default:
      return value.toString()
  }
}