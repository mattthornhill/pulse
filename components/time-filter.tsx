'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TimeFilter as TimeFilterType } from '@/types/dashboard'

interface TimeFilterProps {
  value: TimeFilterType
  onChange: (value: TimeFilterType) => void
}

export function TimeFilter({ value, onChange }: TimeFilterProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as TimeFilterType)}>
      <TabsList className="grid w-full grid-cols-4 bg-gray-100 dark:bg-slate-800 p-1">
        <TabsTrigger 
          value="daily"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 text-xs md:text-sm px-2 md:px-3 transition-all"
        >
          <span className="hidden sm:inline">Daily</span>
          <span className="sm:hidden">D</span>
        </TabsTrigger>
        <TabsTrigger 
          value="weekly"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 text-xs md:text-sm px-2 md:px-3 transition-all"
        >
          <span className="hidden sm:inline">Weekly</span>
          <span className="sm:hidden">W</span>
        </TabsTrigger>
        <TabsTrigger 
          value="monthly"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 text-xs md:text-sm px-2 md:px-3 transition-all"
        >
          <span className="hidden sm:inline">Monthly</span>
          <span className="sm:hidden">M</span>
        </TabsTrigger>
        <TabsTrigger 
          value="annual"
          className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-white text-gray-600 dark:text-gray-400 text-xs md:text-sm px-2 md:px-3 transition-all"
        >
          <span className="hidden sm:inline">Annual</span>
          <span className="sm:hidden">A</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}