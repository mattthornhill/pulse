'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit, Trash2, Save, X, CheckSquare, ChevronLeft, ChevronRight } from 'lucide-react'
import { MonthlyTargetTemplate, MonthlyTargetAssignment, KPIType } from '@/types/dashboard'
import { supabase } from '@/lib/supabase'

interface MonthlyTargetManagerProps {
  onClose?: () => void
}

const KPI_DISPLAY_NAMES: Record<KPIType, string> = {
  total_revenue: 'Total Revenue',
  total_service_visits: 'Service Visits',
  total_cost: 'Total Cost',
  gross_profit_margin: 'Gross Profit Margin',
  jobs_completed: 'Jobs Completed',
  call_to_booking_ratio: 'Call-to-Booking Ratio',
  average_ticket: 'Average Ticket',
  labor_cost_per_hour: 'Labor Cost/Hour',
  revenue_per_tech_per_day: 'Revenue/Tech/Day',
  capacity_utilization: 'Capacity Utilization'
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Seasonal presets for bulk assignment
const SEASON_PRESETS = {
  'High Season': [6, 7, 8, 12, 1], // Jun, Jul, Aug, Dec, Jan
  'Low Season': [4, 5, 9, 10],     // Apr, May, Sep, Oct
  'Spring': [3, 4, 5],             // Mar, Apr, May
  'Summer': [6, 7, 8],             // Jun, Jul, Aug
  'Fall': [9, 10, 11],             // Sep, Oct, Nov
  'Winter': [12, 1, 2]             // Dec, Jan, Feb
}

export const MonthlyTargetManager: React.FC<MonthlyTargetManagerProps> = ({ onClose }) => {
  const [templates, setTemplates] = useState<MonthlyTargetTemplate[]>([])
  const [assignments, setAssignments] = useState<MonthlyTargetAssignment[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MonthlyTargetTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('templates')
  
  // Bulk assignment state
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedMonths, setSelectedMonths] = useState<number[]>([])
  const [bulkTemplateId, setBulkTemplateId] = useState<string>('')
  
  // Year selection
  const currentYear = new Date().getFullYear()
  const [selectedYear, setSelectedYear] = useState(currentYear)

  useEffect(() => {
    loadTemplatesAndAssignments()
  }, [selectedYear]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadTemplatesAndAssignments = async () => {
    try {
      setLoading(true)
      
      // Load templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('monthly_target_templates')
        .select('*')
        .order('name')
      
      if (templatesError) throw templatesError
      
      // Load assignments for selected year
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('monthly_target_assignments')
        .select(`
          *,
          template:monthly_target_templates(*)
        `)
        .eq('year', selectedYear)
        .order('month')
      
      if (assignmentsError) throw assignmentsError
      
      // Map the data to proper format
      const mappedTemplates = (templatesData || []).map(t => ({
        id: t.id,
        name: t.name,
        description: t.description,
        kpiTargets: t.kpi_targets || {},
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at)
      }))
      
      const mappedAssignments = (assignmentsData || []).map(a => ({
        id: a.id,
        templateId: a.template_id,
        month: a.month,
        year: a.year,
        assignedAt: new Date(a.assigned_at),
        template: a.template ? {
          id: a.template.id,
          name: a.template.name,
          description: a.template.description,
          kpiTargets: a.template.kpi_targets || {},
          createdAt: new Date(a.template.created_at),
          updatedAt: new Date(a.template.updated_at)
        } : undefined
      }))
      
      setTemplates(mappedTemplates)
      setAssignments(mappedAssignments)
    } catch (error) {
      console.error('Error loading templates and assignments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = () => {
    setEditingTemplate({
      id: '',
      name: '',
      description: '',
      kpiTargets: {} as Record<KPIType, number>,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    setIsCreateModalOpen(true)
  }

  const handleEditTemplate = (template: MonthlyTargetTemplate) => {
    setEditingTemplate(template)
    setIsCreateModalOpen(true)
  }

  const handleSaveTemplate = async (template: MonthlyTargetTemplate) => {
    try {
      const templateData = {
        name: template.name,
        description: template.description,
        kpi_targets: template.kpiTargets
      }

      if (template.id) {
        // Update existing template
        const { error } = await supabase
          .from('monthly_target_templates')
          .update(templateData)
          .eq('id', template.id)
        
        if (error) throw error
      } else {
        // Create new template
        const { error } = await supabase
          .from('monthly_target_templates')
          .insert([templateData])
        
        if (error) throw error
      }

      setIsCreateModalOpen(false)
      setEditingTemplate(null)
      await loadTemplatesAndAssignments()
    } catch (error) {
      console.error('Error saving template:', error)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('monthly_target_templates')
        .delete()
        .eq('id', templateId)
      
      if (error) throw error
      
      await loadTemplatesAndAssignments()
    } catch (error) {
      console.error('Error deleting template:', error)
    }
  }

  const handleAssignTemplate = async (templateId: string, selectedMonths: number[]) => {
    try {
      // Remove existing assignments for selected months
      const { error: deleteError } = await supabase
        .from('monthly_target_assignments')
        .delete()
        .eq('year', selectedYear)
        .in('month', selectedMonths)
      
      if (deleteError) throw deleteError

      // If templateId is empty, we're just removing assignments
      if (templateId) {
        // Add new assignments
        const assignments = selectedMonths.map(month => ({
          template_id: templateId,
          month,
          year: selectedYear
        }))

        const { error: insertError } = await supabase
          .from('monthly_target_assignments')
          .insert(assignments)
        
        if (insertError) throw insertError
      }
      
      await loadTemplatesAndAssignments()
      return true
    } catch (error) {
      console.error('Error assigning template:', error)
      return false
    }
  }

  const getAssignedTemplateForMonth = (month: number) => {
    return assignments.find(a => a.month === month)
  }

  // Bulk assignment handlers
  const handleBulkModeToggle = (checked: boolean) => {
    setBulkMode(checked)
    if (!checked) {
      setSelectedMonths([])
      setBulkTemplateId('')
    }
  }

  const handleMonthSelect = (month: number) => {
    if (selectedMonths.includes(month)) {
      setSelectedMonths(selectedMonths.filter(m => m !== month))
    } else {
      setSelectedMonths([...selectedMonths, month])
    }
  }

  const handleSeasonPreset = (season: keyof typeof SEASON_PRESETS) => {
    setSelectedMonths(SEASON_PRESETS[season])
  }

  const handleSelectAll = () => {
    setSelectedMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  }

  const handleClearAll = () => {
    setSelectedMonths([])
  }

  const handleBulkAssign = async () => {
    if (!bulkTemplateId || selectedMonths.length === 0) return
    
    try {
      const success = await handleAssignTemplate(bulkTemplateId, selectedMonths)
      if (success) {
        setSelectedMonths([])
        setBulkTemplateId('')
        // Could add a success message here
      }
    } catch (error) {
      console.error('Error with bulk assignment:', error)
    }
  }

  if (loading) {
    return <div className="p-4">Loading...</div>
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Monthly Target Management</h2>
        <div className="flex gap-2">
          <Button onClick={handleCreateTemplate} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Template
          </Button>
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="assignments">Monthly Assignments</TabsTrigger>
          </TabsList>
          
          {activeTab === 'assignments' && (
            <div className="flex items-center gap-6">
              {/* Year Selector */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedYear(selectedYear - 1)
                    setSelectedMonths([])
                  }}
                  disabled={selectedYear <= currentYear}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="font-medium px-3 min-w-[60px] text-center">{selectedYear}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedYear(selectedYear + 1)
                    setSelectedMonths([])
                  }}
                  disabled={selectedYear >= currentYear + 5}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Bulk Mode Switch */}
              <div className="flex items-center gap-2">
                <Switch
                  id="bulk-mode"
                  checked={bulkMode}
                  onCheckedChange={handleBulkModeToggle}
                />
                <Label htmlFor="bulk-mode" className="cursor-pointer text-sm">
                  Bulk Mode
                </Label>
              </div>
            </div>
          )}
        </div>

        <TabsContent value="templates">
          <div className="grid gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="p-4 bg-gray-50 dark:bg-slate-900 border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{template.name}</h3>
                    {template.description && (
                      <p className="text-sm text-gray-600">{template.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTemplate(template)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <div className="space-y-6">
            {/* Bulk Assignment Controls - Only show when bulk mode is active */}
            {bulkMode && (
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <div className="space-y-4">
                  {/* Quick Selection Presets */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Quick Select:</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(SEASON_PRESETS).map((season) => (
                        <Button
                          key={season}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSeasonPreset(season as keyof typeof SEASON_PRESETS)}
                          className="text-xs"
                        >
                          {season}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        className="text-xs"
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleClearAll}
                        className="text-xs"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>

                  {/* Bulk Assignment Interface */}
                  {selectedMonths.length > 0 && (
                    <div className="flex items-center gap-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Assign Template to {selectedMonths.length} Selected Month{selectedMonths.length !== 1 ? 's' : ''}:
                        </label>
                        <select
                          className="w-full p-2 border rounded text-sm"
                          value={bulkTemplateId}
                          onChange={(e) => setBulkTemplateId(e.target.value)}
                        >
                          <option value="">Select a template...</option>
                          {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        onClick={handleBulkAssign}
                        disabled={!bulkTemplateId}
                        className="px-6"
                      >
                        Assign
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MONTHS.map((month, index) => {
                const monthNumber = index + 1
                const assignment = getAssignedTemplateForMonth(monthNumber)
                
                return (
                  <Card 
                    key={month} 
                    className={`p-4 transition-all ${
                      bulkMode && selectedMonths.includes(monthNumber) 
                        ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-950' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Checkbox for bulk mode */}
                        {bulkMode && (
                          <button
                            onClick={() => handleMonthSelect(monthNumber)}
                            className="flex items-center justify-center w-5 h-5 border-2 rounded transition-all hover:border-blue-500"
                          >
                            {selectedMonths.includes(monthNumber) && (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            )}
                          </button>
                        )}
                        
                        <div>
                          <h3 className="font-medium">{month} {selectedYear}</h3>
                          {assignment ? (
                            <Badge 
                              variant="secondary" 
                              className="mt-1 group cursor-pointer hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                              onClick={!bulkMode ? () => handleAssignTemplate('', [monthNumber]) : undefined}
                            >
                              <span>{assignment.template?.name}</span>
                              <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity inline-block" />
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="mt-1">
                              No template assigned
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Hide individual assignment button in bulk mode */}
                      {!bulkMode && (
                        <TemplateAssignmentDialog
                          month={monthNumber}
                          monthName={month}
                          templates={templates}
                          currentTemplateId={assignment?.templateId}
                          onAssign={(templateId) => handleAssignTemplate(templateId, [monthNumber])}
                        />
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <TemplateEditDialog
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setEditingTemplate(null)
        }}
        template={editingTemplate}
        onSave={handleSaveTemplate}
      />
    </div>
  )
}

interface TemplateEditDialogProps {
  isOpen: boolean
  onClose: () => void
  template: MonthlyTargetTemplate | null
  onSave: (template: MonthlyTargetTemplate) => void
}

const TemplateEditDialog: React.FC<TemplateEditDialogProps> = ({
  isOpen,
  onClose,
  template,
  onSave
}) => {
  const [editedTemplate, setEditedTemplate] = useState<MonthlyTargetTemplate | null>(null)

  useEffect(() => {
    if (template) {
      setEditedTemplate({
        ...template,
        kpiTargets: template.kpiTargets || ({} as Record<KPIType, number>)
      })
    }
  }, [template])

  const handleSave = () => {
    if (editedTemplate) {
      onSave(editedTemplate)
    }
  }

  if (!editedTemplate) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editedTemplate.id ? 'Edit Template' : 'Create Template'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={editedTemplate.name}
              onChange={(e) => setEditedTemplate({
                ...editedTemplate,
                name: e.target.value
              })}
              placeholder="e.g., Higher Revenue Month"
            />
          </div>

          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              value={editedTemplate.description || ''}
              onChange={(e) => setEditedTemplate({
                ...editedTemplate,
                description: e.target.value
              })}
              placeholder="Brief description of this template"
            />
          </div>

          <div>
            <Label>Monthly KPI Targets</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {Object.entries(KPI_DISPLAY_NAMES).map(([kpiType, displayName]) => (
                <div key={kpiType}>
                  <Label htmlFor={kpiType} className="text-sm">
                    {displayName}
                  </Label>
                  <Input
                    id={kpiType}
                    type="number"
                    value={editedTemplate.kpiTargets[kpiType as KPIType] || ''}
                    onChange={(e) => {
                      const value = e.target.value
                      setEditedTemplate({
                        ...editedTemplate,
                        kpiTargets: {
                          ...editedTemplate.kpiTargets,
                          [kpiType]: value === '' ? undefined : parseFloat(value)
                        }
                      })
                    }}
                    placeholder="Enter target value"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface TemplateAssignmentDialogProps {
  month: number
  monthName: string
  templates: MonthlyTargetTemplate[]
  currentTemplateId?: string
  onAssign: (templateId: string) => void
}

const TemplateAssignmentDialog: React.FC<TemplateAssignmentDialogProps> = ({
  month,
  monthName,
  templates,
  currentTemplateId,
  onAssign
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(currentTemplateId || '')

  const handleAssign = () => {
    if (selectedTemplateId) {
      onAssign(selectedTemplateId)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Plus className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Template to {monthName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Select Template</Label>
            <select
              className="w-full mt-1 p-2 border rounded"
              value={selectedTemplateId}
              onChange={(e) => setSelectedTemplateId(e.target.value)}
            >
              <option value="">No template</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setSelectedTemplateId('')}>
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedTemplateId}>
              Assign Template
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}