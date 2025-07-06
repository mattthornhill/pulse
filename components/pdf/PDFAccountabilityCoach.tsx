import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles, BRAND_COLORS } from './PDFStyles'
import { KPIData } from '@/types/dashboard'

interface PDFAccountabilityCoachProps {
  kpiData: KPIData[]
  type: 'weekly' | 'monthly' | 'annual'
}

export const PDFAccountabilityCoach: React.FC<PDFAccountabilityCoachProps> = ({ kpiData, type }) => {
  const redKPIs = kpiData.filter(kpi => kpi.status === 'red')
  const criticalKPIs = redKPIs.slice(0, 3) // Focus on top 3 critical issues
  
  const getTimeframe = () => {
    switch (type) {
      case 'weekly': return 'this week'
      case 'monthly': return 'this month'
      case 'annual': return 'this year'
    }
  }
  
  const getActionItems = (kpi: KPIData) => {
    // Generate specific action items based on KPI type
    const actions: Record<string, string[]> = {
      'Total Revenue': [
        'Review and adjust pricing strategy for high-demand services',
        'Implement upselling training for technicians',
        'Launch targeted marketing campaign for underperforming service areas'
      ],
      'Profit Margin': [
        'Conduct cost analysis on top 3 expense categories',
        'Negotiate better rates with primary suppliers',
        'Implement efficiency improvements in routing and scheduling'
      ],
      'Call-to-Booking Ratio': [
        'Review and update call scripts with booking-focused language',
        'Implement daily huddles to review conversion techniques',
        'Set up mystery shopping program to identify gaps'
      ],
      'Labor Cost/Hour': [
        'Analyze overtime patterns and adjust scheduling',
        'Review technician productivity metrics',
        'Implement time-tracking improvements'
      ],
      'Average Ticket': [
        'Train technicians on presenting maintenance agreements',
        'Review and optimize service pricing',
        'Implement inspection checklist to identify additional service needs'
      ],
      'Capacity Utilization': [
        'Review scheduling efficiency and identify gaps',
        'Implement demand-based scheduling',
        'Cross-train technicians to handle multiple service types'
      ]
    }
    
    return actions[kpi.name] || [
      `Analyze root causes for ${kpi.name} underperformance`,
      `Set up daily tracking and review process`,
      `Implement improvement plan with weekly milestones`
    ]
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Your Accountability Coach</Text>
      
      <View style={{ marginBottom: 20 }}>
        <Text style={[styles.sectionSubtitle, { fontSize: 16, marginBottom: 15 }]}>
          🎯 Focus Areas for {getTimeframe()}
        </Text>
        
        {criticalKPIs.length > 0 ? (
          <>
            <Text style={[styles.tableCell, { marginBottom: 15 }]}>
              Based on your performance data, here are the {criticalKPIs.length} critical areas requiring immediate attention:
            </Text>
            
            {criticalKPIs.map((kpi, index) => (
              <View key={kpi.id} style={[
                styles.accountabilitySection,
                { 
                  backgroundColor: kpi.status === 'red' ? '#FEE2E2' : '#FEF3C7',
                  borderColor: kpi.status === 'red' ? '#F87171' : '#FCD34D',
                  marginBottom: 15
                }
              ]}>
                <Text style={[styles.accountabilityTitle, { 
                  color: kpi.status === 'red' ? '#DC2626' : '#92400E',
                  marginBottom: 8
                }]}>
                  {index + 1}. {kpi.name} - Currently at {kpi.unit === '$' && '$'}{kpi.value.toLocaleString()}{kpi.unit === '%' && '%'}
                </Text>
                <Text style={[styles.tableCell, { 
                  marginBottom: 8, 
                  color: kpi.status === 'red' ? '#DC2626' : '#92400E',
                  fontWeight: 'bold'
                }]}>
                  {Math.abs(((kpi.value - (kpi.target?.value || 0)) / (kpi.target?.value || 1)) * 100).toFixed(1)}% below target
                </Text>
                
                <Text style={[styles.tableCell, { fontWeight: 'bold', marginBottom: 6 }]}>
                  Recommended Actions:
                </Text>
                {getActionItems(kpi).map((action, actionIndex) => (
                  <Text key={actionIndex} style={[styles.accountabilityItem, {
                    color: kpi.status === 'red' ? '#7F1D1D' : '#78350F'
                  }]}>
                    • {action}
                  </Text>
                ))}
              </View>
            ))}
          </>
        ) : (
          <View style={[styles.accountabilitySection, { backgroundColor: '#D1FAE5', borderColor: '#10B981' }]}>
            <Text style={[styles.accountabilityTitle, { color: '#065F46', marginBottom: 10 }]}>
              🎉 Congratulations! All KPIs are meeting or exceeding targets.
            </Text>
            <Text style={[styles.tableCell, { color: '#065F46' }]}>
              Focus on maintaining this excellent performance and look for opportunities to:
            </Text>
            <Text style={[styles.accountabilityItem, { color: '#065F46' }]}>• Share best practices with other teams</Text>
            <Text style={[styles.accountabilityItem, { color: '#065F46' }]}>• Document successful processes for consistency</Text>
            <Text style={[styles.accountabilityItem, { color: '#065F46' }]}>• Set stretch goals for continued growth</Text>
          </View>
        )}
      </View>
      
      
      <Text style={styles.pageNumber}>6</Text>
    </Page>
  )
}