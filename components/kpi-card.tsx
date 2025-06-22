'use client'

import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react'
import { KPIData } from '@/types/dashboard'
import { cn } from '@/lib/utils'

interface KPICardProps {
  data: KPIData
  size?: 'standard' | 'large'
  onClick?: () => void
}

export function KPICard({ data, size = 'standard', onClick }: KPICardProps) {
  const isLarge = size === 'large'
  
  const formatValue = (value: number, unit?: string) => {
    if (unit === '$') {
      return `$${value.toLocaleString()}`
    }
    if (unit === '%') {
      return `${value}%`
    }
    return value.toLocaleString()
  }

  const getTrendIcon = () => {
    if (!data.changeType || data.changeType === 'neutral') {
      return <Minus className="h-3 w-3" />
    }
    if (data.changeType === 'increase') {
      return <TrendingUp className="h-3 w-3" />
    }
    return <TrendingDown className="h-3 w-3" />
  }

  const getStatusColor = () => {
    switch (data.status) {
      case 'green':
        return 'from-green-500 to-green-600'
      case 'red':
        return 'from-red-500 to-red-600'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const getCardBgColor = () => {
    switch (data.status) {
      case 'green':
        return 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-green-200 dark:border-green-800'
      case 'red':
        return 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/30 border-red-200 dark:border-red-800'
      default:
        return 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700'
    }
  }

  const getChangeColor = () => {
    if (data.status === 'green') return 'text-green-700 dark:text-green-400'
    if (data.status === 'red') return 'text-red-700 dark:text-red-400'
    return 'text-gray-700 dark:text-gray-400'
  }

  return (
    <div 
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "rounded-2xl border-2 p-6 shadow-sm hover:shadow-lg",
        "hover:-translate-y-1",
        getCardBgColor(),
        isLarge && "col-span-2 row-span-2"
      )}
      onClick={onClick}
    >
      {/* Chart Icon */}
      <div className="absolute top-4 right-4">
        <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
      </div>
      
      {/* KPI Name */}
      <div className="mb-4">
        <h3 className={cn(
          "font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider",
          isLarge ? "text-sm" : "text-xs"
        )}>
          {data.name}
        </h3>
      </div>
      
      {/* Main Value */}
      <div className={cn(
        "font-bold text-gray-900 dark:text-white mb-3",
        isLarge ? "text-5xl" : "text-3xl"
      )}>
        {formatValue(data.value, data.unit)}
      </div>
      
      {/* Change Indicator */}
      {data.change !== undefined && (
        <div className={cn("flex items-center gap-2 mb-3", getChangeColor())}>
          <div className="flex items-center gap-1 font-semibold">
            {getTrendIcon()}
            <span className="text-sm">{Math.abs(data.change)}%</span>
          </div>
          <span className="text-xs opacity-75 dark:opacity-60">vs {data.previousValue ? 'yesterday' : 'last period'}</span>
        </div>
      )}
      
      {/* Sparkline for large cards */}
      {data.sparklineData && isLarge && (
        <div className="mb-4">
          <div className="h-20 bg-white/50 dark:bg-black/20 rounded-lg flex items-end justify-around p-2 gap-1">
            {data.sparklineData.map((value, i) => (
              <div
                key={i}
                className={cn(
                  "flex-1 rounded-t transition-all duration-300",
                  data.status === 'green' ? 'bg-green-400' : 'bg-red-400'
                )}
                style={{
                  height: `${(value / Math.max(...(data.sparklineData || []))) * 100}%`,
                  opacity: 0.6 + (i / (data.sparklineData?.length || 1)) * 0.4
                }}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* Target Progress */}
      {data.target && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Target</span>
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {formatValue(data.target.value, data.unit)}
            </span>
          </div>
          <div className="relative h-2 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
            <div 
              className={cn(
                "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
                "bg-gradient-to-r",
                getStatusColor()
              )}
              style={{ width: `${Math.min((data.value / data.target.value) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
            {Math.round((data.value / data.target.value) * 100)}% achieved
          </div>
        </div>
      )}
    </div>
  )
}