import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles, BRAND_COLORS } from './PDFStyles'
import { KPIData } from '@/types/dashboard'

interface PDFWinsAndOpportunitiesProps {
  kpiData: KPIData[]
}

export const PDFWinsAndOpportunities: React.FC<PDFWinsAndOpportunitiesProps> = ({ kpiData }) => {
  // Generate wins (KPIs exceeding targets)
  const wins = kpiData
    .filter(kpi => kpi.status === 'green' && kpi.change && kpi.change > 0)
    .slice(0, 5)
    .map(kpi => `${kpi.name} rose ${kpi.change}% from last period.`)
  
  // Generate opportunities (KPIs missing targets)
  const opportunities = kpiData
    .filter(kpi => kpi.status === 'red')
    .slice(0, 5)
    .map(kpi => `${kpi.name} ${kpi.change && kpi.change < 0 ? `declined ${Math.abs(kpi.change)}%` : 'missed target'}`)
  
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Part 1 – Wins</Text>
      
      {wins.length > 0 ? (
        wins.map((win, index) => (
          <View key={index} style={{ 
            backgroundColor: '#D1FAE5', 
            padding: 10, 
            marginBottom: 8, 
            borderRadius: 4,
            borderLeftWidth: 3,
            borderLeftColor: BRAND_COLORS.accent,
            borderLeftStyle: 'solid'
          }}>
            <Text style={{ fontSize: 11, color: '#065F46' }}>• {win}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.tableCell}>No significant wins to report this period.</Text>
      )}
      
      <View style={{ marginTop: 30 }}>
        <Text style={styles.sectionTitle}>Part 2 – Areas of Opportunity</Text>
        
        {opportunities.length > 0 ? (
          opportunities.map((opp, index) => (
            <View key={index} style={{ 
              backgroundColor: '#FEE2E2', 
              padding: 10, 
              marginBottom: 8, 
              borderRadius: 4,
              borderLeftWidth: 3,
              borderLeftColor: BRAND_COLORS.danger,
              borderLeftStyle: 'solid'
            }}>
              <Text style={{ fontSize: 11, color: '#7F1D1D' }}>• {opp}</Text>
            </View>
          ))
        ) : (
          <View style={{ 
            backgroundColor: '#D1FAE5', 
            padding: 10, 
            borderRadius: 4,
            borderLeftWidth: 3,
            borderLeftColor: BRAND_COLORS.accent,
            borderLeftStyle: 'solid'
          }}>
            <Text style={{ fontSize: 11, color: '#065F46', fontWeight: 'bold' }}>
              All KPIs are meeting or exceeding targets.
            </Text>
          </View>
        )}
      </View>
      
      <Text style={styles.pageNumber}>3</Text>
    </Page>
  )
}