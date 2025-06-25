import { StyleSheet } from '@react-pdf/renderer'

export const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#FFFFFF'
  },
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    padding: 60
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 10
  },
  dateRange: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 40
  },
  companyLogo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 60
  },
  quoteContainer: {
    padding: 30,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginTop: 'auto'
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 1.5
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827'
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginBottom: 20
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableHeader: {
    backgroundColor: '#F3F4F6'
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8
  },
  tableCell: {
    fontSize: 10,
    color: '#374151'
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#111827'
  },
  kpiValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827'
  },
  greenIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 4
  },
  redIndicator: {
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4
  },
  winItem: {
    fontSize: 12,
    color: '#059669',
    marginBottom: 8,
    paddingLeft: 20
  },
  opportunityItem: {
    fontSize: 12,
    color: '#DC2626',
    marginBottom: 8,
    paddingLeft: 20
  },
  actionTable: {
    marginTop: 20
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 40,
    right: 40,
    fontSize: 10,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center'
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    bottom: 20,
    right: 40,
    color: '#9CA3AF'
  }
})