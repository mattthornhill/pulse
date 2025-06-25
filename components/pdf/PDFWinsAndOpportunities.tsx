import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles } from './PDFStyles'
import { KPIData } from '@/types/dashboard'

interface PDFWinsAndOpportunitiesProps {
  kpiData: KPIData[]
}

export const PDFWinsAndOpportunities: React.FC<PDFWinsAndOpportunitiesProps> = ({ kpiData }) => {
  // Generate wins (KPIs exceeding targets)
  const wins = kpiData
    .filter(kpi => kpi.status === 'green' && kpi.change && kpi.change > 0)
    .sort((a, b) => (b.change || 0) - (a.change || 0))
    .slice(0, 5)
    .map(kpi => {
      const targetDiff = kpi.target ? kpi.value - kpi.target.value : 0
      return `${kpi.name} rose ${kpi.change}% from last period. ${
        targetDiff > 0 ? `Exceeded goal by ${kpi.unit === '$' ? '$' : ''}${Math.abs(targetDiff).toLocaleString()}${kpi.unit === '%' ? '%' : ''}.` : ''
      }`
    })
  
  // Generate opportunities (KPIs missing targets)
  const opportunities = kpiData
    .filter(kpi => kpi.status === 'red')
    .map(kpi => ({
      name: kpi.name,
      issue: `${kpi.name} ${kpi.change && kpi.change < 0 ? `declined ${Math.abs(kpi.change)}%` : 'missed target'}`,
      hypothesis: getHypothesis(kpi.id),
      suggestion: getSuggestion(kpi.id)
    }))
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={{ marginBottom: 40 }}>
        <Text style={styles.sectionTitle}>Part 1 – Wins</Text>
        {wins.map((win, index) => (
          <Text key={index} style={styles.winItem}>• {win}</Text>
        ))}
        {wins.length === 0 && (
          <Text style={styles.tableCell}>No significant wins to report this period.</Text>
        )}
      </View>
      
      <View>
        <Text style={styles.sectionTitle}>Part 2 – Areas of Opportunity</Text>
        {opportunities.map((opp, index) => (
          <View key={index} style={{ marginBottom: 16 }}>
            <Text style={styles.opportunityItem}>• {opp.issue}</Text>
            <Text style={[styles.tableCell, { paddingLeft: 40, marginBottom: 4 }]}>
              Root cause: {opp.hypothesis}
            </Text>
            <Text style={[styles.tableCell, { paddingLeft: 40 }]}>
              Recommendation: {opp.suggestion}
            </Text>
          </View>
        ))}
        {opportunities.length === 0 && (
          <Text style={styles.tableCell}>All KPIs are meeting or exceeding targets.</Text>
        )}
      </View>
      
      <Text style={styles.pageNumber}>3</Text>
    </Page>
  )
}

function getHypothesis(kpiId: string): string {
  const hypotheses: Record<string, string> = {
    'call_to_booking_ratio': 'Decline likely due to new CSR scripts or training gaps',
    'average_ticket': 'Lower ticket values may indicate missing upsell opportunities',
    'capacity_utilization': 'Underutilization suggests scheduling inefficiencies',
    'labor_cost_per_hour': 'Rising costs may be due to overtime or inefficient routing',
    'jobs_completed': 'Fewer completions could indicate technical challenges or parts availability',
    'revenue_per_tech_per_day': 'Lower revenue per tech suggests productivity issues',
    'total_cost': 'Cost overruns may be from unplanned expenses or vendor price increases',
    'gross_profit_margin': 'Margin compression indicates rising costs or pricing pressure',
    'total_service_visits': 'Fewer visits may indicate demand softness or scheduling issues',
    'total_revenue': 'Revenue decline could be from lower volume or pricing'
  }
  return hypotheses[kpiId] || 'Performance variance requires further investigation'
}

function getSuggestion(kpiId: string): string {
  const suggestions: Record<string, string> = {
    'call_to_booking_ratio': 'Review call recordings and implement refresher training for CSRs',
    'average_ticket': 'Implement systematic upsell training and incentive program',
    'capacity_utilization': 'Optimize scheduling algorithms and review territory assignments',
    'labor_cost_per_hour': 'Analyze overtime patterns and optimize route planning',
    'jobs_completed': 'Review first-call completion rates and parts inventory levels',
    'revenue_per_tech_per_day': 'Implement productivity tracking and skills-based dispatching',
    'total_cost': 'Conduct vendor audit and implement stricter expense controls',
    'gross_profit_margin': 'Review pricing strategy and identify cost reduction opportunities',
    'total_service_visits': 'Increase marketing spend and review service area coverage',
    'total_revenue': 'Focus on customer retention and new customer acquisition'
  }
  return suggestions[kpiId] || 'Conduct root cause analysis and develop action plan'
}