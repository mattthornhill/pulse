'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KPIDetailsModal } from './kpi-details-modal'
import type { KPIType } from '@/types/dashboard'

interface CalendarHeatmapProps {
  timeFilter: 'weekly' | 'monthly' | 'annual'
}

interface DayPerformance {
  percentage: number
  kpiStatus: Record<KPIType, boolean>
}

const KPI_NAMES: Record<KPIType, string> = {
  total_revenue: 'Total Revenue',
  total_service_visits: 'Service Visits',
  total_cost: 'Total Costs',
  gross_profit_margin: 'Profit Margin',
  jobs_completed: 'Jobs Completed',
  call_to_booking_ratio: 'Call-to-Booking',
  average_ticket: 'Average Ticket',
  labor_cost_per_hour: 'Labor Cost/Hour',
  revenue_per_tech_per_day: 'Revenue/Tech/Day',
  capacity_utilization: 'Capacity Utilization'
}

const ALL_KPIS: KPIType[] = [
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

// Generate random performance data with individual KPI status
const generateMockData = (): Record<string, DayPerformance> => {
  const data: Record<string, DayPerformance> = {}
  const today = new Date()
  
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    
    const kpiStatus: Record<KPIType, boolean> = {} as Record<KPIType, boolean>
    let greenCount = 0
    
    // Generate random status for each KPI
    ALL_KPIS.forEach(kpi => {
      const isGreen = Math.random() > 0.3 // 70% chance of being green
      kpiStatus[kpi] = isGreen
      if (isGreen) greenCount++
    })
    
    const percentage = Math.round((greenCount / ALL_KPIS.length) * 100)
    
    data[dateKey] = {
      percentage,
      kpiStatus
    }
  }
  
  return data
}

const mockPerformanceData = generateMockData()

export function CalendarHeatmap({ timeFilter }: CalendarHeatmapProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedKPI, setSelectedKPI] = useState<KPIType | 'all'>('all')
  
  const getColorForPercentage = (percentage: number): string => {
    if (percentage === 100) return 'bg-green-600 dark:bg-green-500'
    if (percentage >= 70) return 'bg-green-400 dark:bg-green-400'
    if (percentage >= 60) return 'bg-red-400 dark:bg-red-400'
    return 'bg-red-600 dark:bg-red-500'
  }
  
  const getColorForKPI = (isGreen: boolean): string => {
    return isGreen ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
  }
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }
    
    return days
  }
  
  const formatDateKey = (year: number, month: number, day: number): string => {
    const monthStr = String(month + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${monthStr}-${dayStr}`
  }
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }
  
  const handleDayClick = (dateKey: string) => {
    if (mockPerformanceData[dateKey]) {
      setSelectedDate(dateKey)
    }
  }
  
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const days = getDaysInMonth(currentDate)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekDaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  
  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">
              Performance Calendar
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
              Showing: {selectedKPI === 'all' ? 'All KPIs' : KPI_NAMES[selectedKPI]}
            </p>
          </div>
          
          {/* KPI Filter */}
          <div className="flex items-center gap-2 sm:gap-3">
            <label htmlFor="kpi-filter" className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
              Filter by:
            </label>
            <select
              id="kpi-filter"
              value={selectedKPI}
              onChange={(e) => setSelectedKPI(e.target.value as KPIType | 'all')}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All KPIs</option>
              {ALL_KPIS.map(kpi => (
                <option key={kpi} value={kpi}>{KPI_NAMES[kpi]}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 min-w-[120px] sm:min-w-[140px] text-center">
            {monthYear}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Calendar Grid */}
        <div className="mb-4 sm:mb-6">
          {/* Week day headers */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1 sm:mb-2">
            {weekDays.map((day, i) => (
              <div key={day} className="text-center py-1 sm:py-2">
                <span className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400 hidden sm:inline">
                  {day}
                </span>
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 sm:hidden">
                  {weekDaysShort[i]}
                </span>
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="aspect-square" />
              }
              
              const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
              const performance = mockPerformanceData[dateKey]
              const hasData = performance !== undefined
              const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
              
              let displayPercentage = 0
              let colorClass = "bg-gray-100 dark:bg-slate-700"
              
              if (hasData) {
                if (selectedKPI === 'all') {
                  displayPercentage = performance.percentage
                  colorClass = getColorForPercentage(performance.percentage)
                } else {
                  const isGreen = performance.kpiStatus[selectedKPI]
                  displayPercentage = isGreen ? 100 : 0
                  colorClass = getColorForKPI(isGreen)
                }
              }
              
              return (
                <button
                  key={day}
                  onClick={() => handleDayClick(dateKey)}
                  disabled={!hasData}
                  className={cn(
                    "aspect-square rounded-md sm:rounded-lg relative transition-all",
                    hasData && "cursor-pointer hover:scale-105 active:scale-95",
                    !hasData && "cursor-default",
                    colorClass,
                    isToday && "ring-2 ring-blue-500 ring-offset-1 sm:ring-offset-2 dark:ring-offset-slate-800"
                  )}
                >
                  {/* Date in top-right */}
                  <span className={cn(
                    "absolute top-1 right-1 sm:top-1.5 sm:right-1.5 md:top-2 md:right-2 text-xs sm:text-sm md:text-base font-medium",
                    hasData ? "text-white/90" : "text-gray-600 dark:text-gray-400"
                  )}>
                    {day}
                  </span>
                  
                  {/* Percentage in center */}
                  {hasData && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-white text-base sm:text-lg md:text-xl font-bold">
                        {displayPercentage}%
                      </span>
                      {selectedKPI === 'all' && (
                        <span className="text-white/80 text-[8px] sm:text-[10px] hidden sm:block">
                          KPIs hit
                        </span>
                      )}
                    </div>
                  )}
                  
                  {!hasData && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                        No data
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        
        {/* Legend */}
        <div className="border-t border-gray-200 dark:border-slate-700 pt-3 sm:pt-4">
          <div className="flex items-center justify-center gap-3 sm:gap-6 flex-wrap text-[10px] sm:text-xs">
            {selectedKPI === 'all' ? (
              <>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-600 dark:bg-red-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">0-59%</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-400 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">60-69%</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">70-99%</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-600 dark:bg-green-500 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">100%</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 dark:bg-green-400 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Met target</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 dark:bg-red-400 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Missed target</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* KPI Details Modal */}
      {selectedDate && mockPerformanceData[selectedDate] && (
        <KPIDetailsModal
          isOpen={!!selectedDate}
          onClose={() => setSelectedDate(null)}
          date={selectedDate}
          performance={mockPerformanceData[selectedDate]}
        />
      )}
    </>
  )
}