'use client'

import { X, Check } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { KPIType } from '@/types/dashboard'

interface DayPerformance {
  percentage: number
  kpiStatus: Record<KPIType, boolean>
}

interface KPIDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  date: string
  performance: DayPerformance
}

const KPI_DETAILS: Record<KPIType, { name: string; description: string }> = {
  total_revenue: {
    name: 'Total Revenue',
    description: 'Total revenue generated'
  },
  total_service_visits: {
    name: 'Service Visits',
    description: 'Number of service visits completed'
  },
  total_cost: {
    name: 'Total Costs',
    description: 'Total operational costs'
  },
  gross_profit_margin: {
    name: 'Profit Margin',
    description: 'Gross profit as percentage of revenue'
  },
  jobs_completed: {
    name: 'Jobs Completed',
    description: 'Number of jobs successfully completed'
  },
  call_to_booking_ratio: {
    name: 'Call-to-Booking Ratio',
    description: 'Percentage of calls converted to bookings'
  },
  average_ticket: {
    name: 'Average Ticket',
    description: 'Average revenue per service visit'
  },
  labor_cost_per_hour: {
    name: 'Labor Cost/Hour',
    description: 'Average labor cost per hour'
  },
  revenue_per_tech_per_day: {
    name: 'Revenue/Tech/Day',
    description: 'Average revenue per technician per day'
  },
  capacity_utilization: {
    name: 'Capacity Utilization',
    description: 'Percentage of available capacity utilized'
  }
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

export function KPIDetailsModal({ isOpen, onClose, date, performance }: KPIDetailsModalProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const greenCount = ALL_KPIS.filter(kpi => performance.kpiStatus[kpi]).length
  const redCount = ALL_KPIS.length - greenCount
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            KPI Performance Details
          </DialogTitle>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {formattedDate}
          </p>
        </DialogHeader>
        
        {/* Summary */}
        <div className="flex items-center justify-center gap-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200">
              {performance.percentage}%
            </div>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Overall Performance
            </p>
          </div>
          <div className="flex gap-4 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-500">
                {greenCount}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Met Target
              </p>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-500">
                {redCount}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Missed Target
              </p>
            </div>
          </div>
        </div>
        
        {/* KPI List */}
        <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
          <ul className="space-y-2">
            {ALL_KPIS.map(kpi => {
              const isGreen = performance.kpiStatus[kpi]
              const details = KPI_DETAILS[kpi]
              
              return (
                <li
                  key={kpi}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-colors",
                    isGreen 
                      ? "bg-green-50 dark:bg-green-900/20" 
                      : "bg-red-50 dark:bg-red-900/20"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                    isGreen
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  )}>
                    {isGreen ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={cn(
                      "font-semibold text-sm sm:text-base",
                      isGreen
                        ? "text-green-700 dark:text-green-400"
                        : "text-red-700 dark:text-red-400"
                    )}>
                      {details.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {details.description}
                    </p>
                  </div>
                  <div className={cn(
                    "text-xs sm:text-sm font-medium px-2 py-1 rounded",
                    isGreen
                      ? "text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40"
                      : "text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/40"
                  )}>
                    {isGreen ? 'Met' : 'Missed'}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}