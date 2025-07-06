import React from 'react'
import { Page, Text, View, Image, Svg, Path } from '@react-pdf/renderer'
import { styles, BRAND_COLORS } from './PDFStyles'

interface PDFCoverPageProps {
  type: 'weekly' | 'monthly' | 'annual'
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
    <Page size="A4" style={styles.coverPage}>
      <View style={styles.coverPage}>
        {/* Header with ServicePoint Pro Branding */}
        <View style={styles.coverHeader}>
          <View style={styles.logoContainer}>
            <Image 
              src="/images/servicepoint-logo.png" 
              style={styles.logoImage}
              alt="ServicePoint Pro Logo"
            />
          </View>
          <Text style={styles.coverTagline}>AI-Powered, Industry-Crafted Field Service Management Software</Text>
        </View>
        
        {/* Main Title Section */}
        <View>
          <Text style={styles.title}>
            {type === 'weekly' ? 'Weekly' : type === 'monthly' ? 'Monthly' : 'Annual'} Leadership {type === 'annual' ? 'Report' : 'Meeting Agenda'}
          </Text>
          <Text style={styles.subtitle}>Performance Intelligence Report</Text>
          <Text style={styles.dateRange}>{dateRange}</Text>
        </View>
        
        {/* Quote of the Month Section */}
        <View style={styles.quoteContainer}>
          <Text style={[styles.sectionSubtitle, { 
            textAlign: 'center', 
            marginBottom: 15, 
            color: BRAND_COLORS.surface,
            fontSize: 16
          }]}>
            Biggest Sales Estimate This {type === 'weekly' ? 'Week' : type === 'monthly' ? 'Month' : 'Year'}
          </Text>
          <Text style={[styles.kpiValueLarge, { 
            fontSize: 32, 
            textAlign: 'center', 
            marginBottom: 12, 
            color: BRAND_COLORS.surface 
          }]}>
            ${biggestQuote.value.toLocaleString()}
          </Text>
          <Text style={[styles.tableCell, { 
            textAlign: 'center', 
            fontSize: 14, 
            marginBottom: 6,
            color: BRAND_COLORS.surface,
            fontWeight: 'bold'
          }]}>
            {biggestQuote.customer}
          </Text>
          <Text style={[styles.tableCell, { 
            textAlign: 'center', 
            fontSize: 12, 
            marginBottom: 6,
            color: BRAND_COLORS.surface,
            opacity: 0.9
          }]}>
            {biggestQuote.service}
          </Text>
          <Text style={[styles.tableCell, { 
            textAlign: 'center', 
            fontSize: 11, 
            color: BRAND_COLORS.surface,
            opacity: 0.8
          }]}>
            {biggestQuote.tech} • {biggestQuote.date}
          </Text>
        </View>

        {/* Brand Footer */}
        <View style={styles.brandFooter}>
          <Image 
            src="/images/servicepoint-logo.png" 
            style={styles.logoImageSmall}
            alt="ServicePoint Pro Logo"
          />
          <View>
            <Text style={styles.brandContact}>For Performance-Driven Professionals</Text>
          </View>
        </View>
      </View>
    </Page>
  )
}