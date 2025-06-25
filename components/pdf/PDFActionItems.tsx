import React from 'react'
import { Page, Text, View } from '@react-pdf/renderer'
import { styles } from './PDFStyles'

export const PDFActionItems: React.FC = () => {
  const emptyRows = Array(5).fill(null)
  
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.sectionTitle}>Action Items</Text>
      
      <View style={styles.table}>
        {/* Header Row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <View style={[styles.tableCol, { width: '30%' }]}>
            <Text style={styles.tableCellHeader}>Focus Area</Text>
          </View>
          <View style={[styles.tableCol, { width: '35%' }]}>
            <Text style={styles.tableCellHeader}>Action</Text>
          </View>
          <View style={[styles.tableCol, { width: '20%' }]}>
            <Text style={styles.tableCellHeader}>Owner</Text>
          </View>
          <View style={[styles.tableCol, { width: '15%' }]}>
            <Text style={styles.tableCellHeader}>Due Date</Text>
          </View>
        </View>
        
        {/* Empty Rows for manual entry */}
        {emptyRows.map((_, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={[styles.tableCol, { width: '30%', height: 40 }]}>
              <Text style={styles.tableCell}> </Text>
            </View>
            <View style={[styles.tableCol, { width: '35%', height: 40 }]}>
              <Text style={styles.tableCell}> </Text>
            </View>
            <View style={[styles.tableCol, { width: '20%', height: 40 }]}>
              <Text style={styles.tableCell}> </Text>
            </View>
            <View style={[styles.tableCol, { width: '15%', height: 40 }]}>
              <Text style={styles.tableCell}> </Text>
            </View>
          </View>
        ))}
      </View>
      
      <Text style={styles.footer}>
        &quot;What will we do differently this week to improve results and leadership discipline?&quot;
      </Text>
      
      <Text style={styles.pageNumber}>4</Text>
    </Page>
  )
}