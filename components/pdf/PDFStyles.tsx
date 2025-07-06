import { StyleSheet } from '@react-pdf/renderer'

// ServicePoint Pro Brand Colors
const BRAND_COLORS = {
  primary: '#1E3A8A',      // Deep blue from logo
  secondary: '#3B82F6',    // Lighter blue
  accent: '#059669',       // Green for positive indicators
  danger: '#DC2626',       // Red for negative indicators
  warning: '#D97706',      // Orange for warnings
  neutral: '#6B7280',      // Gray
  background: '#F8FAFC',   // Light blue-gray background
  surface: '#FFFFFF',      // White surfaces
  text: {
    primary: '#1F2937',    // Dark gray
    secondary: '#6B7280',  // Medium gray
    light: '#9CA3AF'       // Light gray
  }
}

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: BRAND_COLORS.surface,
    color: BRAND_COLORS.text.primary,
    breakBefore: 'avoid',
    breakAfter: 'avoid'
  },
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: 60,
    backgroundColor: BRAND_COLORS.primary,
    color: BRAND_COLORS.surface
  },
  coverHeader: {
    textAlign: 'center',
    marginBottom: 60
  },
  coverLogo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: BRAND_COLORS.surface,
    marginBottom: 20,
    letterSpacing: 1
  },
  coverTagline: {
    fontSize: 14,
    color: BRAND_COLORS.surface,
    opacity: 0.9,
    fontStyle: 'italic'
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: BRAND_COLORS.surface,
    textAlign: 'center',
    lineHeight: 1.2
  },
  subtitle: {
    fontSize: 20,
    color: BRAND_COLORS.surface,
    textAlign: 'center',
    marginBottom: 10,
    opacity: 0.9
  },
  dateRange: {
    fontSize: 18,
    color: BRAND_COLORS.surface,
    textAlign: 'center',
    marginBottom: 40,
    opacity: 0.8
  },
  companyLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND_COLORS.primary,
    textAlign: 'center',
    marginBottom: 60
  },
  quoteContainer: {
    padding: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'solid'
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: BRAND_COLORS.surface,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 1.5,
    opacity: 0.9
  },
  quoteAuthor: {
    fontSize: 14,
    color: BRAND_COLORS.surface,
    textAlign: 'center',
    opacity: 0.8
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: BRAND_COLORS.primary,
    borderBottomWidth: 2,
    borderBottomColor: BRAND_COLORS.primary,
    borderBottomStyle: 'solid',
    paddingBottom: 10
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: BRAND_COLORS.text.primary
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: BRAND_COLORS.neutral,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20,
    borderRadius: 8,
    breakInside: 'avoid'
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: BRAND_COLORS.background
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: BRAND_COLORS.neutral,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 12
  },
  tableCell: {
    fontSize: 10,
    color: BRAND_COLORS.text.secondary,
    lineHeight: 1.3
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BRAND_COLORS.primary
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BRAND_COLORS.text.primary,
    lineHeight: 1.2
  },
  kpiValueLarge: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BRAND_COLORS.primary
  },
  greenIndicator: {
    width: 10,
    height: 10,
    backgroundColor: BRAND_COLORS.accent,
    borderRadius: 5
  },
  redIndicator: {
    width: 10,
    height: 10,
    backgroundColor: BRAND_COLORS.danger,
    borderRadius: 5
  },
  yellowIndicator: {
    width: 10,
    height: 10,
    backgroundColor: BRAND_COLORS.warning,
    borderRadius: 5
  },
  winItem: {
    fontSize: 12,
    color: BRAND_COLORS.accent,
    marginBottom: 10,
    paddingLeft: 20,
    lineHeight: 1.4
  },
  opportunityItem: {
    fontSize: 12,
    color: BRAND_COLORS.danger,
    marginBottom: 10,
    paddingLeft: 20,
    lineHeight: 1.4
  },
  actionTable: {
    marginTop: 20
  },
  statCard: {
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BRAND_COLORS.neutral,
    borderStyle: 'solid'
  },
  statCardLarge: {
    backgroundColor: BRAND_COLORS.primary,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    color: BRAND_COLORS.surface
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    breakInside: 'avoid'
  },
  gridItem: {
    width: '48%',
    marginBottom: 8,
    breakInside: 'avoid'
  },
  gridItemThird: {
    width: '31%',
    marginBottom: 8,
    breakInside: 'avoid'
  },
  gridItemFull: {
    width: '100%',
    marginBottom: 12
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 10,
    color: BRAND_COLORS.text.light,
    fontStyle: 'italic',
    textAlign: 'center',
    borderTopWidth: 1,
    borderTopColor: BRAND_COLORS.neutral,
    borderTopStyle: 'solid',
    paddingTop: 10
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    right: 40,
    color: BRAND_COLORS.text.light
  },
  brandFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
    borderTopStyle: 'solid'
  },
  brandLogo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BRAND_COLORS.surface
  },
  brandContact: {
    fontSize: 12,
    color: BRAND_COLORS.surface,
    opacity: 0.8
  },
  kpiCard: {
    backgroundColor: BRAND_COLORS.background,
    borderRadius: 6,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: BRAND_COLORS.neutral,
    borderStyle: 'solid',
    breakInside: 'avoid'
  },
  kpiCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  kpiCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BRAND_COLORS.text.primary,
    maxWidth: '60%'
  },
  kpiCardValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: BRAND_COLORS.text.primary,
    marginBottom: 3
  },
  kpiCardTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8
  },
  sparklineContainer: {
    marginLeft: 'auto'
  },
  gaugeContainer: {
    width: 80,
    height: 40,
    marginTop: 8
  },
  compactTable: {
    fontSize: 9,
    width: '100%'
  },
  compactTableHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: BRAND_COLORS.primary,
    padding: 8
  },
  compactTableCell: {
    fontSize: 9,
    padding: 8,
    color: BRAND_COLORS.text.secondary
  },
  compactKpiValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BRAND_COLORS.text.primary
  },
  trendArrow: {
    fontSize: 14,
    marginRight: 4
  },
  trendUp: {
    color: BRAND_COLORS.accent
  },
  trendDown: {
    color: BRAND_COLORS.danger
  },
  pageBreak: {
    breakBefore: 'always'
  },
  noBreak: {
    breakInside: 'avoid'
  },
  accountabilitySection: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderStyle: 'solid'
  },
  accountabilityTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 10
  },
  accountabilityItem: {
    fontSize: 11,
    color: '#78350F',
    marginBottom: 8,
    paddingLeft: 20
  },
  logoContainer: {
    width: 300,
    height: 80,
    marginBottom: 30,
    alignSelf: 'center'
  },
  logoImage: {
    width: 300,
    height: 80,
    objectFit: 'contain'
  },
  logoImageSmall: {
    width: 180,
    height: 50,
    objectFit: 'contain'
  }
})

export { BRAND_COLORS }