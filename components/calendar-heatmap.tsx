'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { KPIDetailsModal } from './kpi-details-modal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
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
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  
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
  
  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate)
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - 7)
      } else {
        newDate.setDate(newDate.getDate() + 7)
      }
      return newDate
    })
  }
  
  const navigateYear = (direction: 'prev' | 'next') => {
    setCurrentYear(prevYear => {
      if (direction === 'prev') {
        return prevYear - 1
      } else {
        return prevYear + 1
      }
    })
  }
  
  const getWeekDays = () => {
    const week = []
    const startOfWeek = new Date(currentDate)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day
    startOfWeek.setDate(diff)
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      week.push(date)
    }
    
    return week
  }
  
  const handleDayClick = (dateKey: string) => {
    if (mockPerformanceData[dateKey]) {
      setSelectedDate(dateKey)
      setSelectedMonth(null)
    }
  }
  
  const handleMonthClick = (monthIndex: number) => {
    setSelectedMonth(monthIndex)
    setSelectedDate(null)
    setSelectedYear(null)
  }
  
  const handleYearClick = (year: number) => {
    setSelectedYear(year)
    setSelectedDate(null)
    setSelectedMonth(null)
  }
  
  const getMonthData = (monthIndex: number) => {
    const daysInMonth = new Date(currentYear, monthIndex + 1, 0).getDate()
    const monthData: Array<{ day: number; data: DayPerformance | null }> = []
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(currentYear, monthIndex, day)
      monthData.push({
        day,
        data: mockPerformanceData[dateKey] || null
      })
    }
    
    return monthData
  }
  
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const days = getDaysInMonth(currentDate)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const weekDaysShort = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Render functions for different views
  const renderWeekView = () => {
    const weekDates = getWeekDays()
    const weekStart = weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const weekEnd = weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    
    return (
      <>
        {/* Week Navigation */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 min-w-[180px] sm:min-w-[200px] text-center">
            {weekStart} - {weekEnd}
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Week Grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4">
          {weekDates.map((date) => {
            const dateKey = formatDateKey(date.getFullYear(), date.getMonth(), date.getDate())
            const dayData = mockPerformanceData[dateKey]
            const isToday = date.toDateString() === new Date().toDateString()
            
            return (
              <div key={dateKey} className="flex flex-col items-center">
                <div className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {weekDays[date.getDay()]}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mb-2">
                  {date.getDate()}
                </div>
                {dayData ? (
                  <button
                    onClick={() => handleDayClick(dateKey)}
                    className={cn(
                      "w-12 h-12 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold transition-transform hover:scale-110",
                      selectedKPI === 'all' 
                        ? getColorForPercentage(dayData.percentage)
                        : dayData.kpiStatus[selectedKPI] 
                          ? 'bg-green-500 dark:bg-green-400' 
                          : 'bg-red-500 dark:bg-red-400',
                      isToday && "ring-2 ring-blue-500 ring-offset-2"
                    )}
                  >
                    {dayData.percentage}%
                  </button>
                ) : (
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg bg-gray-100 dark:bg-slate-700" />
                )}
              </div>
            )
          })}
        </div>
      </>
    )
  }
  
  const renderMonthView = () => {
    return (
      <>
        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => handleMonthClick(currentDate.getMonth())}
            className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 min-w-[120px] sm:min-w-[140px] text-center transition-colors underline-offset-2 hover:underline"
          >
            {monthYear}
          </button>
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
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium hidden sm:inline">
                  {day}
                </span>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium sm:hidden">
                  {weekDaysShort[i]}
                </span>
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} />
              }
              
              const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
              const dayData = mockPerformanceData[dateKey]
              const isToday = 
                day === new Date().getDate() && 
                currentDate.getMonth() === new Date().getMonth() &&
                currentDate.getFullYear() === new Date().getFullYear()
              
              return (
                <div key={day} className="aspect-square p-0.5 sm:p-1">
                  {dayData ? (
                    <button
                      onClick={() => handleDayClick(dateKey)}
                      className={cn(
                        "w-full h-full rounded-md sm:rounded-lg relative transition-transform hover:scale-105",
                        selectedKPI === 'all' 
                          ? getColorForPercentage(dayData.percentage)
                          : dayData.kpiStatus[selectedKPI] 
                            ? 'bg-green-500 dark:bg-green-400' 
                            : 'bg-red-500 dark:bg-red-400',
                        isToday && "ring-2 ring-blue-500 ring-offset-1"
                      )}
                    >
                      {/* Date in top-right corner */}
                      <span className="absolute top-1 right-1 text-[10px] sm:text-xs text-white/90 font-medium">
                        {day}
                      </span>
                      
                      {/* Percentage in center */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-white text-sm sm:text-base md:text-lg font-bold">
                          {selectedKPI === 'all' ? dayData.percentage : (dayData.kpiStatus[selectedKPI] ? 100 : 0)}%
                        </span>
                        {selectedKPI === 'all' && (
                          <span className="text-white/80 text-[8px] sm:text-[10px]">
                            KPIs hit
                          </span>
                        )}
                      </div>
                    </button>
                  ) : (
                    <div className={cn(
                      "w-full h-full rounded-md sm:rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center",
                      isToday && "ring-2 ring-blue-500 ring-offset-1"
                    )}>
                      <span className="text-[10px] sm:text-xs text-gray-400">
                        {day}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </>
    )
  }
  
  const renderAnnualView = () => {
    // Calculate monthly averages for mobile view
    const getMonthlyAverage = (month: number) => {
      const daysInMonth = new Date(currentYear, month + 1, 0).getDate()
      let total = 0
      let count = 0
      
      for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = formatDateKey(currentYear, month, day)
        if (mockPerformanceData[dateKey]) {
          total += mockPerformanceData[dateKey].percentage
          count++
        }
      }
      
      return count > 0 ? Math.round(total / count) : 0
    }
    
    return (
      <>
        {/* Year Navigation */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => navigateYear('prev')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => handleYearClick(currentYear)}
            className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 min-w-[80px] text-center transition-colors underline-offset-2 hover:underline"
          >
            {currentYear}
          </button>
          <button
            onClick={() => navigateYear('next')}
            className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Mobile List View - Only on small screens */}
        <div className="sm:hidden space-y-2">
          {monthNames.map((monthName, monthIndex) => {
            const average = getMonthlyAverage(monthIndex)
            const colorClass = getColorForPercentage(average)
            
            return (
              <button
                key={monthIndex} 
                onClick={() => handleMonthClick(monthIndex)}
                className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4 flex items-center justify-between w-full hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">{monthName}</span>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-white font-semibold text-sm",
                    colorClass
                  )}>
                    {average}%
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </button>
            )
          })}
        </div>
        
        {/* 12 Month Grid - Hidden on mobile, shown on larger screens */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {monthNames.map((monthName, monthIndex) => {
            const monthDate = new Date(currentYear, monthIndex, 1)
            const monthDays = getDaysInMonth(monthDate)
            
            return (
              <div key={monthIndex} className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-2">
                <h4 className="text-sm sm:text-xs font-semibold text-center mb-2 sm:mb-1">
                  <button
                    onClick={() => handleMonthClick(monthIndex)}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors underline-offset-2 hover:underline"
                  >
                    {monthName}
                  </button>
                </h4>
                <div className="grid grid-cols-7 gap-1 sm:gap-0.5 text-[10px] sm:text-[8px]">
                  {/* Mini week headers */}
                  {weekDaysShort.map(day => (
                    <div key={day} className="text-center text-gray-500 dark:text-gray-500">
                      {day}
                    </div>
                  ))}
                  {/* Mini calendar days */}
                  {monthDays.map((day, index) => {
                    if (!day) {
                      return <div key={`empty-${monthIndex}-${index}`} />
                    }
                    
                    const dateKey = formatDateKey(currentYear, monthIndex, day)
                    const dayData = mockPerformanceData[dateKey]
                    
                    return (
                      <div key={day} className="aspect-square p-0.5">
                        {dayData ? (
                          <button
                            onClick={() => handleDayClick(dateKey)}
                            className={cn(
                              "w-full h-full rounded-sm min-h-[20px] sm:min-h-0 flex items-center justify-center text-white relative",
                              selectedKPI === 'all' 
                                ? getColorForPercentage(dayData.percentage)
                                : dayData.kpiStatus[selectedKPI] 
                                  ? 'bg-green-500 dark:bg-green-400' 
                                  : 'bg-red-500 dark:bg-red-400'
                            )}
                            title={`${monthName} ${day}: ${dayData.percentage}%`}
                          >
                            <span className="text-[8px] font-bold">
                              {selectedKPI === 'all' ? dayData.percentage : (dayData.kpiStatus[selectedKPI] ? 100 : 0)}
                            </span>
                          </button>
                        ) : (
                          <div className="w-full h-full rounded-sm bg-gray-200 dark:bg-slate-600 min-h-[20px] sm:min-h-0" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </>
    )
  }
  
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
        
        {/* Render appropriate view based on timeFilter */}
        {timeFilter === 'weekly' && renderWeekView()}
        {timeFilter === 'monthly' && renderMonthView()}
        {timeFilter === 'annual' && renderAnnualView()}
        
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
      
      {/* Month Overview Modal */}
      {selectedMonth !== null && (
        <MonthOverviewModal
          isOpen={selectedMonth !== null}
          onClose={() => setSelectedMonth(null)}
          monthIndex={selectedMonth}
          year={currentYear}
          monthData={getMonthData(selectedMonth)}
          monthName={monthNames[selectedMonth]}
          selectedKPI={selectedKPI}
        />
      )}
      
      {/* Annual Overview Modal */}
      {selectedYear !== null && (
        <AnnualOverviewModal
          isOpen={selectedYear !== null}
          onClose={() => setSelectedYear(null)}
          year={selectedYear}
          selectedKPI={selectedKPI}
        />
      )}
    </>
  )
}

// Month Overview Modal Component
interface MonthOverviewModalProps {
  isOpen: boolean
  onClose: () => void
  monthIndex: number
  year: number
  monthData: Array<{ day: number; data: DayPerformance | null }>
  monthName: string
  selectedKPI: KPIType | 'all'
}

function MonthOverviewModal({ 
  isOpen, 
  onClose, 
  monthIndex, 
  year, 
  monthData, 
  monthName,
  selectedKPI 
}: MonthOverviewModalProps) {
  const getColorForPercentage = (percentage: number): string => {
    if (percentage === 100) return 'bg-green-600 dark:bg-green-500'
    if (percentage >= 70) return 'bg-green-400 dark:bg-green-400'
    if (percentage >= 60) return 'bg-red-400 dark:bg-red-400'
    return 'bg-red-600 dark:bg-red-500'
  }
  
  const getColorForKPI = (isGreen: boolean): string => {
    return isGreen ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
  }
  
  // Calculate monthly statistics
  const stats = monthData.reduce((acc, { data }) => {
    if (data) {
      if (selectedKPI === 'all') {
        acc.total += data.percentage
        acc.count++
        if (data.percentage === 100) acc.perfect++
        else if (data.percentage >= 70) acc.good++
        else if (data.percentage >= 60) acc.warning++
        else acc.poor++
      } else {
        if (data.kpiStatus[selectedKPI]) {
          acc.green++
        } else {
          acc.red++
        }
        acc.count++
      }
    }
    return acc
  }, { total: 0, count: 0, perfect: 0, good: 0, warning: 0, poor: 0, green: 0, red: 0 })
  
  const average = stats.count > 0 ? Math.round(stats.total / stats.count) : 0
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {monthName} {year} Performance
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Monthly Summary</h3>
            {selectedKPI === 'all' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Performance</p>
                  <p className="text-2xl font-bold">{average}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Days Tracked</p>
                  <p className="text-2xl font-bold">{stats.count}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Performance Breakdown</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-600 dark:bg-green-500 rounded"></div>
                      <span className="text-sm">Perfect (100%): {stats.perfect} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                      <span className="text-sm">Good (70-99%): {stats.good} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-400 rounded"></div>
                      <span className="text-sm">Warning (60-69%): {stats.warning} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-600 dark:bg-red-500 rounded"></div>
                      <span className="text-sm">Poor (0-59%): {stats.poor} days</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Target Met</p>
                  <p className="text-2xl font-bold text-green-600">{stats.green} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Target Missed</p>
                  <p className="text-2xl font-bold text-red-600">{stats.red} days</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Daily Grid */}
          <div>
            <h3 className="font-semibold mb-3">Daily Performance</h3>
            <div className="grid grid-cols-7 gap-2">
              {monthData.map(({ day, data }) => {
                if (!data) {
                  return (
                    <div key={day} className="aspect-square flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded-lg">
                      <span className="text-xs text-gray-400">{day}</span>
                    </div>
                  )
                }
                
                const colorClass = selectedKPI === 'all' 
                  ? getColorForPercentage(data.percentage)
                  : getColorForKPI(data.kpiStatus[selectedKPI])
                
                return (
                  <button
                    key={day}
                    onClick={() => {
                      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                      onClose()
                      // This will trigger the day details modal
                      setTimeout(() => {
                        const event = new CustomEvent('showDayDetails', { detail: { dateKey, data } })
                        window.dispatchEvent(event)
                      }, 300)
                    }}
                    className={cn(
                      "aspect-square rounded-lg flex flex-col items-center justify-center text-white transition-transform hover:scale-105",
                      colorClass
                    )}
                  >
                    <span className="text-sm font-bold">{day}</span>
                    {selectedKPI === 'all' && (
                      <span className="text-xs">{data.percentage}%</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Annual Overview Modal Component
interface AnnualOverviewModalProps {
  isOpen: boolean
  onClose: () => void
  year: number
  selectedKPI: KPIType | 'all'
}

function AnnualOverviewModal({ 
  isOpen, 
  onClose, 
  year,
  selectedKPI 
}: AnnualOverviewModalProps) {
  const getColorForPercentage = (percentage: number): string => {
    if (percentage === 100) return 'bg-green-600 dark:bg-green-500'
    if (percentage >= 70) return 'bg-green-400 dark:bg-green-400'
    if (percentage >= 60) return 'bg-red-400 dark:bg-red-400'
    return 'bg-red-600 dark:bg-red-500'
  }
  
  const getColorForKPI = (isGreen: boolean): string => {
    return isGreen ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'
  }
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  // Calculate annual statistics by month
  const annualData = monthNames.map((monthName, monthIndex) => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
    let monthTotal = 0
    let monthCount = 0
    let monthGreen = 0
    let monthRed = 0
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      const dayData = mockPerformanceData[dateKey]
      
      if (dayData) {
        if (selectedKPI === 'all') {
          monthTotal += dayData.percentage
          monthCount++
        } else {
          if (dayData.kpiStatus[selectedKPI]) {
            monthGreen++
          } else {
            monthRed++
          }
          monthCount++
        }
      }
    }
    
    const monthAverage = monthCount > 0 ? Math.round(monthTotal / monthCount) : 0
    
    return {
      name: monthName,
      average: monthAverage,
      count: monthCount,
      green: monthGreen,
      red: monthRed
    }
  })
  
  // Calculate overall annual stats
  const overallStats = annualData.reduce((acc, month) => {
    if (selectedKPI === 'all') {
      acc.total += month.average * month.count
      acc.count += month.count
    } else {
      acc.green += month.green
      acc.red += month.red
      acc.count += month.count
    }
    return acc
  }, { total: 0, count: 0, green: 0, red: 0 })
  
  const overallAverage = selectedKPI === 'all' && overallStats.count > 0 
    ? Math.round(overallStats.total / overallStats.count) 
    : 0
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {year} Annual Performance Overview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Annual Summary */}
          <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-6">
            <h3 className="font-semibold mb-4 text-lg">Annual Summary</h3>
            {selectedKPI === 'all' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Overall Average</p>
                  <p className="text-3xl font-bold text-blue-600">{overallAverage}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Days Tracked</p>
                  <p className="text-3xl font-bold">{overallStats.count}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Best Month</p>
                  <p className="text-xl font-bold text-green-600">
                    {annualData.reduce((best, month) => 
                      month.average > best.average ? month : best, 
                      { name: '', average: 0 }
                    ).name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Target Met</p>
                  <p className="text-3xl font-bold text-green-600">{overallStats.green} days</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Target Missed</p>
                  <p className="text-3xl font-bold text-red-600">{overallStats.red} days</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {overallStats.count > 0 ? Math.round((overallStats.green / overallStats.count) * 100) : 0}%
                  </p>
                </div>
              </div>
            )}
          </div>
          
          {/* Monthly Performance Grid */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Monthly Performance</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {annualData.map((month, index) => {
                const colorClass = selectedKPI === 'all' 
                  ? getColorForPercentage(month.average)
                  : getColorForKPI(month.green > month.red)
                
                return (
                  <div
                    key={index}
                    className={cn(
                      "rounded-lg p-4 text-white text-center transition-transform hover:scale-105",
                      colorClass
                    )}
                  >
                    <h4 className="font-semibold text-lg mb-2">{month.name}</h4>
                    {selectedKPI === 'all' ? (
                      <>
                        <p className="text-2xl font-bold">{month.average}%</p>
                        <p className="text-xs opacity-90">{month.count} days tracked</p>
                      </>
                    ) : (
                      <>
                        <p className="text-lg font-bold">{month.green}/{month.count}</p>
                        <p className="text-xs opacity-90">targets met</p>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* KPI Performance Summary */}
          {selectedKPI === 'all' && (
            <div>
              <h3 className="font-semibold mb-4 text-lg">KPI Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ALL_KPIS.map((kpiType) => {
                  // Calculate success rate for this KPI across the year
                  const kpiStats = Object.keys(mockPerformanceData).reduce((acc, dateKey) => {
                    if (dateKey.startsWith(`${year}-`)) {
                      const data = mockPerformanceData[dateKey]
                      if (data.kpiStatus[kpiType]) {
                        acc.success++
                      }
                      acc.total++
                    }
                    return acc
                  }, { success: 0, total: 0 })
                  
                  const successRate = kpiStats.total > 0 ? Math.round((kpiStats.success / kpiStats.total) * 100) : 0
                  
                  return (
                    <div key={kpiType} className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                      <h4 className="font-medium text-sm mb-2">{KPI_NAMES[kpiType]}</h4>
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full",
                          successRate >= 70 ? 'bg-green-500' : successRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        )} />
                        <span className="font-semibold">{successRate}%</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          ({kpiStats.success}/{kpiStats.total} days)
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}