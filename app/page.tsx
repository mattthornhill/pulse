'use client'

import { useState, useEffect } from 'react'
import { KPICard } from '@/components/kpi-card'
import { DashboardSummary } from '@/components/dashboard-summary'
import { TimeFilter } from '@/components/time-filter'
import { Button } from '@/components/ui/button'
import { FileText } from 'lucide-react'
import { TimeFilter as TimeFilterType, KPIData, DashboardSummary as DashboardSummaryType } from '@/types/dashboard'
import { ThemeToggle } from '@/components/theme-toggle'
import { MetabaseModal } from '@/components/metabase-modal'

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
  
  const summary: DashboardSummaryType = {
    greenCount: kpiData.filter(kpi => kpi.status === 'green').length,
    redCount: kpiData.filter(kpi => kpi.status === 'red').length,
    totalScore: kpiData.filter(kpi => kpi.status === 'green').length,
    percentage: Math.round((kpiData.filter(kpi => kpi.status === 'green').length / kpiData.length) * 100)
  }
  
  const handleRefresh = () => {
    setLastRefresh(new Date())
    // In production, refetch data from Supabase
  }
  
  const handleExportWeekly = () => {
    // Implement PDF export
    console.log('Exporting weekly agenda...')
  }
  
  const handleExportMonthly = () => {
    // Implement PDF export
    console.log('Exporting monthly agenda...')
  }
  
  const handleKPIClick = (kpiId: string) => {
    const kpi = kpiData.find(k => k.id === kpiId)
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
      <div className="bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:to-slate-800 shadow-sm dark:shadow-lg border-b border-gray-200 dark:border-transparent relative z-50">
        <div className="px-[3%] py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Profit Pulse AI</h1>
              <p className="text-gray-600 dark:text-slate-400 text-xs md:text-sm mt-1">Leadership Performance Intelligence</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4 relative z-50">
              <div className="bg-gray-50 dark:bg-white/10 backdrop-blur-sm rounded-xl p-1 flex-1 md:flex-initial">
                <TimeFilter value={timeFilter} onChange={setTimeFilter} />
              </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {kpiData.map((kpi) => (
            <KPICard 
              key={kpi.id} 
              data={kpi} 
              onClick={() => handleKPIClick(kpi.id)}
              isLarge={kpi.id === 'total_revenue' || kpi.id === 'gross_profit_margin'}
            />
          ))}
        </div>
      </div>
      
      {/* Additional content below the fold - only for weekly/monthly/annual views */}
      {timeFilter !== 'daily' && (
        <div className="px-[3%] pb-8">
          {/* Export Actions */}
          <div className="flex justify-center">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700 max-w-md w-full">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 text-center">Leadership Meeting Tools</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={handleExportWeekly}
                  className="bg-gray-800 hover:bg-gray-900 text-white rounded-xl transition-all"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Weekly Agenda
                </Button>
                <Button 
                  onClick={handleExportMonthly}
                  className="bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Monthly Agenda
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-200 dark:border-slate-700">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Performance Calendar</h3>
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-xl h-64 flex items-center justify-center text-slate-400 dark:text-slate-500 border-2 border-dashed border-slate-300 dark:border-slate-600">
                <div className="text-center">
                  <div className="text-6xl mb-2">📅</div>
                  <div className="text-lg font-medium">Calendar Heatmap</div>
                  <div className="text-sm">Coming Soon</div>
                </div>
              </div>
            </div>
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