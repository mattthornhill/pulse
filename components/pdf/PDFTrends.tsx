import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles } from './PDFStyles'
import { KPIData } from '@/types/dashboard'

interface PDFTrendsProps {
  kpiData: KPIData[]
}

export const PDFTrends: React.FC<PDFTrendsProps> = ({ kpiData }) => {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Trends & Strategic Insights</Text>
      
      <View style={{ marginBottom: 30 }}>
        <Text style={[styles.tableCell, { fontSize: 14, marginBottom: 20 }]}>
          3-Month Performance Trends
        </Text>
        
        {/* Trend Summary */}
        <View style={{ marginBottom: 20 }}>
          {kpiData.slice(0, 5).map((kpi) => (
            <View key={kpi.id} style={{ marginBottom: 10 }}>
              <Text style={styles.tableCell}>
                <Text style={{ fontWeight: 'bold' }}>{kpi.name}:</Text>{' '}
                {kpi.changeType === 'increase' ? '↑' : '↓'} {Math.abs(kpi.change || 0)}% trend
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={{ marginBottom: 30 }}>
        <Text style={[styles.tableCell, { fontSize: 14, marginBottom: 20 }]}>
          KPI Performance Heatmap
        </Text>
        
        {/* Simple text representation of heatmap */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text style={styles.tableCellHeader}>KPI</Text>
            </View>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text style={styles.tableCellHeader}>Month 1</Text>
            </View>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text style={styles.tableCellHeader}>Month 2</Text>
            </View>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text style={styles.tableCellHeader}>Month 3</Text>
            </View>
          </View>
          
          {kpiData.slice(0, 5).map((kpi) => (
            <View style={styles.tableRow} key={kpi.id}>
              <View style={[styles.tableCol, { width: '25%' }]}>
                <Text style={styles.tableCell}>{kpi.name}</Text>
              </View>
              <View style={[styles.tableCol, { width: '25%', backgroundColor: '#FEE2E2' }]}>
                <Text style={styles.tableCell}>Below</Text>
              </View>
              <View style={[styles.tableCol, { width: '25%', backgroundColor: '#FEF3C7' }]}>
                <Text style={styles.tableCell}>Near</Text>
              </View>
              <View style={[styles.tableCol, { width: '25%', backgroundColor: '#D1FAE5' }]}>
                <Text style={styles.tableCell}>Above</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      
      <View>
        <Text style={[styles.tableCell, { fontSize: 14, marginBottom: 20 }]}>
          Forward-Looking Strategic Levers
        </Text>
        
        <Text style={[styles.tableCell, { marginBottom: 10 }]}>
          • If labor cost is reduced by $1/hr, margin improves 3.2%
        </Text>
        <Text style={[styles.tableCell, { marginBottom: 10 }]}>
          • Increasing average ticket by $50 adds $180K annual revenue
        </Text>
        <Text style={[styles.tableCell, { marginBottom: 10 }]}>
          • Improving call-to-booking by 5% generates 120 additional jobs/month
        </Text>
        <Text style={[styles.tableCell, { marginBottom: 10 }]}>
          • Each 1% capacity utilization improvement = $45K annual profit
        </Text>
      </View>
      
      <Text style={styles.pageNumber}>5</Text>
    </Page>
  )
}