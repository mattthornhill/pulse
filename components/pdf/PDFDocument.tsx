'use client'

import React from 'react'
import { Document, PDFDownloadLink } from '@react-pdf/renderer'
import { PDFCoverPage } from './PDFCoverPage'
import { PDFScorecard } from './PDFScorecard'
import { PDFWinsAndOpportunities } from './PDFWinsAndOpportunities'
import { PDFActionItems } from './PDFActionItems'
import { PDFTrends } from './PDFTrends'
import { KPIData } from '@/types/dashboard'
import { Button } from '@/components/ui/button'
import { FileText, Download } from 'lucide-react'

interface PDFDocumentProps {
  type: 'weekly' | 'monthly' | 'annual'
  kpiData: KPIData[]
  dateRange: string
}

const LeadershipAgendaPDF: React.FC<PDFDocumentProps> = ({ type, kpiData, dateRange }) => (
  <Document>
    <PDFCoverPage type={type} dateRange={dateRange} />
    <PDFScorecard kpiData={kpiData} />
    <PDFWinsAndOpportunities kpiData={kpiData} />
    <PDFActionItems />
    {(type === 'monthly' || type === 'annual') && <PDFTrends kpiData={kpiData} />}
  </Document>
)

export const PDFExportButton: React.FC<PDFDocumentProps> = ({ type, kpiData, dateRange }) => {
  const filename = `${type}-leadership-agenda-${new Date().toISOString().split('T')[0]}.pdf`
  
  return (
    <PDFDownloadLink
      document={<LeadershipAgendaPDF type={type} kpiData={kpiData} dateRange={dateRange} />}
      fileName={filename}
    >
      {({ blob, url, loading, error }) => (
        <Button 
          disabled={loading}
          variant="outline"
          className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 rounded-xl transition-all"
        >
          {loading ? (
            <>
              <Download className="w-4 h-4 mr-2 animate-pulse" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2 hidden sm:inline-block" />
              {type === 'weekly' ? 'Weekly' : 
               type === 'monthly' ? 'Monthly' : 
               'Annual'}
            </>
          )}
        </Button>
      )}
    </PDFDownloadLink>
  )
}