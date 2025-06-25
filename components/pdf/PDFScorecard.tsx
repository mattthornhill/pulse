import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles } from './PDFStyles'
import { KPIData } from '@/types/dashboard'

interface PDFScorecardProps {
  kpiData: KPIData[]
  historicalData?: Record<string, number[]> // KPI ID to array of historical values
}

export const PDFScorecard: React.FC<PDFScorecardProps> = ({ kpiData, historicalData }) => {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>The Perfect 10 Scorecard</Text>
      
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '25%' }]}>
            <Text style={styles.tableCellHeader}>KPI</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCellHeader}>Current</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCellHeader}>Previous</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCellHeader}>Target</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCellHeader}>Change</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCellHeader}>Status</Text>
          </View>
        </View>
        
        {/* Data Rows */}
        {kpiData.map((kpi) => (
          <View style={styles.tableRow} key={kpi.id}>
            <View style={[styles.tableCol, { width: '25%' }]}>
              <Text style={styles.tableCell}>{kpi.name}</Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text style={styles.kpiValue}>
                {kpi.unit === '$' && '$'}
                {kpi.value.toLocaleString()}
                {kpi.unit === '%' && '%'}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text style={styles.tableCell}>
                {kpi.unit === '$' && '$'}
                {kpi.previousValue?.toLocaleString() || '-'}
                {kpi.unit === '%' && '%'}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text style={styles.tableCell}>
                {kpi.target && (
                  <>
                    {kpi.unit === '$' && '$'}
                    {kpi.target.value.toLocaleString()}
                    {kpi.unit === '%' && '%'}
                  </>
                )}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '15%' }]}>
              <Text style={styles.tableCell}>
                {kpi.change !== undefined && (
                  <>
                    {kpi.changeType === 'increase' ? '+' : ''}
                    {kpi.change}%
                  </>
                )}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: '15%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }]}>
              <View style={kpi.status === 'green' ? styles.greenIndicator : styles.redIndicator} />
            </View>
          </View>
        ))}
      </View>
      
      <Text style={styles.pageNumber}>2</Text>
    </Page>
  )
}