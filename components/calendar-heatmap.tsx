'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarHeatmapProps {
  timeFilter: 'weekly' | 'monthly' | 'annual'
}

// Mock data - in production, this would come from your database
// Each key is a date string (YYYY-MM-DD), value is the percentage of KPIs hit
const mockPerformanceData: Record<string, number> = {
  '2024-06-01': 100,
  '2024-06-02': 85,
  '2024-06-03': 70,
  '2024-06-04': 60,
  '2024-06-05': 45,
  '2024-06-06': 0,
  '2024-06-07': 90,
  '2024-06-08': 100,
  '2024-06-09': 75,
  '2024-06-10': 80,
  '2024-06-11': 65,
  '2024-06-12': 100,
  '2024-06-13': 95,
  '2024-06-14': 70,
  '2024-06-15': 85,
  '2024-06-16': 60,
  '2024-06-17': 100,
  '2024-06-18': 90,
  '2024-06-19': 75,
  '2024-06-20': 100,
  '2024-06-21': 85,
  '2024-06-22': 95,
}

export function CalendarHeatmap({ timeFilter }: CalendarHeatmapProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  
  const getColorForPercentage = (percentage: number): string => {
    if (percentage === 100) return 'bg-green-600 dark:bg-green-500' // Dark green
    if (percentage >= 70) return 'bg-green-400 dark:bg-green-400' // Light green
    if (percentage >= 60) return 'bg-red-400 dark:bg-red-400' // Light red
    return 'bg-red-600 dark:bg-red-500' // Dark red (0-59%)
  }
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    const days = []
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add all days in month
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
  
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const days = getDaysInMonth(currentDate)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 border border-gray-200 dark:border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-200">Performance Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <span className="text-lg font-medium text-gray-700 dark:text-gray-300 min-w-[140px] text-center">
            {monthYear}
          </span>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="mb-6">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }
            
            const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
            const performance = mockPerformanceData[dateKey]
            const hasData = performance !== undefined
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()
            
            return (
              <div
                key={day}
                className={cn(
                  "aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all cursor-pointer group relative",
                  hasData ? getColorForPercentage(performance) : "bg-gray-100 dark:bg-slate-700",
                  hasData ? "text-white hover:opacity-80" : "text-gray-600 dark:text-gray-400",
                  isToday && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800"
                )}
                title={hasData ? `${performance}% KPIs achieved` : 'No data'}
              >
                <span className="relative z-10">{day}</span>
                {hasData && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                    <span className="text-white text-xs font-bold">{performance}%</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      
      {/* Legend */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <div className="flex items-center justify-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 dark:bg-red-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">0-59%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">60-69%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">70-99%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 dark:bg-green-500 rounded"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">100%</span>
          </div>
        </div>
      </div>
    </div>
  )
}