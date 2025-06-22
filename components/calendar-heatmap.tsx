'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarHeatmapProps {
  timeFilter: 'weekly' | 'monthly' | 'annual'
}

// Generate random performance data for demonstration
// In production, this would come from your database
const generateMockData = (): Record<string, number> => {
  const data: Record<string, number> = {}
  const today = new Date()
  
  // Generate data for the past 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateKey = date.toISOString().split('T')[0]
    
    // Generate weighted random percentages
    // Make it more likely to have good performance
    const rand = Math.random()
    let percentage: number
    
    if (rand < 0.3) {
      // 30% chance of 100%
      percentage = 100
    } else if (rand < 0.5) {
      // 20% chance of 70-99%
      percentage = Math.floor(Math.random() * 30) + 70
    } else if (rand < 0.7) {
      // 20% chance of 60-69%
      percentage = Math.floor(Math.random() * 10) + 60
    } else {
      // 30% chance of 0-59%
      percentage = Math.floor(Math.random() * 60)
    }
    
    data[dateKey] = percentage
  }
  
  return data
}

const mockPerformanceData = generateMockData()

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
                  hasData ? "text-white" : "text-gray-600 dark:text-gray-400",
                  isToday && "ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-800"
                )}
              >
                <span className="relative z-10 group-hover:opacity-0 transition-opacity">{day}</span>
                {hasData && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-lg font-bold">{performance}%</span>
                    <span className="text-white text-[10px]">KPIs hit</span>
                  </div>
                )}
                {!hasData && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-gray-500 dark:text-gray-400 text-xs">No data</span>
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