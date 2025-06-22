'use client'

import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react'
import { DashboardSummary as DashboardSummaryType } from '@/types/dashboard'

interface DashboardSummaryProps {
  summary: DashboardSummaryType
  lastRefresh: Date
  onRefresh: () => void
}

export function DashboardSummary({ summary, lastRefresh, onRefresh }: DashboardSummaryProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl px-4 sm:px-8 py-3 sm:py-5 border border-gray-200 dark:border-slate-700">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-3 sm:gap-6 md:gap-8 overflow-x-auto">
          {/* Green KPIs */}
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg px-3 sm:px-4 py-2 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-6 sm:h-8 bg-green-500 rounded-full"></div>
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">{summary.greenCount}</span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2 hidden sm:inline">ON TARGET</span>
              </div>
            </div>
          </div>
          
          {/* Red KPIs */}
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg px-3 sm:px-4 py-2 flex-shrink-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-2 h-6 sm:h-8 bg-red-500 rounded-full"></div>
              <div className="flex items-center">
                <span className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">{summary.redCount}</span>
                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 ml-2 hidden sm:inline">BELOW TARGET</span>
              </div>
            </div>
          </div>
          
          {/* Overall Score */}
          <div className="pl-4 sm:pl-8 border-l-2 border-gray-300 dark:border-gray-600 flex-shrink-0">
            <div className="flex items-baseline gap-1 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{summary.percentage}%</span>
              <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Performance Score</span>
            </div>
            <div className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0 sm:mt-1">
              {summary.totalScore} of 10 KPIs on target
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Auto-refresh indicator */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400 hidden md:flex">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
              <div className="relative h-2 w-2 bg-blue-500 rounded-full"></div>
            </div>
            <span className="text-xs">Live Updates</span>
          </div>
          
          {/* Manual refresh */}
          <button
            onClick={onRefresh}
            className="group p-2 md:p-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 rounded-xl transition-all duration-200 border border-gray-200 dark:border-slate-600"
            title="Refresh data"
          >
            <RefreshCw className="h-3 md:h-4 w-3 md:w-4 text-gray-700 group-hover:text-gray-900 dark:text-slate-300 dark:group-hover:text-white transition-colors" />
          </button>
          
          {/* Last update time */}
          <div className="text-right hidden sm:block">
            <div className="text-[10px] md:text-xs text-gray-500 dark:text-slate-500">Last refresh</div>
            <div className="text-xs md:text-sm font-medium text-gray-700 dark:text-slate-300">{formatTime(lastRefresh)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}