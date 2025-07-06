import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles, BRAND_COLORS } from './PDFStyles'

interface PDFCheckInQuestionsProps {
  type: 'weekly' | 'monthly' | 'annual'
}

export const PDFCheckInQuestions: React.FC<PDFCheckInQuestionsProps> = ({ type }) => {
  const getTimeframe = () => {
    switch (type) {
      case 'weekly': return 'week'
      case 'monthly': return 'month'
      case 'annual': return 'year'
    }
  }
  
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Weekly Check-In Questions</Text>
      
      <View style={{ marginTop: 30 }}>
        <Text style={[styles.tableCell, { marginBottom: 20, fontWeight: 'bold', fontSize: 12 }]}>
          1. What specific actions did we take this {getTimeframe()} to improve our red KPIs?
        </Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: BRAND_COLORS.neutral, marginBottom: 30, paddingBottom: 30 }} />
        
        <Text style={[styles.tableCell, { marginBottom: 20, fontWeight: 'bold', fontSize: 12 }]}>
          2. What obstacles are preventing us from hitting our targets?
        </Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: BRAND_COLORS.neutral, marginBottom: 30, paddingBottom: 30 }} />
        
        <Text style={[styles.tableCell, { marginBottom: 20, fontWeight: 'bold', fontSize: 12 }]}>
          3. Who is accountable for each improvement initiative?
        </Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: BRAND_COLORS.neutral, marginBottom: 30, paddingBottom: 30 }} />
        
        <Text style={[styles.tableCell, { marginBottom: 20, fontWeight: 'bold', fontSize: 12 }]}>
          4. What help or resources do we need to succeed?
        </Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: BRAND_COLORS.neutral, marginBottom: 30, paddingBottom: 30 }} />
        
        <Text style={[styles.tableCell, { marginBottom: 20, fontWeight: 'bold', fontSize: 12 }]}>
          5. What are our specific commitments for next {getTimeframe()}?
        </Text>
        <View style={{ borderBottomWidth: 1, borderBottomColor: BRAND_COLORS.neutral, marginBottom: 30, paddingBottom: 30 }} />
      </View>
      
      <Text style={styles.pageNumber}>7</Text>
    </Page>
  )
}