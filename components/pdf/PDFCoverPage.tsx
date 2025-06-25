import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles } from './PDFStyles'
import { getRandomQuote } from '@/lib/pdf/quotes'

interface PDFCoverPageProps {
  type: 'weekly' | 'monthly'
  dateRange: string
}

export const PDFCoverPage: React.FC<PDFCoverPageProps> = ({ type, dateRange }) => {
  const quote = getRandomQuote()
  
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
          <Text style={styles.quoteText}>&quot;{quote.text}&quot;</Text>
          <Text style={styles.quoteAuthor}>— {quote.author}</Text>
        </View>
      </View>
    </Page>
  )
}