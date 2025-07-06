import { supabase } from './supabase'
import { 
  MonthlyTargetTemplate, 
  MonthlyTargetAssignment, 
  TimeFilter, 
  KPIType,
  TargetCalculationPreferences,
  CompanySettings 
} from '@/types/dashboard'
import { 
  calculateTargetsFromTemplate, 
  getTargetForPeriod, 
  getTemplateForMonth,
  calculateYTDTargets 
} from './target-calculations'

export class TargetsService {
  /**
   * Get company settings including target calculation preferences
   */
  static async getCompanySettings(): Promise<CompanySettings | null> {
    try {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .single()
      
      if (error && error.code !== 'PGRST116') { // Not found error
        throw error
      }
      
      return data ? {
        id: data.id,
        companyName: data.company_name,
        kpiTargets: data.kpi_targets,
        targetCalculationPreferences: data.target_calculation_preferences,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      } : null
    } catch (error) {
      console.error('Error fetching company settings:', error)
      return null
    }
  }

  /**
   * Get all target templates
   */
  static async getTargetTemplates(): Promise<MonthlyTargetTemplate[]> {
    try {
      const { data, error } = await supabase
        .from('monthly_target_templates')
        .select('*')
        .order('name')
      
      if (error) throw error
      
      return data.map(template => ({
        id: template.id,
        name: template.name,
        description: template.description,
        kpiTargets: template.kpi_targets,
        createdAt: new Date(template.created_at),
        updatedAt: new Date(template.updated_at)
      }))
    } catch (error) {
      console.error('Error fetching target templates:', error)
      return []
    }
  }

  /**
   * Get target assignments for a specific year
   */
  static async getTargetAssignments(year: number): Promise<MonthlyTargetAssignment[]> {
    try {
      const { data, error } = await supabase
        .from('monthly_target_assignments')
        .select(`
          *,
          template:monthly_target_templates(*)
        `)
        .eq('year', year)
        .order('month')
      
      if (error) throw error
      
      return data.map(assignment => ({
        id: assignment.id,
        templateId: assignment.template_id,
        month: assignment.month,
        year: assignment.year,
        assignedAt: new Date(assignment.assigned_at),
        template: assignment.template ? {
          id: assignment.template.id,
          name: assignment.template.name,
          description: assignment.template.description,
          kpiTargets: assignment.template.kpi_targets,
          createdAt: new Date(assignment.template.created_at),
          updatedAt: new Date(assignment.template.updated_at)
        } : undefined
      }))
    } catch (error) {
      console.error('Error fetching target assignments:', error)
      return []
    }
  }

  /**
   * Get current targets for a specific time period
   */
  static async getCurrentTargets(
    timeFilter: TimeFilter,
    date: Date = new Date()
  ): Promise<Record<KPIType, number> | null> {
    try {
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      
      console.log(`🎯 Getting targets for ${timeFilter} - Month: ${month}, Year: ${year}`)
      
      // Get assignments for current year
      const assignments = await this.getTargetAssignments(year)
      console.log(`📋 Found ${assignments.length} assignments for ${year}`)
      
      // Get templates
      const templates = await this.getTargetTemplates()
      console.log(`📊 Found ${templates.length} templates`)
      
      // Get company settings for calculation preferences
      const settings = await this.getCompanySettings()
      const rawPreferences = settings?.targetCalculationPreferences || {
        monthly_to_weekly_factor: 4.33,
        monthly_to_daily_factor: 30
      }
      
      // Convert database snake_case keys to camelCase for the calculation functions
      const preferences = {
        monthlyToWeeklyFactor: rawPreferences.monthly_to_weekly_factor || 4.33,
        monthlyToDailyFactor: rawPreferences.monthly_to_daily_factor || 30
      }
      console.log(`⚙️ Using preferences:`, preferences)
      
      // Find template for current month
      const template = getTemplateForMonth(templates, assignments, month, year)
      
      if (!template) {
        console.warn(`❌ No template found for month ${month}, year ${year}`)
        return null
      }
      
      console.log(`✅ Found template: ${template.name}`, template.kpiTargets)
      
      // Calculate targets for the specified time period
      const targets: Record<KPIType, number> = {} as Record<KPIType, number>
      
      Object.entries(template.kpiTargets).forEach(([kpiType, monthlyTarget]) => {
        const kpi = kpiType as KPIType
        const calculatedTarget = getTargetForPeriod(monthlyTarget, timeFilter, preferences)
        targets[kpi] = calculatedTarget
        console.log(`📈 ${kpi}: ${monthlyTarget} (monthly) → ${calculatedTarget} (${timeFilter})`)
      })
      
      return targets
    } catch (error) {
      console.error('Error getting current targets:', error)
      return null
    }
  }

  /**
   * Get year-to-date targets
   */
  static async getYTDTargets(year: number = new Date().getFullYear()): Promise<Record<KPIType, number> | null> {
    try {
      const currentMonth = new Date().getMonth() + 1
      
      // Get assignments and templates
      const assignments = await this.getTargetAssignments(year)
      const templates = await this.getTargetTemplates()
      
      // Get company settings
      const settings = await this.getCompanySettings()
      const rawPreferences = settings?.targetCalculationPreferences || {
        monthly_to_weekly_factor: 4.33,
        monthly_to_daily_factor: 30
      }
      
      // Convert database snake_case keys to camelCase for the calculation functions
      const preferences = {
        monthlyToWeeklyFactor: rawPreferences.monthly_to_weekly_factor || 4.33,
        monthlyToDailyFactor: rawPreferences.monthly_to_daily_factor || 30
      }
      
      return calculateYTDTargets(templates, assignments, year, currentMonth, preferences)
    } catch (error) {
      console.error('Error calculating YTD targets:', error)
      return null
    }
  }

  /**
   * Create a new target template
   */
  static async createTargetTemplate(
    name: string,
    kpiTargets: Record<KPIType, number>,
    description?: string
  ): Promise<MonthlyTargetTemplate | null> {
    try {
      const { data, error } = await supabase
        .from('monthly_target_templates')
        .insert([{
          name,
          description,
          kpi_targets: kpiTargets
        }])
        .select()
        .single()
      
      if (error) throw error
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        kpiTargets: data.kpi_targets,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      }
    } catch (error) {
      console.error('Error creating target template:', error)
      return null
    }
  }

  /**
   * Update a target template
   */
  static async updateTargetTemplate(
    id: string,
    name: string,
    kpiTargets: Record<KPIType, number>,
    description?: string
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('monthly_target_templates')
        .update({
          name,
          description,
          kpi_targets: kpiTargets
        })
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating target template:', error)
      return false
    }
  }

  /**
   * Delete a target template
   */
  static async deleteTargetTemplate(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('monthly_target_templates')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting target template:', error)
      return false
    }
  }

  /**
   * Assign template to months
   */
  static async assignTemplateToMonths(
    templateId: string,
    monthsAndYears: Array<{ month: number; year: number }>
  ): Promise<boolean> {
    try {
      // Remove existing assignments for these months/years
      const deletePromises = monthsAndYears.map(({ month, year }) =>
        supabase
          .from('monthly_target_assignments')
          .delete()
          .eq('month', month)
          .eq('year', year)
      )
      
      await Promise.all(deletePromises)
      
      // Add new assignments
      const assignments = monthsAndYears.map(({ month, year }) => ({
        template_id: templateId,
        month,
        year
      }))
      
      const { error } = await supabase
        .from('monthly_target_assignments')
        .insert(assignments)
      
      if (error) throw error
      return true
    } catch (error) {
      console.error('Error assigning template to months:', error)
      return false
    }
  }

  /**
   * Update company settings
   */
  static async updateCompanySettings(
    companyName?: string,
    targetCalculationPreferences?: TargetCalculationPreferences
  ): Promise<boolean> {
    try {
      // First try to get existing settings
      const existing = await this.getCompanySettings()
      
      const updateData: any = {}
      if (companyName !== undefined) updateData.company_name = companyName
      if (targetCalculationPreferences !== undefined) {
        updateData.target_calculation_preferences = targetCalculationPreferences
      }
      
      if (existing) {
        // Update existing
        const { error } = await supabase
          .from('company_settings')
          .update(updateData)
          .eq('id', existing.id)
        
        if (error) throw error
      } else {
        // Create new
        const { error } = await supabase
          .from('company_settings')
          .insert([updateData])
        
        if (error) throw error
      }
      
      return true
    } catch (error) {
      console.error('Error updating company settings:', error)
      return false
    }
  }

  /**
   * Get target achievement percentage for a KPI
   */
  static getTargetAchievement(actualValue: number, targetValue: number): number {
    if (targetValue === 0) return 0
    return Math.round((actualValue / targetValue) * 100)
  }

  /**
   * Check if a KPI is on target
   */
  static isOnTarget(actualValue: number, targetValue: number, tolerance: number = 5): boolean {
    if (targetValue === 0) return false
    const achievement = this.getTargetAchievement(actualValue, targetValue)
    return achievement >= (100 - tolerance)
  }
}