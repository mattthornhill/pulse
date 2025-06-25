import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles } from './PDFStyles'

interface PDFCoverPageProps {
  type: 'weekly' | 'monthly'
  dateRange: string
}

export const PDFCoverPage: React.FC<PDFCoverPageProps> = ({ type, dateRange }) => {
  // Mock data - in production this would come from actual sales data
  const biggestQuote = {
    value: 45280,
    customer: 'ABC Manufacturing',
    service: 'Complete HVAC System Replacement',
    tech: 'Mike Johnson',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <View style={styles.coverPage}>
        <View>
          <Text style={styles.companyLogo}>Profit Pulse AI</Text>
        </View>
        
        <View>
          <Text style={styles.title}>
            {type === 'weekly' ? 'Weekly' : 'Monthly'} Leadership Meeting Agenda
          </Text>
          <Text style={styles.subtitle}>Performance Intelligence Report</Text>
          <Text style={styles.dateRange}>{dateRange}</Text>
        </View>
        
        <View style={styles.quoteContainer}>
          <Text style={[styles.sectionTitle, { textAlign: 'center', marginBottom: 15 }]}>Quote of the Month</Text>
          <Text style={[styles.kpiValue, { fontSize: 28, textAlign: 'center', marginBottom: 10, color: '#059669' }]}>
            ${biggestQuote.value.toLocaleString()}
          </Text>
          <Text style={[styles.tableCell, { textAlign: 'center', fontSize: 14, marginBottom: 5 }]}>
            {biggestQuote.customer}
          </Text>
          <Text style={[styles.tableCell, { textAlign: 'center', fontSize: 12, marginBottom: 5 }]}>
            {biggestQuote.service}
          </Text>
          <Text style={[styles.tableCell, { textAlign: 'center', fontSize: 12, color: '#6B7280' }]}>
            {biggestQuote.tech} • {biggestQuote.date}
          </Text>
        </View>
      </View>
    </Page>
  )
}