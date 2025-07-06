'use client'

import { useState, useEffect } from 'react'
import { KPICard } from '@/components/kpi-card'
import { DashboardSummary } from '@/components/dashboard-summary'
import { TimeFilter } from '@/components/time-filter'
import { TimeFilter as TimeFilterType, KPIData, DashboardSummary as DashboardSummaryType, KPIType } from '@/types/dashboard'
import { ThemeToggle } from '@/components/theme-toggle'
import { MetabaseModal } from '@/components/metabase-modal'
import { CalendarHeatmap } from '@/components/calendar-heatmap'
import { DashboardSettings } from '@/components/dashboard-settings'
import { useTargets } from '@/hooks/use-targets'
import { cn } from '@/lib/utils'
import { PDFExportButton } from '@/components/pdf/PDFDocument'

// Mock data - in production, this would come from Supabase
const mockKPIData: KPIData[] = [
  {
    id: 'total_revenue',
    name: 'Total Revenue',
    value: 127430,
    previousValue: 117650,
    change: 8.3,
    changeType: 'increase',
    status: 'green',
    unit: '$',
    target: { type: 'fixed', value: 135000 },
    sparklineData: [110000, 115000, 117650, 120000, 125000, 127430]
  },
  {
    id: 'total_service_visits',
    name: 'Total Service Visits',
    value: 342,
    previousValue: 315,
    change: 8.6,
    changeType: 'increase',
    status: 'green',
    unit: '',
    target: { type: 'fixed', value: 350 },
    sparklineData: [300, 310, 315, 325, 335, 342]
  },
  {
    id: 'gross_profit_margin',
    name: 'Gross Profit Margin',
    value: 28.5,
    previousValue: 27.2,
    change: 4.8,
    changeType: 'increase',
    status: 'green',
    unit: '%',
    target: { type: 'benchmark', value: 25 }
  },
  {
    id: 'average_ticket',
    name: 'Average Ticket',
    value: 485,
    previousValue: 465,
    change: 4.3,
    changeType: 'increase',
    status: 'green',
    unit: '$',
    target: { type: 'fixed', value: 500 }
  },
  {
    id: 'total_cost',
    name: 'Total Cost',
    value: 91200,
    previousValue: 85400,
    change: 6.8,
    changeType: 'increase',
    status: 'red',
    unit: '$',
    target: { type: 'dynamic', value: 85000 }
  },
  {
    id: 'jobs_completed',
    name: 'Jobs Completed',
    value: 285,
    previousValue: 310,
    change: -8.1,
    changeType: 'decrease',
    status: 'red',
    unit: '',
    target: { type: 'fixed', value: 300 }
  },
  {
    id: 'call_to_booking_ratio',
    name: 'Call-to-Booking Ratio',
    value: 65,
    previousValue: 68,
    change: -4.4,
    changeType: 'decrease',
    status: 'red',
    unit: '%',
    target: { type: 'benchmark', value: 70 }
  },
  {
    id: 'labor_cost_per_hour',
    name: 'Labor Cost/Hour',
    value: 45.50,
    previousValue: 44.20,
    change: 2.9,
    changeType: 'increase',
    status: 'green',
    unit: '$',
    target: { type: 'fixed', value: 48 }
  },
  {
    id: 'revenue_per_tech_per_day',
    name: 'Revenue/Tech/Day',
    value: 750,
    previousValue: 720,
    change: 4.2,
    changeType: 'increase',
    status: 'green',
    unit: '$',
    target: { type: 'fixed', value: 700 }
  },
  {
    id: 'capacity_utilization',
    name: 'Capacity Utilization',
    value: 87,
    previousValue: 82,
    change: 6.1,
    changeType: 'increase',
    status: 'green',
    unit: '%',
    target: { type: 'benchmark', value: 85 }
  }
]

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>('daily')
  const [kpiData, setKpiData] = useState<KPIData[]>(mockKPIData)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedKPI, setSelectedKPI] = useState<KPIData | null>(null)
  
  // Load targets for current time filter
  const { targets, loading: targetsLoading } = useTargets(timeFilter)
  
  // Merge targets with KPI data
  const kpiDataWithTargets = kpiData.map(kpi => {
    const kpiType = kpi.id as KPIType
    const targetValue = targets?.[kpiType]
    
    if (targetValue && targetValue > 0) {
      // Update the target in the KPI data
      const updatedKpi = {
        ...kpi,
        target: {
          type: 'fixed' as const,
          value: targetValue
        }
      }
      
      // Recalculate status based on target achievement
      const achievement = (kpi.value / targetValue) * 100
      if (achievement >= 95) {
        updatedKpi.status = 'green'
      } else if (achievement >= 80) {
        updatedKpi.status = 'grey'
      } else {
        updatedKpi.status = 'red'
      }
      
      return updatedKpi
    }
    
    return kpi
  })
  
  const summary: DashboardSummaryType = {
    greenCount: kpiDataWithTargets.filter(kpi => kpi.status === 'green').length,
    redCount: kpiDataWithTargets.filter(kpi => kpi.status === 'red').length,
    totalScore: kpiDataWithTargets.filter(kpi => kpi.status === 'green').length,
    percentage: Math.round((kpiDataWithTargets.filter(kpi => kpi.status === 'green').length / kpiDataWithTargets.length) * 100)
  }
  
  const handleRefresh = () => {
    setLastRefresh(new Date())
    // In production, refetch data from Supabase
  }
  
  const getWeeklyDateRange = () => {
    const now = new Date()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - now.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    
    return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  }
  
  const getMonthlyDateRange = () => {
    const now = new Date()
    return now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  
  const getAnnualDateRange = () => {
    const now = new Date()
    return now.getFullYear().toString()
  }
  
  const handleKPIClick = (kpiId: string) => {
    const kpi = kpiDataWithTargets.find(k => k.id === kpiId)
    if (kpi) {
      setSelectedKPI(kpi)
      setModalOpen(true)
    }
  }
  
  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh()
    }, 15 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-slate-950 dark:via-gray-900 dark:to-slate-950">
      {/* Header */}
      <div className="bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 shadow-sm dark:shadow-lg border-b border-gray-200 dark:border-transparent">
        <div className="px-4 md:px-[3%] py-3 md:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Profit Pulse AI</h1>
              <p className="text-gray-600 dark:text-slate-400 text-[10px] sm:text-xs md:text-sm mt-0.5 md:mt-1">Leadership Performance Intelligence</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="rounded-xl flex-1 sm:flex-initial min-w-[200px] sm:min-w-0">
                <TimeFilter value={timeFilter} onChange={setTimeFilter} />
              </div>
              <DashboardSettings />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
      
      {/* Summary Bar */}
      <div className="px-[3%] pt-2 md:pt-4 pb-2">
        <DashboardSummary 
          summary={summary} 
          lastRefresh={lastRefresh} 
          onRefresh={handleRefresh} 
        />
      </div>
      
      {/* KPI Scorecard Grid */}
      <div className="px-[3%] py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiDataWithTargets.map((kpi, index) => (
            <div 
              key={kpi.id} 
              className={cn(
                index < 2 ? "md:col-span-2" : ""
              )}
            >
              <KPICard 
                data={kpi} 
                size={index < 2 ? "large" : "standard"}
                onClick={() => handleKPIClick(kpi.id)}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Additional content below the fold - only for weekly/monthly/annual views */}
      {timeFilter !== 'daily' && (
        <div className="px-[3%] pb-8">
          {/* Export Actions */}
          <div className="flex justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 max-w-xl w-full">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">Leadership Meeting Tools</h3>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <PDFExportButton 
                  type="weekly"
                  kpiData={kpiDataWithTargets}
                  dateRange={getWeeklyDateRange()}
                />
                <PDFExportButton 
                  type="monthly"
                  kpiData={kpiDataWithTargets}
                  dateRange={getMonthlyDateRange()}
                />
                <PDFExportButton 
                  type="annual"
                  kpiData={kpiDataWithTargets}
                  dateRange={getAnnualDateRange()}
                />
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <CalendarHeatmap timeFilter={timeFilter} />
          </div>
        </div>
      )}
      
      {/* Metabase Modal */}
      {selectedKPI && (
        <MetabaseModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false)
            setSelectedKPI(null)
          }}
          kpiId={selectedKPI.id}
          kpiName={selectedKPI.name}
        />
      )}
    </div>
  )
}