'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Settings, Target, Palette } from 'lucide-react'
import { MonthlyTargetManager } from './monthly-target-manager'

interface DashboardSettingsProps {
  trigger?: React.ReactNode
}

export const DashboardSettings: React.FC<DashboardSettingsProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('targets')

  const defaultTrigger = (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center gap-2"
    >
      <Settings className="w-4 h-4" />
      Settings
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Dashboard Settings
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="targets" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Targets
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="targets" className="mt-4">
            <div className="border rounded-lg p-1">
              <MonthlyTargetManager onClose={() => setIsOpen(false)} />
            </div>
          </TabsContent>


          <TabsContent value="appearance" className="mt-4 space-y-4">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800">
              <h3 className="text-lg font-semibold mb-4">Dashboard Appearance</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Theme
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    KPI Card Size
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                    <option value="compact">Compact</option>
                    <option value="standard">Standard</option>
                    <option value="large">Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Default Time Filter
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-blue-600 dark:accent-blue-400" />
                    Show trend indicators
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-blue-600 dark:accent-blue-400" />
                    Show performance score
                  </label>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="general" className="mt-4 space-y-4">
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800">
              <h3 className="text-lg font-semibold mb-4">General Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Your Company Name" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Time Zone
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Business Hours
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="time" 
                      defaultValue="08:00"
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                    <input 
                      type="time" 
                      defaultValue="17:00"
                      className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fiscal Year Start
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                    <option value="january">January</option>
                    <option value="april">April</option>
                    <option value="july">July</option>
                    <option value="october">October</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-blue-600 dark:accent-blue-400" />
                    Enable real-time updates
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2 accent-blue-600 dark:accent-blue-400" />
                    Send performance alerts
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-slate-800">
              <h3 className="text-lg font-semibold mb-4">Data & Privacy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Data Retention Period
                  </label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100">
                    <option value="1year">1 Year</option>
                    <option value="2years">2 Years</option>
                    <option value="3years">3 Years</option>
                    <option value="5years">5 Years</option>
                    <option value="indefinite">Indefinite</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Export All Data
                  </Button>
                  <Button variant="outline" className="w-full text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                    Delete All Data
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}