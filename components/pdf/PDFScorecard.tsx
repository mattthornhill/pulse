import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles, BRAND_COLORS } from './PDFStyles'
import { KPIData } from '@/types/dashboard'

interface PDFScorecardProps {
  kpiData: KPIData[]
  historicalData?: Record<string, number[]> // KPI ID to array of historical values
}

export const PDFScorecard: React.FC<PDFScorecardProps> = ({ kpiData, historicalData }) => {
  const summary = {
    greenCount: kpiData.filter(kpi => kpi.status === 'green').length,
    redCount: kpiData.filter(kpi => kpi.status === 'red').length,
    percentage: Math.round((kpiData.filter(kpi => kpi.status === 'green').length / kpiData.length) * 100)
  }

  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>The Perfect 10 Scorecard</Text>
      
      {/* Executive Summary Cards */}
      <View style={styles.gridContainer}>
        <View style={[styles.statCardLarge, styles.gridItemFull]}>
          <Text style={[styles.kpiValueLarge, { color: BRAND_COLORS.surface, textAlign: 'center', marginBottom: 8 }]}>
            {summary.percentage}%
          </Text>
          <Text style={[styles.sectionSubtitle, { color: BRAND_COLORS.surface, textAlign: 'center', fontSize: 16 }]}>
            Overall Performance Score
          </Text>
          <Text style={[styles.tableCell, { color: BRAND_COLORS.surface, textAlign: 'center', opacity: 0.9 }]}>
            {summary.greenCount} of {kpiData.length} KPIs on target
          </Text>
        </View>
        
        <View style={[styles.statCard, styles.gridItem]}>
          <Text style={[styles.kpiValue, { color: BRAND_COLORS.accent, textAlign: 'center', marginBottom: 4 }]}>
            {summary.greenCount}
          </Text>
          <Text style={[styles.tableCell, { textAlign: 'center', fontWeight: 'bold' }]}>
            On Target
          </Text>
        </View>
        
        <View style={[styles.statCard, styles.gridItem]}>
          <Text style={[styles.kpiValue, { color: BRAND_COLORS.danger, textAlign: 'center', marginBottom: 4 }]}>
            {summary.redCount}
          </Text>
          <Text style={[styles.tableCell, { textAlign: 'center', fontWeight: 'bold' }]}>
            Below Target
          </Text>
        </View>
      </View>
      
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
              <View style={
                kpi.status === 'green' ? styles.greenIndicator : 
                kpi.status === 'red' ? styles.redIndicator : 
                styles.yellowIndicator
              } />
            </View>
          </View>
        ))}
      </View>
      
      {/* Footer */}
      <Text style={styles.footer}>
        Generated by ServicePoint Pro • Profit Pulse AI Dashboard • {new Date().toLocaleDateString()}
      </Text>
      <Text style={styles.pageNumber}>2</Text>
    </Page>
  )
}